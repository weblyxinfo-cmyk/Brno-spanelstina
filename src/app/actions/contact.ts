"use server";

import { headers } from "next/headers";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendContactNotification, sendConfirmationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";

// Helper to ensure db is available
function getDb() {
  if (!db) {
    throw new Error("Database not configured");
  }
  return db;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  courseType?: string;
  message: string;
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
  // Allow empty or valid phone format
  if (!phone) return true;
  const phoneRegex = /^[+]?[\d\s-]{9,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 1000); // Limit length
}

function validateFormData(formData: ContactFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.push({ field: "name", message: "Jméno musí mít alespoň 2 znaky." });
  }
  if (formData.name.length > 100) {
    errors.push({ field: "name", message: "Jméno je příliš dlouhé." });
  }

  // Email validation
  if (!formData.email || !validateEmail(formData.email)) {
    errors.push({ field: "email", message: "Zadejte platnou emailovou adresu." });
  }

  // Phone validation (optional)
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.push({ field: "phone", message: "Zadejte platné telefonní číslo." });
  }

  // Message validation
  if (!formData.message || formData.message.trim().length < 10) {
    errors.push({ field: "message", message: "Zpráva musí mít alespoň 10 znaků." });
  }
  if (formData.message.length > 2000) {
    errors.push({ field: "message", message: "Zpráva je příliš dlouhá (max 2000 znaků)." });
  }

  return errors;
}

export async function submitContactForm(formData: ContactFormData) {
  try {
    // Rate limiting check
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

    // Validate input
    const errors = validateFormData(formData);
    if (errors.length > 0) {
      return {
        success: false,
        errors,
        error: errors[0].message
      };
    }

    // Sanitize input
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone ? sanitizeInput(formData.phone) : null,
      courseType: formData.courseType || null,
      message: sanitizeInput(formData.message),
    };

    // Insert into database
    await getDb().insert(contactMessages).values(sanitizedData);

    // Send email notifications (don't fail if email fails)
    try {
      await Promise.all([
        sendContactNotification(sanitizedData),
        sendConfirmationEmail(sanitizedData),
      ]);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // Continue anyway - the message was saved to DB
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Nepodařilo se odeslat zprávu. Zkuste to prosím znovu."
    };
  }
}

// Admin function to get contact messages
export async function getContactMessages() {
  try {
    const messages = await getDb()
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.id));
    return { success: true, messages };
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return { success: false, messages: [] };
  }
}

// Admin function to mark message as read
export async function markMessageAsRead(id: number) {
  try {
    await getDb()
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false };
  }
}
