"use server";

import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rateLimit";
import { createSemesterEnrollment, getSemesterCourseById } from "@/lib/db/queries";
import { Resend } from "resend";
import { SITE_CONFIG, getEmailFrom } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface EnrollmentData {
  courseId: number;
  name: string;
  email: string;
  phone: string;
  message?: string;
  quizLevel?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[+]?[\d\s-]{9,}$/.test(phone.replace(/\s/g, ""));
}

export async function submitSemesterEnrollment(data: EnrollmentData) {
  try {
    // Rate limiting
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: `Příliš mnoho požadavků. Zkuste to znovu za ${rateLimit.retryAfter} sekund.`,
      };
    }

    // Validation
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: "Jméno musí mít alespoň 2 znaky." };
    }
    if (!data.email || !validateEmail(data.email)) {
      return { success: false, error: "Zadejte platnou emailovou adresu." };
    }
    if (!data.phone || !validatePhone(data.phone)) {
      return { success: false, error: "Zadejte platné telefonní číslo." };
    }

    // Get course info
    const course = await getSemesterCourseById(data.courseId);
    if (!course) {
      return { success: false, error: "Kurz nenalezen." };
    }
    if (course.isFull) {
      return { success: false, error: "Tento kurz je již obsazen." };
    }

    // Create enrollment
    await createSemesterEnrollment({
      semesterCourseId: data.courseId,
      studentName: data.name.trim(),
      studentEmail: data.email.trim().toLowerCase(),
      studentPhone: data.phone.trim(),
      message: data.message?.trim(),
      quizLevel: data.quizLevel,
    });

    // Send emails
    try {
      await Promise.all([
        sendEnrollmentNotification(data, course),
        sendEnrollmentConfirmation(data, course),
      ]);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting enrollment:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Nepodařilo se odeslat přihlášku." };
  }
}

interface CourseInfo {
  level: string;
  dayOfWeek: string;
  timeStart: string;
  timeEnd: string;
  priceCzk: number;
  semesterName: string;
  availableSpots: number;
  maxStudents: number;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("cs-CZ").format(price) + " Kč";
}

async function sendEnrollmentNotification(data: EnrollmentData, course: CourseInfo) {
  if (!resend) return { success: true, skipped: true };

  try {
    await resend.emails.send({
      from: getEmailFrom(),
      to: process.env.ADMIN_EMAIL || SITE_CONFIG.contact.email,
      replyTo: data.email,
      subject: `Nová přihláška do kurzu - ${course.level}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nová přihláška do kurzu</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="background: #d4edda; color: #155724; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
              Zbývá ${course.availableSpots - 1} volných míst z ${course.maxStudents}
            </div>

            <h3 style="color: #E07B53; margin: 0 0 12px 0;">Student</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6B5D54; width: 100px;">Jméno:</td>
                <td style="padding: 8px 0; color: #1F1A17; font-weight: bold;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #E07B53;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Telefon:</td>
                <td style="padding: 8px 0;"><a href="tel:${data.phone}" style="color: #E07B53;">${data.phone}</a></td>
              </tr>
              ${data.quizLevel ? `
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Úroveň z testu:</td>
                <td style="padding: 8px 0; color: #1F1A17; font-weight: bold;">${data.quizLevel}</td>
              </tr>
              ` : ""}
            </table>

            <h3 style="color: #E07B53; margin: 0 0 12px 0;">Vybraný kurz</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr>
                <td style="padding: 8px 0; color: #6B5D54; width: 100px;">Kurz:</td>
                <td style="padding: 8px 0; color: #1F1A17; font-weight: bold; text-transform: capitalize;">${course.level}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Termín:</td>
                <td style="padding: 8px 0; color: #1F1A17;">${course.dayOfWeek}, ${course.timeStart}–${course.timeEnd}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Semestr:</td>
                <td style="padding: 8px 0; color: #1F1A17;">${course.semesterName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B5D54;">Cena:</td>
                <td style="padding: 8px 0; color: #1F1A17; font-weight: bold;">${formatPrice(course.priceCzk)}</td>
              </tr>
            </table>

            ${data.message ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #EBE6DF;">
              <p style="color: #6B5D54; margin: 0 0 8px 0; font-size: 14px;">Zpráva:</p>
              <p style="color: #1F1A17; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            ` : ""}

            <div style="margin-top: 24px;">
              <a href="mailto:${data.email}?subject=Re: Přihláška do kurzu španělštiny - ${course.level}"
                 style="display: inline-block; background: #E07B53; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                Odpovědět studentovi
              </a>
            </div>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false };
  }
}

async function sendEnrollmentConfirmation(data: EnrollmentData, course: CourseInfo) {
  if (!resend) return { success: true, skipped: true };

  try {
    await resend.emails.send({
      from: getEmailFrom(),
      to: data.email,
      subject: `Potvrzení přihlášky - ${course.level}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">¡Hola ${data.name}!</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="color: #1F1A17; font-size: 16px; line-height: 1.6;">
              Děkujeme za vaši přihlášku do kurzu španělštiny! Vaši rezervaci jsme obdrželi a brzy vás budeme kontaktovat.
            </p>

            <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 16px; border: 2px solid #E07B53;">
              <h3 style="color: #E07B53; margin: 0 0 12px 0;">Váš vybraný kurz</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54; width: 100px;">Kurz:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold; text-transform: capitalize;">${course.level}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Termín:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${course.dayOfWeek}, ${course.timeStart}–${course.timeEnd}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Semestr:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${course.semesterName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Cena:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold;">${formatPrice(course.priceCzk)}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 20px; padding: 16px; background: #FFE5E5; border-radius: 12px;">
              <p style="color: #C4613D; margin: 0; font-size: 14px;">
                <strong>Co bude následovat:</strong> Ozveme se vám s dalšími informacemi o platbě a zahájení kurzu.
              </p>
            </div>

            <p style="color: #1F1A17; font-size: 16px; line-height: 1.6; margin-top: 24px;">
              ¡Hasta pronto!<br>
              <strong>Tým Španělština Brno</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <p style="color: #6B5D54; font-size: 12px; margin: 0;">
              ${SITE_CONFIG.email.fromName} | ${SITE_CONFIG.contact.address}<br>
              <a href="mailto:${SITE_CONFIG.contact.email}" style="color: #E07B53;">${SITE_CONFIG.contact.email}</a>
            </p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation:", error);
    return { success: false };
  }
}
