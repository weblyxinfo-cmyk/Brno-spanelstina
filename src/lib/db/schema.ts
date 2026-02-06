import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

// Kurzy
export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  icon: text("icon"),
  badge: text("badge"),
  category: text("category").notNull(), // skupinove, individualni, intenzivni, specializovane
  featured: integer("featured", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Lektoři
export const lektori = sqliteTable("lektori", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  role: text("role"),
  origin: text("origin"),
  originFlag: text("origin_flag"),
  badge: text("badge"),
  badgeIcon: text("badge_icon"),
  avatar: text("avatar"),
  bio: text("bio"), // JSON array of paragraphs
  highlights: text("highlights"), // JSON array
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Jazykové úrovně
export const levels = sqliteTable("levels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull(), // A1, A2, B1, etc.
  label: text("label"),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  grammarTitle: text("grammar_title"),
  grammar: text("grammar"), // JSON array
  color: text("color"),
  sortOrder: integer("sort_order").default(0),
});

// Reference / Testimonials
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  author: text("author").notNull(),
  role: text("role"),
  course: text("course"),
  rating: integer("rating").default(5),
  featured: integer("featured", { mode: "boolean" }).default(false),
  approved: integer("approved", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Ceník
export const pricing = sqliteTable("pricing", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  icon: text("icon"),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  period: text("period"),
  features: text("features"), // JSON array
  featured: integer("featured", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").default(0),
});

// Kontaktní zprávy
export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  courseType: text("course_type"),
  message: text("message").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  read: integer("read", { mode: "boolean" }).default(false),
});

// Nastavení webu
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Obsah stránek (CMS texty)
export const pageContent = sqliteTable("page_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  page: text("page").notNull(), // homepage, o-nas, kurzy, kontakt, etc.
  section: text("section").notNull(), // hero, about, cta, etc.
  key: text("key").notNull(), // title, subtitle, description, etc.
  value: text("value"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// SEO metadata pro stránky
export const seoMeta = sqliteTable("seo_meta", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  page: text("page").notNull().unique(), // homepage, o-nas, kurzy, etc.
  title: text("title"),
  description: text("description"),
  keywords: text("keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Počítadlo návštěvnosti
export const pageViews = sqliteTable("page_views", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  count: integer("count").notNull().default(0),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============ BOOKING SYSTEM ============

// Typy lekcí
export const lessons = sqliteTable("lessons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull().default(60),
  priceCzk: integer("price_czk").notNull(),
  maxStudents: integer("max_students").default(1),
  category: text("category").notNull(), // 'individual', 'group', 'intensive'
  active: integer("active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
});

// Časové sloty
export const timeSlots = sqliteTable("time_slots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: integer("lesson_id").references(() => lessons.id),
  startTime: text("start_time").notNull(), // ISO datetime
  endTime: text("end_time").notNull(),
  available: integer("available", { mode: "boolean" }).default(true),
});

// Rezervace
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  timeSlotId: integer("time_slot_id").references(() => timeSlots.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  studentPhone: text("student_phone"),
  status: text("status").notNull().default("pending"), // pending, paid, cancelled
  stripeSessionId: text("stripe_session_id"),
  pricePaid: integer("price_paid"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// ============ SEMESTER COURSES ============

// Semestrální kurzy s kapacitou
export const semesterCourses = sqliteTable("semester_courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  semester: text("semester").notNull(), // "jaro-2026", "podzim-2026"
  semesterName: text("semester_name").notNull(), // "Jarní semestr 2026"
  semesterStart: text("semester_start").notNull(), // "2026-02-16"
  semesterEnd: text("semester_end").notNull(), // "2026-06-26"
  level: text("level").notNull(), // "začátečníci A1", "mírně pokročilí B1", etc.
  dayOfWeek: text("day_of_week").notNull(), // "pondělí", "úterý", etc.
  timeStart: text("time_start").notNull(), // "09:00"
  timeEnd: text("time_end").notNull(), // "10:30"
  description: text("description"), // "1x90min, max 4 studenti"
  lessonsCount: integer("lessons_count").notNull().default(19),
  priceCzk: integer("price_czk").notNull(),
  maxStudents: integer("max_students").notNull().default(4),
  currentStudents: integer("current_students").notNull().default(0),
  type: text("type").notNull().default("afternoon"), // "morning", "afternoon"
  isHighlighted: integer("is_highlighted", { mode: "boolean" }).default(false),
  badge: text("badge"), // "novinka", "oblíbené", etc.
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Přihlášky do semestrálních kurzů
export const semesterEnrollments = sqliteTable("semester_enrollments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  semesterCourseId: integer("semester_course_id").references(() => semesterCourses.id),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  studentPhone: text("student_phone").notNull(),
  message: text("message"),
  status: text("status").notNull().default("pending"), // "pending", "confirmed", "cancelled", "waitlist"
  quizLevel: text("quiz_level"), // pokud přišel z kvízu
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
