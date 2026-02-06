"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { checkRateLimit } from "@/lib/rateLimit";
import { Resend } from "resend";
import { SITE_CONFIG, getEmailFrom } from "@/lib/constants";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function getDb() {
  if (!db) {
    throw new Error("Database not configured");
  }
  return db;
}

export interface CourseReservationData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  courseName: string;
  courseDay: string;
  courseTime: string;
  coursePrice: string;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[+]?[\d\s-]{9,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000);
}

function validateReservationData(data: CourseReservationData): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: "name", message: "Jméno musí mít alespoň 2 znaky." });
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: "email", message: "Zadejte platnou emailovou adresu." });
  }

  if (!data.phone || !validatePhone(data.phone)) {
    errors.push({ field: "phone", message: "Zadejte platné telefonní číslo." });
  }

  if (!data.courseName) {
    errors.push({ field: "courseName", message: "Vyberte kurz." });
  }

  return errors;
}

export async function submitCourseReservation(data: CourseReservationData) {
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
        rateLimited: true,
        retryAfter: rateLimit.retryAfter,
      };
    }

    // Validate
    const errors = validateReservationData(data);
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        error: errors[0].message,
      };
    }

    // Build message with course details
    const courseDetails = `Kurz: ${data.courseName}\nDen: ${data.courseDay}\nČas: ${data.courseTime}\nCena: ${data.coursePrice}`;
    const fullMessage = data.message
      ? `${courseDetails}\n\nPoznámka: ${data.message}`
      : courseDetails;

    // Sanitize and save to DB
    const sanitizedData = {
      name: sanitizeInput(data.name),
      email: data.email.trim().toLowerCase(),
      phone: sanitizeInput(data.phone),
      courseType: `Rezervace: ${data.courseName}`,
      message: sanitizeInput(fullMessage),
    };

    await getDb().insert(contactMessages).values(sanitizedData);

    // Send emails
    try {
      await Promise.all([
        sendReservationNotification(data),
        sendReservationConfirmation(data),
      ]);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting reservation:", error);
    return {
      success: false,
      error: "Nepodařilo se odeslat rezervaci. Zkuste to prosím znovu.",
    };
  }
}

async function sendReservationNotification(data: CourseReservationData) {
  if (!resend) {
    console.log("RESEND_API_KEY not set, skipping notification");
    return { success: true, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: process.env.ADMIN_EMAIL || SITE_CONFIG.contact.email,
      replyTo: data.email,
      subject: `Nová rezervace kurzu - ${data.courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Nová rezervace kurzu</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <div style="background: #d4edda; color: #155724; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px;">
              Zájem o kurz jarního semestru 2026
            </div>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6B5D54; width: 120px;">Jméno:</td>
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
            </table>

            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 12px; border: 2px solid #E07B53;">
              <h3 style="color: #E07B53; margin: 0 0 12px 0; font-size: 16px;">Detail kurzu</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54; width: 80px;">Kurz:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold;">${data.courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Den:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${data.courseDay}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Čas:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${data.courseTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Cena:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold;">${data.coursePrice}</td>
                </tr>
              </table>
            </div>

            ${data.message ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #EBE6DF;">
              <p style="color: #6B5D54; margin: 0 0 8px 0; font-size: 14px;">Poznámka:</p>
              <p style="color: #1F1A17; margin: 0; white-space: pre-wrap;">${data.message}</p>
            </div>
            ` : ""}

            <div style="margin-top: 24px;">
              <a href="mailto:${data.email}?subject=Re: Rezervace kurzu španělštiny - ${data.courseName}"
                 style="display: inline-block; background: #E07B53; color: white; padding: 12px 24px; border-radius: 50px; text-decoration: none; font-weight: bold;">
                Odpovědět
              </a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Error sending notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
}

async function sendReservationConfirmation(data: CourseReservationData) {
  if (!resend) {
    return { success: true, skipped: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: getEmailFrom(),
      to: data.email,
      subject: `Potvrzení zájmu o kurz - ${data.courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #E07B53, #C4613D); padding: 24px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">¡Hola ${data.name}!</h1>
          </div>

          <div style="background: #FBF9F6; padding: 24px; border: 1px solid #EBE6DF; border-top: none; border-radius: 0 0 16px 16px;">
            <p style="color: #1F1A17; font-size: 16px; line-height: 1.6;">
              Děkujeme za váš zájem o kurz španělštiny! Vaši rezervaci jsme obdrželi a budeme vás kontaktovat.
            </p>

            <div style="margin-top: 20px; padding: 16px; background: white; border-radius: 12px; border: 2px solid #E07B53;">
              <h3 style="color: #E07B53; margin: 0 0 12px 0; font-size: 16px;">Váš vybraný kurz</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54; width: 80px;">Kurz:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold;">${data.courseName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Den:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${data.courseDay}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Čas:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">${data.courseTime}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Cena:</td>
                  <td style="padding: 6px 0; color: #1F1A17; font-weight: bold;">${data.coursePrice}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #6B5D54;">Semestr:</td>
                  <td style="padding: 6px 0; color: #1F1A17;">Jarní 2026 (16.2. – 26.6.)</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 20px; padding: 16px; background: #FFE5E5; border-radius: 12px;">
              <p style="color: #C4613D; margin: 0; font-size: 14px;">
                <strong>Co bude následovat:</strong> Ozveme se vám s dalšími informacemi a potvrdíme dostupnost místa v kurzu.
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

    if (error) {
      console.error("Error sending confirmation:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation:", error);
    return { success: false, error };
  }
}
