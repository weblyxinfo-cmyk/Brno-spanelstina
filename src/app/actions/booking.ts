"use server";

import { db } from "@/lib/db";
import { lessons, timeSlots, bookings } from "@/lib/db/schema";
import { eq, and, gte, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sendBookingConfirmation, sendBookingNotification } from "@/lib/email";

// Helper to ensure db is available
function getDb() {
  if (!db) {
    throw new Error("Database not configured");
  }
  return db;
}

// ============ PUBLIC QUERIES ============

export async function getActiveLessons() {
  return getDb()
    .select()
    .from(lessons)
    .where(eq(lessons.active, true))
    .orderBy(asc(lessons.sortOrder));
}

export async function getLessonById(id: number) {
  const result = await getDb().select().from(lessons).where(eq(lessons.id, id));
  return result[0] || null;
}

export async function getAvailableTimeSlots(lessonId: number) {
  const now = new Date().toISOString();

  return getDb()
    .select()
    .from(timeSlots)
    .where(
      and(
        eq(timeSlots.lessonId, lessonId),
        eq(timeSlots.available, true),
        gte(timeSlots.startTime, now)
      )
    )
    .orderBy(asc(timeSlots.startTime));
}

export async function getAvailableDates(lessonId: number): Promise<string[]> {
  const slots = await getAvailableTimeSlots(lessonId);

  // Extract unique dates
  const dates = new Set<string>();
  slots.forEach((slot) => {
    const date = slot.startTime.split("T")[0];
    dates.add(date);
  });

  return Array.from(dates).sort();
}

export async function getTimeSlotsForDate(lessonId: number, date: string) {
  const slots = await getAvailableTimeSlots(lessonId);

  return slots.filter((slot) => slot.startTime.startsWith(date));
}

// ============ BOOKING CREATION ============

interface CreateBookingData {
  lessonId: number;
  timeSlotId: number;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  notes?: string;
}

export async function createBooking(data: CreateBookingData) {
  try {
    const database = getDb();

    // Verify the lesson exists and is active
    const lesson = await database
      .select()
      .from(lessons)
      .where(eq(lessons.id, data.lessonId));

    if (!lesson[0] || !lesson[0].active) {
      return { success: false, error: "Lekce není dostupná." };
    }

    // Verify the time slot exists and is available
    const slot = await database
      .select()
      .from(timeSlots)
      .where(eq(timeSlots.id, data.timeSlotId));

    if (!slot[0] || !slot[0].available) {
      return { success: false, error: "Termín již není dostupný." };
    }

    // Create the booking (confirmed immediately, no payment)
    await database.insert(bookings).values({
      lessonId: data.lessonId,
      timeSlotId: data.timeSlotId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      studentPhone: data.studentPhone || null,
      notes: data.notes || null,
      status: "confirmed",
      pricePaid: null,
    });

    // Mark the time slot as unavailable
    await database
      .update(timeSlots)
      .set({ available: false })
      .where(eq(timeSlots.id, data.timeSlotId));

    // Get the booking ID (for SQLite)
    const newBookings = await database
      .select()
      .from(bookings)
      .where(eq(bookings.studentEmail, data.studentEmail))
      .orderBy(asc(bookings.id));

    const newBooking = newBookings[newBookings.length - 1];

    // Send confirmation emails
    if (newBooking) {
      await sendBookingConfirmation({
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        lessonName: lesson[0].name,
        startTime: slot[0].startTime,
        pricePaid: 0,
      });

      await sendBookingNotification({
        studentName: data.studentName,
        studentEmail: data.studentEmail,
        studentPhone: data.studentPhone,
        lessonName: lesson[0].name,
        startTime: slot[0].startTime,
        pricePaid: 0,
      });
    }

    revalidatePath("/rezervace");

    return {
      success: true,
      bookingId: newBooking?.id,
      lesson: lesson[0],
      timeSlot: slot[0],
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Nepodařilo se vytvořit rezervaci." };
  }
}

// ============ BOOKING LOOKUP ============

export async function getBookingDetails(bookingId: number) {
  try {
    const database = getDb();

    const booking = await database
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId));

    if (!booking[0]) {
      return null;
    }

    const lesson = booking[0].lessonId
      ? await database
          .select()
          .from(lessons)
          .where(eq(lessons.id, booking[0].lessonId))
      : null;

    const timeSlot = booking[0].timeSlotId
      ? await database
          .select()
          .from(timeSlots)
          .where(eq(timeSlots.id, booking[0].timeSlotId))
      : null;

    return {
      booking: booking[0],
      lesson: lesson?.[0] || null,
      timeSlot: timeSlot?.[0] || null,
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return null;
  }
}
