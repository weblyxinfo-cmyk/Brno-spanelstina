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
