"use server";

import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Helper to ensure db is available
function getDb() {
  if (!db) {
    throw new Error("Database not configured");
  }
  return db;
}

interface TestimonialFormData {
  text: string;
  author: string;
  course?: string;
  rating?: number;
}

interface ValidationError {
  field: string;
  message: string;
}

function validateTestimonialData(data: TestimonialFormData): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate author name
  if (!data.author || data.author.trim().length < 2) {
    errors.push({ field: "author", message: "Jméno musí mít alespoň 2 znaky." });
  }
  if (data.author && data.author.length > 100) {
    errors.push({ field: "author", message: "Jméno je příliš dlouhé." });
  }

  // Validate text
  if (!data.text || data.text.trim().length < 20) {
    errors.push({ field: "text", message: "Recenze musí mít alespoň 20 znaků." });
  }
  if (data.text && data.text.length > 1000) {
    errors.push({ field: "text", message: "Recenze je příliš dlouhá (max 1000 znaků)." });
  }

  // Validate rating
  if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
    errors.push({ field: "rating", message: "Hodnocení musí být mezi 1 a 5." });
  }

  return errors;
}

export async function submitTestimonial(formData: TestimonialFormData) {
  // Validate input
  const errors = validateTestimonialData(formData);
  if (errors.length > 0) {
    return { success: false, errors };
  }

  try {
    await getDb().insert(testimonials).values({
      text: formData.text.trim(),
      author: formData.author.trim(),
      course: formData.course?.trim() || null,
      rating: formData.rating || 5,
      featured: false,
      approved: false, // Needs admin approval
    });

    return {
      success: true,
      message: "Děkujeme za vaši recenzi! Bude zveřejněna po schválení."
    };
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return {
      success: false,
      error: "Nepodařilo se odeslat recenzi. Zkuste to prosím později."
    };
  }
}

// Get only approved testimonials for public display
export async function getPublicTestimonials() {
  return getDb().select().from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(testimonials.id);
}
