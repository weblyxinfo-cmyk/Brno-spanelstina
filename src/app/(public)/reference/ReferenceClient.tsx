"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import TestimonialForm from "@/components/TestimonialForm";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string | null;
  course: string | null;
  rating: number | null;
}

interface Stats {
  studentsCount: string;
  yearsExperience: string;
  deleSuccess: string;
  avgRating: string;
  reviewsCount: number;
}

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface ReferenceClientProps {
  testimonials: Testimonial[];
  stats: Stats;
  content: ContentMap;
}

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

export default function ReferenceClient({ testimonials, stats, content }: ReferenceClientProps) {
  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Co říkají naši studenti");
  const heroSubtitle = c(content, "hero", "subtitle", "studenti");
  const heroDescription = c(content, "hero", "description", "Nejlepší reklamou jsou spokojení studenti. Přečtěte si, co o nás říkají ti, kteří s námi prošli cestou ke španělštině.");
  const ctaTitle = c(content, "cta", "title", "Připojte se k spokojeným studentům");
  const ctaDescription = c(content, "cta", "description", "První hodina je zdarma. Vyzkoušejte si, jak u nás výuka probíhá, a pak se rozhodněte.");

  const statsDisplay: { number: string; label: string }[] = [
    { number: stats.studentsCount, label: "spokojených studentů" },
    { number: stats.yearsExperience, label: "let zkušeností" },
    { number: stats.deleSuccess, label: "úspěšnost u DELE" },
    { number: stats.avgRating, label: `průměrné hodnocení (${stats.reviewsCount} recenzí)` },
  ];

  return (
    <div className="bg-[#FBF9F6]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#C41E3A] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-6 uppercase tracking-wider">
              <span>⭐</span> Reference
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1F1A17] leading-tight mb-6"
          >
            {heroTitle.replace(heroSubtitle, "").trim()}{" "}
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#C41E3A]">
              {heroSubtitle}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#6B5D54] leading-relaxed"
          >
            {heroDescription}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statsDisplay.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-[32px] p-6 text-center"
              >
                <p className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold text-[#C41E3A] mb-1">
                  {stat.number}
                </p>
                <p className="text-[#6B5D54] text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#C41E3A] text-[#C41E3A]"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[#1F1A17] leading-relaxed mb-6">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="border-t border-[#EBE6DF] pt-4">
                  <p className="font-bold text-[#1F1A17]">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-[#6B5D54]">{testimonial.role}</p>
                  {testimonial.course && (
                    <span className="inline-block mt-2 text-xs bg-[#FFE5E5] text-[#9E1830] px-3 py-1 rounded-full font-medium">
                      {testimonial.course}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {testimonials.length === 0 && (
            <div className="text-center py-12 text-[#6B5D54]">
              Zatím nemáme žádné schválené recenze.
            </div>
          )}
        </div>
      </section>

      {/* Submit Review Section - Pridejte svou referenci */}
      <TestimonialForm />

      {/* Trust Section */}
      <section className="py-20 px-6 bg-[#FBF9F6]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-6">
              Proč nám studenti{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
                věří?
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <span className="text-5xl mb-4 block">🎯</span>
                <h3 className="font-bold text-[#1F1A17] mb-2">
                  Individuální přístup
                </h3>
                <p className="text-[#6B5D54] text-sm">
                  Známe každého studenta jménem a přizpůsobujeme výuku jeho
                  potřebám.
                </p>
              </div>
              <div className="text-center">
                <span className="text-5xl mb-4 block">📈</span>
                <h3 className="font-bold text-[#1F1A17] mb-2">
                  Viditelné výsledky
                </h3>
                <p className="text-[#6B5D54] text-sm">
                  {stats.deleSuccess} našich studentů úspěšně složí zkoušku DELE na první pokus.
                </p>
              </div>
              <div className="text-center">
                <span className="text-5xl mb-4 block">❤️</span>
                <h3 className="font-bold text-[#1F1A17] mb-2">Vášeň pro jazyk</h3>
                <p className="text-[#6B5D54] text-sm">
                  Učíme s láskou a nadšením, které se přenáší na naše studenty.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-[48px] p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {ctaTitle.includes(" ") ? (
                  <>
                    {ctaTitle.split(" ").slice(0, -1).join(" ")}{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-medium">
                      {ctaTitle.split(" ").slice(-1)}
                    </span>
                  </>
                ) : ctaTitle}
              </h2>
              <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
                {ctaDescription}
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#C41E3A] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Zkušební hodina zdarma
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
