"use server";

import { db } from "@/lib/db";
import { courses, lektori, levels, testimonials, pricing, contactMessages, pageViews } from "@/lib/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ============ COURSES ============

export async function getCourses() {
  return db.select().from(courses);
}

export async function createCourse(data: {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  badge?: string;
  category: string;
  featured?: boolean;
}) {
  try {
    await db.insert(courses).values({
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      icon: data.icon || null,
      badge: data.badge || null,
      category: data.category,
      featured: data.featured || false,
    });
    revalidatePath("/admin/kurzy");
    revalidatePath("/kurzy");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating course:", error);
    return { success: false, error: "Nepodařilo se vytvořit kurz." };
  }
}

export async function updateCourse(
  id: number,
  data: {
    title: string;
    subtitle?: string;
    description?: string;
    icon?: string;
    badge?: string;
    category: string;
    featured?: boolean;
  }
) {
  try {
    await db
      .update(courses)
      .set({
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        icon: data.icon || null,
        badge: data.badge || null,
        category: data.category,
        featured: data.featured || false,
      })
      .where(eq(courses.id, id));
    revalidatePath("/admin/kurzy");
    revalidatePath("/kurzy");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating course:", error);
    return { success: false, error: "Nepodařilo se upravit kurz." };
  }
}

export async function deleteCourse(id: number) {
  try {
    await db.delete(courses).where(eq(courses.id, id));
    revalidatePath("/admin/kurzy");
    revalidatePath("/kurzy");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting course:", error);
    return { success: false, error: "Nepodařilo se smazat kurz." };
  }
}

// ============ LEKTORI ============

export async function getLektori() {
  return db.select().from(lektori);
}

export async function createLektor(data: {
  name: string;
  role?: string;
  origin?: string;
  originFlag?: string;
  badge?: string;
  badgeIcon?: string;
  avatar?: string;
  bio?: string[];
  highlights?: Array<{ icon: string; text: string }>;
}) {
  try {
    await db.insert(lektori).values({
      name: data.name,
      role: data.role || null,
      origin: data.origin || null,
      originFlag: data.originFlag || null,
      badge: data.badge || null,
      badgeIcon: data.badgeIcon || null,
      avatar: data.avatar || null,
      bio: data.bio ? JSON.stringify(data.bio) : null,
      highlights: data.highlights ? JSON.stringify(data.highlights) : null,
    });
    revalidatePath("/admin/lektori");
    revalidatePath("/lektori");
    return { success: true };
  } catch (error) {
    console.error("Error creating lektor:", error);
    return { success: false, error: "Nepodařilo se vytvořit lektora." };
  }
}

export async function updateLektor(
  id: number,
  data: {
    name: string;
    role?: string;
    origin?: string;
    originFlag?: string;
    badge?: string;
    badgeIcon?: string;
    avatar?: string;
    bio?: string[];
    highlights?: Array<{ icon: string; text: string }>;
  }
) {
  try {
    await db
      .update(lektori)
      .set({
        name: data.name,
        role: data.role || null,
        origin: data.origin || null,
        originFlag: data.originFlag || null,
        badge: data.badge || null,
        badgeIcon: data.badgeIcon || null,
        avatar: data.avatar || null,
        bio: data.bio ? JSON.stringify(data.bio) : null,
        highlights: data.highlights ? JSON.stringify(data.highlights) : null,
      })
      .where(eq(lektori.id, id));
    revalidatePath("/admin/lektori");
    revalidatePath("/lektori");
    return { success: true };
  } catch (error) {
    console.error("Error updating lektor:", error);
    return { success: false, error: "Nepodařilo se upravit lektora." };
  }
}

export async function deleteLektor(id: number) {
  try {
    await db.delete(lektori).where(eq(lektori.id, id));
    revalidatePath("/admin/lektori");
    revalidatePath("/lektori");
    return { success: true };
  } catch (error) {
    console.error("Error deleting lektor:", error);
    return { success: false, error: "Nepodařilo se smazat lektora." };
  }
}

// ============ LEVELS ============

export async function getLevels() {
  return db.select().from(levels).orderBy(asc(levels.sortOrder));
}

export async function createLevel(data: {
  code: string;
  label?: string;
  title: string;
  subtitle?: string;
  description?: string;
  grammarTitle?: string;
  grammar?: string[];
  color?: string;
  sortOrder?: number;
}) {
  try {
    await db.insert(levels).values({
      code: data.code,
      label: data.label || null,
      title: data.title,
      subtitle: data.subtitle || null,
      description: data.description || null,
      grammarTitle: data.grammarTitle || null,
      grammar: data.grammar ? JSON.stringify(data.grammar) : null,
      color: data.color || null,
      sortOrder: data.sortOrder || 0,
    });
    revalidatePath("/admin/urovne");
    revalidatePath("/jazykove-urovne");
    return { success: true };
  } catch (error) {
    console.error("Error creating level:", error);
    return { success: false, error: "Nepodařilo se vytvořit úroveň." };
  }
}

export async function updateLevel(
  id: number,
  data: {
    code: string;
    label?: string;
    title: string;
    subtitle?: string;
    description?: string;
    grammarTitle?: string;
    grammar?: string[];
    color?: string;
    sortOrder?: number;
  }
) {
  try {
    await db
      .update(levels)
      .set({
        code: data.code,
        label: data.label || null,
        title: data.title,
        subtitle: data.subtitle || null,
        description: data.description || null,
        grammarTitle: data.grammarTitle || null,
        grammar: data.grammar ? JSON.stringify(data.grammar) : null,
        color: data.color || null,
        sortOrder: data.sortOrder || 0,
      })
      .where(eq(levels.id, id));
    revalidatePath("/admin/urovne");
    revalidatePath("/jazykove-urovne");
    return { success: true };
  } catch (error) {
    console.error("Error updating level:", error);
    return { success: false, error: "Nepodařilo se upravit úroveň." };
  }
}

export async function deleteLevel(id: number) {
  try {
    await db.delete(levels).where(eq(levels.id, id));
    revalidatePath("/admin/urovne");
    revalidatePath("/jazykove-urovne");
    return { success: true };
  } catch (error) {
    console.error("Error deleting level:", error);
    return { success: false, error: "Nepodařilo se smazat úroveň." };
  }
}

// ============ TESTIMONIALS ============

export async function getTestimonials() {
  return db.select().from(testimonials).orderBy(desc(testimonials.id));
}

export async function getApprovedTestimonials(featuredOnly = false) {
  if (featuredOnly) {
    return db.select().from(testimonials)
      .where(eq(testimonials.approved, true))
      .orderBy(desc(testimonials.id));
  }
  return db.select().from(testimonials)
    .where(eq(testimonials.approved, true))
    .orderBy(desc(testimonials.id));
}

export async function createTestimonial(data: {
  text: string;
  author: string;
  role?: string;
  course?: string;
  rating?: number;
  featured?: boolean;
  approved?: boolean;
}) {
  try {
    await db.insert(testimonials).values({
      text: data.text,
      author: data.author,
      role: data.role || null,
      course: data.course || null,
      rating: data.rating || 5,
      featured: data.featured || false,
      approved: data.approved || false,
    });
    revalidatePath("/admin/reference");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return { success: false, error: "Nepodařilo se vytvořit referenci." };
  }
}

export async function updateTestimonial(
  id: number,
  data: {
    text: string;
    author: string;
    role?: string;
    course?: string;
    rating?: number;
    featured?: boolean;
    approved?: boolean;
  }
) {
  try {
    await db
      .update(testimonials)
      .set({
        text: data.text,
        author: data.author,
        role: data.role || null,
        course: data.course || null,
        rating: data.rating || 5,
        featured: data.featured || false,
        approved: data.approved || false,
      })
      .where(eq(testimonials.id, id));
    revalidatePath("/admin/reference");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return { success: false, error: "Nepodařilo se upravit referenci." };
  }
}

export async function approveTestimonial(id: number, approved: boolean) {
  try {
    await db
      .update(testimonials)
      .set({ approved })
      .where(eq(testimonials.id, id));
    revalidatePath("/admin/reference");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error approving testimonial:", error);
    return { success: false, error: "Nepodařilo se schválit referenci." };
  }
}

export async function deleteTestimonial(id: number) {
  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    revalidatePath("/admin/reference");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return { success: false, error: "Nepodařilo se smazat referenci." };
  }
}

// ============ PRICING ============

export async function getPricing() {
  return db.select().from(pricing).orderBy(asc(pricing.sortOrder));
}

export async function createPricing(data: {
  name: string;
  description?: string;
  price: string;
  period?: string;
  icon?: string;
  features?: string[];
  featured?: boolean;
  sortOrder?: number;
}) {
  try {
    await db.insert(pricing).values({
      name: data.name,
      description: data.description || null,
      price: data.price,
      period: data.period || null,
      icon: data.icon || null,
      features: data.features ? JSON.stringify(data.features) : null,
      featured: data.featured || false,
      sortOrder: data.sortOrder || 0,
    });
    revalidatePath("/admin/cenik");
    revalidatePath("/kurzy");
    return { success: true };
  } catch (error) {
    console.error("Error creating pricing:", error);
    return { success: false, error: "Nepodařilo se vytvořit ceník." };
  }
}

export async function updatePricing(
  id: number,
  data: {
    name: string;
    description?: string;
    price: string;
    period?: string;
    icon?: string;
    features?: string[];
    featured?: boolean;
    sortOrder?: number;
  }
) {
  try {
    await db
      .update(pricing)
      .set({
        name: data.name,
        description: data.description || null,
        price: data.price,
        period: data.period || null,
        icon: data.icon || null,
        features: data.features ? JSON.stringify(data.features) : null,
        featured: data.featured || false,
        sortOrder: data.sortOrder || 0,
      })
      .where(eq(pricing.id, id));
    revalidatePath("/admin/cenik");
    revalidatePath("/kurzy");
    return { success: true };
  } catch (error) {
    console.error("Error updating pricing:", error);
    return { success: false, error: "Nepodařilo se upravit ceník." };
  }
}

export async function deletePricing(id: number) {
  try {
    await db.delete(pricing).where(eq(pricing.id, id));
    revalidatePath("/admin/cenik");
    revalidatePath("/kurzy");
    return { success: true };
  } catch (error) {
    console.error("Error deleting pricing:", error);
    return { success: false, error: "Nepodařilo se smazat ceník." };
  }
}

// ============ CONTACT MESSAGES ============

export async function getMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.id));
}

export async function markAsRead(id: number) {
  try {
    await db
      .update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id));
    revalidatePath("/admin/zpravy");
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false };
  }
}

export async function deleteMessage(id: number) {
  try {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    revalidatePath("/admin/zpravy");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Nepodařilo se smazat zprávu." };
  }
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
  const [coursesCount, lektoriCount, testimonialsData, messagesData, pageViewsData] =
    await Promise.all([
      db.select().from(courses),
      db.select().from(lektori),
      db.select().from(testimonials),
      db.select().from(contactMessages),
      db.select().from(pageViews).where(eq(pageViews.id, 1)),
    ]);

  const unreadMessages = messagesData.filter((m) => !m.read).length;
  const pendingTestimonials = testimonialsData.filter((t) => !t.approved).length;
  const totalPageViews = pageViewsData.length > 0 ? pageViewsData[0].count : 0;

  return {
    courses: coursesCount.length,
    lektori: lektoriCount.length,
    testimonials: testimonialsData.length,
    messages: messagesData.length,
    unreadMessages,
    pendingTestimonials,
    pageViews: totalPageViews,
  };
}

// ============ SETTINGS ============

import { settings } from "@/lib/db/schema";

export async function getSettings() {
  return db.select().from(settings);
}

export async function getSetting(key: string) {
  const result = await db.select().from(settings).where(eq(settings.key, key));
  return result[0]?.value || null;
}

export async function updateSetting(key: string, value: string) {
  try {
    // Try to update existing
    const existing = await db.select().from(settings).where(eq(settings.key, key));

    if (existing.length > 0) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }

    revalidatePath("/admin/nastaveni");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating setting:", error);
    return { success: false, error: "Nepodařilo se uložit nastavení." };
  }
}

export async function updateMultipleSettings(settingsData: Record<string, string>) {
  try {
    for (const [key, value] of Object.entries(settingsData)) {
      const existing = await db.select().from(settings).where(eq(settings.key, key));

      if (existing.length > 0) {
        await db.update(settings).set({ value }).where(eq(settings.key, key));
      } else {
        await db.insert(settings).values({ key, value });
      }
    }

    revalidatePath("/admin/nastaveni");
    revalidatePath("/reference");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Nepodařilo se uložit nastavení." };
  }
}

// ============ PUBLIC STATS (for Reference page) ============

export async function getPublicStats() {
  const [testimonialsData, settingsData] = await Promise.all([
    db.select().from(testimonials).where(eq(testimonials.approved, true)),
    db.select().from(settings),
  ]);

  // Calculate average rating from approved testimonials
  const ratings = testimonialsData.map((t) => t.rating || 5);
  const avgRating = ratings.length > 0
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : "5.0";

  // Get settings values
  const settingsMap: Record<string, string> = {};
  settingsData.forEach((s) => {
    settingsMap[s.key] = s.value || "";
  });

  return {
    studentsCount: settingsMap["stats_students"] || "500+",
    yearsExperience: settingsMap["stats_years"] || "15+",
    deleSuccess: settingsMap["stats_dele"] || "98%",
    avgRating,
    reviewsCount: testimonialsData.length,
  };
}

// ============ PAGE CONTENT (CMS) ============

import { pageContent, seoMeta } from "@/lib/db/schema";

export async function getPageContent(page: string) {
  return db.select().from(pageContent).where(eq(pageContent.page, page));
}

export async function getAllPageContent() {
  return db.select().from(pageContent);
}

export async function updatePageContent(
  page: string,
  section: string,
  key: string,
  value: string
) {
  try {
    // Check if exists
    const existing = await db
      .select()
      .from(pageContent)
      .where(eq(pageContent.page, page));

    const found = existing.find(
      (c) => c.section === section && c.key === key
    );

    if (found) {
      await db
        .update(pageContent)
        .set({ value })
        .where(eq(pageContent.id, found.id));
    } else {
      await db.insert(pageContent).values({ page, section, key, value });
    }

    revalidatePath("/admin/obsah");
    revalidatePath(`/${page === "homepage" ? "" : page}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating page content:", error);
    return { success: false, error: "Nepodařilo se uložit obsah." };
  }
}

export async function updateMultiplePageContent(
  items: Array<{ page: string; section: string; key: string; value: string }>
) {
  try {
    for (const item of items) {
      await updatePageContent(item.page, item.section, item.key, item.value);
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating page content:", error);
    return { success: false, error: "Nepodařilo se uložit obsah." };
  }
}

// ============ SEO METADATA ============

export async function getSeoMeta(page: string) {
  const result = await db.select().from(seoMeta).where(eq(seoMeta.page, page));
  return result[0] || null;
}

export async function getAllSeoMeta() {
  return db.select().from(seoMeta);
}

export async function updateSeoMeta(
  page: string,
  data: {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  }
) {
  try {
    const existing = await db.select().from(seoMeta).where(eq(seoMeta.page, page));

    if (existing.length > 0) {
      await db
        .update(seoMeta)
        .set({
          title: data.title || null,
          description: data.description || null,
          keywords: data.keywords || null,
          ogTitle: data.ogTitle || null,
          ogDescription: data.ogDescription || null,
          ogImage: data.ogImage || null,
        })
        .where(eq(seoMeta.page, page));
    } else {
      await db.insert(seoMeta).values({
        page,
        title: data.title || null,
        description: data.description || null,
        keywords: data.keywords || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImage: data.ogImage || null,
      });
    }

    revalidatePath("/admin/seo");
    revalidatePath(`/${page === "homepage" ? "" : page}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating SEO meta:", error);
    return { success: false, error: "Nepodařilo se uložit SEO data." };
  }
}
