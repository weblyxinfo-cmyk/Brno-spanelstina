import { db } from "./index";
import { courses, lektori, levels, testimonials, pricing, pageContent, seoMeta, pageViews, settings } from "./schema";
import { eq, asc, desc, sql } from "drizzle-orm";

// Courses
export async function getCourses(category?: string) {
  if (!db) return [];
  if (category && category !== "all") {
    return db.select().from(courses).where(eq(courses.category, category));
  }
  return db.select().from(courses);
}

export async function getFeaturedCourses() {
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.featured, true));
}

export async function getCourseById(id: number) {
  if (!db) return null;
  const result = await db.select().from(courses).where(eq(courses.id, id));
  return result[0] || null;
}

// Lektoři
export async function getLektori() {
  if (!db) return [];
  return db.select().from(lektori);
}

export async function getLektorById(id: number) {
  if (!db) return null;
  const result = await db.select().from(lektori).where(eq(lektori.id, id));
  return result[0] || null;
}

// Jazykové úrovně
export async function getLevels() {
  if (!db) return [];
  return db.select().from(levels).orderBy(asc(levels.sortOrder));
}

export async function getLevelByCode(code: string) {
  if (!db) return null;
  const result = await db.select().from(levels).where(eq(levels.code, code));
  return result[0] || null;
}

// Testimonials / Reference - only approved for public display
export async function getTestimonials(featuredOnly = false) {
  if (!db) return [];
  if (featuredOnly) {
    return db.select().from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.id));
  }
  return db.select().from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.id));
}

export async function getFeaturedTestimonials(limit = 3) {
  if (!db) return [];
  // Featured AND approved testimonials for homepage
  const result = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.id));

  return result.filter(t => t.featured).slice(0, limit);
}

// Ceník
export async function getPricing() {
  if (!db) return [];
  return db.select().from(pricing).orderBy(asc(pricing.sortOrder));
}

// Helper pro parsování JSON polí z DB
export function parseJsonField<T>(field: string | null): T {
  if (!field) return [] as T;
  try {
    return JSON.parse(field) as T;
  } catch {
    return [] as T;
  }
}

// Page Content (CMS)
export type ContentMap = Record<string, Record<string, string>>;

export async function getPageContent(page: string): Promise<ContentMap> {
  if (!db) return {};
  const content = await db.select().from(pageContent).where(eq(pageContent.page, page));

  // Convert to nested map: section -> key -> value
  const contentMap: ContentMap = {};
  content.forEach((item) => {
    if (!contentMap[item.section]) {
      contentMap[item.section] = {};
    }
    contentMap[item.section][item.key] = item.value || "";
  });

  return contentMap;
}

// Helper to get content value with fallback
export function getContent(
  contentMap: ContentMap,
  section: string,
  key: string,
  fallback: string = ""
): string {
  return contentMap[section]?.[key] || fallback;
}

// SEO Metadata
export interface SeoData {
  title: string | null;
  description: string | null;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}

export async function getPageSeo(page: string): Promise<SeoData | null> {
  if (!db) return null;
  const result = await db.select().from(seoMeta).where(eq(seoMeta.page, page));
  if (result.length === 0) return null;

  return {
    title: result[0].title,
    description: result[0].description,
    keywords: result[0].keywords,
    ogTitle: result[0].ogTitle,
    ogDescription: result[0].ogDescription,
    ogImage: result[0].ogImage,
  };
}

// Generate Next.js metadata from SEO data
export function generateMetadata(seo: SeoData | null, defaults: { title: string; description: string }) {
  return {
    title: seo?.title || defaults.title,
    description: seo?.description || defaults.description,
    keywords: seo?.keywords || undefined,
    openGraph: {
      title: seo?.ogTitle || seo?.title || defaults.title,
      description: seo?.ogDescription || seo?.description || defaults.description,
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
  };
}

// Page Views / Návštěvnost
export async function getPageViews(): Promise<number> {
  if (!db) return 0;
  const result = await db.select().from(pageViews).where(eq(pageViews.id, 1));
  if (result.length === 0) return 0;
  return result[0].count;
}

export async function incrementPageViews(): Promise<number> {
  if (!db) return 0;
  // Try to update existing record
  const existing = await db.select().from(pageViews).where(eq(pageViews.id, 1));

  if (existing.length === 0) {
    // Create initial record
    await db.insert(pageViews).values({ id: 1, count: 1 });
    return 1;
  }

  // Increment existing
  const newCount = existing[0].count + 1;
  await db
    .update(pageViews)
    .set({ count: newCount, updatedAt: sql`CURRENT_TIMESTAMP` })
    .where(eq(pageViews.id, 1));

  return newCount;
}

// Site Settings
export type SettingsMap = Record<string, string>;

export async function getSettings(): Promise<SettingsMap> {
  if (!db) return {};
  const result = await db.select().from(settings);
  const settingsMap: SettingsMap = {};
  result.forEach((item) => {
    settingsMap[item.key] = item.value || "";
  });
  return settingsMap;
}

export async function getSetting(key: string): Promise<string | null> {
  if (!db) return null;
  const result = await db.select().from(settings).where(eq(settings.key, key));
  return result[0]?.value || null;
}

// ============ BOOKING QUERIES ============

import { lessons, timeSlots, bookings } from "./schema";
import { and, gte } from "drizzle-orm";

export async function getActiveLessons() {
  if (!db) return [];
  return db.select().from(lessons).where(eq(lessons.active, true)).orderBy(asc(lessons.sortOrder));
}

export async function getAvailableTimeSlots(lessonId: number) {
  if (!db) return [];
  const now = new Date().toISOString();
  return db
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

export async function getBookingById(id: number) {
  if (!db) return null;
  const result = await db.select().from(bookings).where(eq(bookings.id, id));
  return result[0] || null;
}
