"use server";

import { db } from "@/lib/db";
import { lessons, timeSlots, bookings } from "@/lib/db/schema";
import { eq, desc, asc, and, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to ensure db is available
function getDb() {
  if (!db) {
    throw new Error("Database not configured");
  }
  return db;
}

// ============ LESSONS (LEKCE) ============

export async function getLessonsAdmin() {
  return getDb().select().from(lessons).orderBy(asc(lessons.sortOrder));
}

export async function getLessonById(id: number) {
  const result = await getDb().select().from(lessons).where(eq(lessons.id, id));
  return result[0] || null;
}

export async function createLesson(data: {
  name: string;
  description?: string;
  durationMinutes?: number;
  priceCzk: number;
  maxStudents?: number;
  category: string;
  active?: boolean;
  sortOrder?: number;
}) {
  try {
    await getDb().insert(lessons).values({
      name: data.name,
      description: data.description || null,
      durationMinutes: data.durationMinutes || 60,
      priceCzk: data.priceCzk,
      maxStudents: data.maxStudents || 1,
      category: data.category,
      active: data.active ?? true,
      sortOrder: data.sortOrder || 0,
    });
    revalidatePath("/admin/lekce");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error creating lesson:", error);
    return { success: false, error: "Nepodařilo se vytvořit lekci." };
  }
}

export async function updateLesson(
  id: number,
  data: {
    name: string;
    description?: string;
    durationMinutes?: number;
    priceCzk: number;
    maxStudents?: number;
    category: string;
    active?: boolean;
    sortOrder?: number;
  }
) {
  try {
    await getDb()
      .update(lessons)
      .set({
        name: data.name,
        description: data.description || null,
        durationMinutes: data.durationMinutes || 60,
        priceCzk: data.priceCzk,
        maxStudents: data.maxStudents || 1,
        category: data.category,
        active: data.active ?? true,
        sortOrder: data.sortOrder || 0,
      })
      .where(eq(lessons.id, id));
    revalidatePath("/admin/lekce");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error updating lesson:", error);
    return { success: false, error: "Nepodařilo se upravit lekci." };
  }
}

export async function deleteLesson(id: number) {
  try {
    // First check if there are any bookings for this lesson
    const bookingsExist = await getDb()
      .select()
      .from(bookings)
      .where(eq(bookings.lessonId, id));

    if (bookingsExist.length > 0) {
      return { success: false, error: "Nelze smazat lekci s existujícími rezervacemi." };
    }

    // Delete associated time slots first
    await getDb().delete(timeSlots).where(eq(timeSlots.lessonId, id));

    // Then delete the lesson
    await getDb().delete(lessons).where(eq(lessons.id, id));
    revalidatePath("/admin/lekce");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return { success: false, error: "Nepodařilo se smazat lekci." };
  }
}

// ============ TIME SLOTS (TERMÍNY) ============

export async function getTimeSlotsAdmin(lessonId?: number) {
  const database = getDb();
  const now = new Date().toISOString();

  if (lessonId) {
    return database
      .select()
      .from(timeSlots)
      .where(and(eq(timeSlots.lessonId, lessonId), gte(timeSlots.startTime, now)))
      .orderBy(asc(timeSlots.startTime));
  }

  return database
    .select()
    .from(timeSlots)
    .orderBy(asc(timeSlots.startTime));
}

export async function getAllTimeSlots() {
  return getDb().select().from(timeSlots).orderBy(asc(timeSlots.startTime));
}

export async function getTimeSlotById(id: number) {
  const result = await getDb().select().from(timeSlots).where(eq(timeSlots.id, id));
  return result[0] || null;
}

export async function createTimeSlot(data: {
  lessonId: number;
  startTime: string;
  endTime: string;
  available?: boolean;
}) {
  try {
    await getDb().insert(timeSlots).values({
      lessonId: data.lessonId,
      startTime: data.startTime,
      endTime: data.endTime,
      available: data.available ?? true,
    });
    revalidatePath("/admin/terminy");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error creating time slot:", error);
    return { success: false, error: "Nepodařilo se vytvořit termín." };
  }
}

export async function createMultipleTimeSlots(
  slots: Array<{
    lessonId: number;
    startTime: string;
    endTime: string;
  }>
) {
  try {
    for (const slot of slots) {
      await getDb().insert(timeSlots).values({
        lessonId: slot.lessonId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: true,
      });
    }
    revalidatePath("/admin/terminy");
    revalidatePath("/rezervace");
    return { success: true, count: slots.length };
  } catch (error) {
    console.error("Error creating time slots:", error);
    return { success: false, error: "Nepodařilo se vytvořit termíny." };
  }
}

export async function updateTimeSlot(
  id: number,
  data: {
    lessonId?: number;
    startTime?: string;
    endTime?: string;
    available?: boolean;
  }
) {
  try {
    await getDb()
      .update(timeSlots)
      .set(data)
      .where(eq(timeSlots.id, id));
    revalidatePath("/admin/terminy");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error updating time slot:", error);
    return { success: false, error: "Nepodařilo se upravit termín." };
  }
}

export async function deleteTimeSlot(id: number) {
  try {
    // Check if there are bookings for this slot
    const bookingsExist = await getDb()
      .select()
      .from(bookings)
      .where(eq(bookings.timeSlotId, id));

    if (bookingsExist.length > 0) {
      return { success: false, error: "Nelze smazat termín s existující rezervací." };
    }

    await getDb().delete(timeSlots).where(eq(timeSlots.id, id));
    revalidatePath("/admin/terminy");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return { success: false, error: "Nepodařilo se smazat termín." };
  }
}

// ============ BOOKINGS (REZERVACE) ============

export async function getBookingsAdmin(status?: string) {
  const database = getDb();

  if (status && status !== "all") {
    return database
      .select()
      .from(bookings)
      .where(eq(bookings.status, status))
      .orderBy(desc(bookings.createdAt));
  }

  return database.select().from(bookings).orderBy(desc(bookings.createdAt));
}

export async function getBookingById(id: number) {
  const result = await getDb().select().from(bookings).where(eq(bookings.id, id));
  return result[0] || null;
}

export async function getBookingWithDetails(id: number) {
  const booking = await getBookingById(id);
  if (!booking) return null;

  const lesson = booking.lessonId
    ? await getLessonById(booking.lessonId)
    : null;
  const timeSlot = booking.timeSlotId
    ? await getTimeSlotById(booking.timeSlotId)
    : null;

  return { booking, lesson, timeSlot };
}

export async function updateBookingStatus(id: number, status: string) {
  try {
    await getDb()
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id));
    revalidatePath("/admin/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Nepodařilo se změnit stav rezervace." };
  }
}

export async function deleteBooking(id: number) {
  try {
    // Get the booking to find the time slot
    const booking = await getBookingById(id);

    if (booking?.timeSlotId) {
      // Make the time slot available again
      await getDb()
        .update(timeSlots)
        .set({ available: true })
        .where(eq(timeSlots.id, booking.timeSlotId));
    }

    await getDb().delete(bookings).where(eq(bookings.id, id));
    revalidatePath("/admin/rezervace");
    revalidatePath("/rezervace");
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: "Nepodařilo se smazat rezervaci." };
  }
}

// ============ DASHBOARD STATS ============

export async function getBookingStats() {
  const [allBookings, allLessons, allSlots] = await Promise.all([
    getDb().select().from(bookings),
    getDb().select().from(lessons).where(eq(lessons.active, true)),
    getDb().select().from(timeSlots).where(eq(timeSlots.available, true)),
  ]);

  const pendingCount = allBookings.filter((b) => b.status === "pending").length;
  const paidCount = allBookings.filter((b) => b.status === "confirmed" || b.status === "paid").length;
  const cancelledCount = allBookings.filter((b) => b.status === "cancelled").length;
  const totalRevenue = allBookings
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + (b.pricePaid || 0), 0);

  return {
    totalBookings: allBookings.length,
    pendingBookings: pendingCount,
    paidBookings: paidCount,
    cancelledBookings: cancelledCount,
    activeLessons: allLessons.length,
    availableSlots: allSlots.length,
    totalRevenue,
  };
}
