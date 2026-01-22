"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Lektor {
  id: number;
  name: string;
  role: string | null;
  origin: string | null;
  originFlag: string | null;
  badge: string | null;
  badgeIcon: string | null;
  avatar: string | null;
  bio: string[];
  highlights: Array<{ icon: string; text: string }>;
}

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface LektoriClientProps {
  lektori: Lektor[];
  content: ContentMap;
}

const teamStats = [
  {
    icon: "🌎",
    number: "2",
    label: "přízvuky v každém kurzu",
  },
  {
    icon: "🇪🇸",
    number: "1",
    label: "evropská španělština",
  },
  {
    icon: "🌴",
    number: "1",
    label: "latinskoamerická španělština",
  },
];

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

export default function LektoriClient({ lektori, content }: LektoriClientProps) {
  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Poznejte naše lektory");
  const heroSubtitle = c(content, "hero", "subtitle", "lektory");
  const heroDescription = c(content, "hero", "description", "Lektoři, kteří umí španělsky nejenom mluvit, ale umí španělsky i žít. S námi se nemusíte bát suchopárné akademické nudy.");

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
              <span>👨‍🏫</span> Náš tým
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

      {/* Lektoři */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {lektori.map((lektor, index) => (
            <motion.div
              key={lektor.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24 ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Image/Avatar */}
              <div
                className={`relative ${index % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="relative aspect-[3/4] bg-gradient-to-br from-[#FFE5E5] to-[#EBE6DF] rounded-[48px] flex items-center justify-center shadow-2xl overflow-hidden">
                  {lektor.avatar?.startsWith('/') ? (
                    <Image
                      src={lektor.avatar}
                      alt={lektor.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <span className="text-[150px]">{lektor.avatar || "👨‍🏫"}</span>
                  )}
                </div>
                <div
                  className={`absolute -bottom-4 ${
                    index % 2 === 1 ? "left-4 lg:-left-4" : "right-4 lg:-right-4"
                  } bg-[#C41E3A] text-white px-6 py-4 rounded-[24px] shadow-lg`}
                >
                  <span className="text-2xl block mb-1">{lektor.badgeIcon}</span>
                  <span className="font-bold text-sm">{lektor.badge}</span>
                </div>
              </div>

              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <span className="inline-flex items-center gap-2 bg-[#FFE5E5] text-[#9E1830] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  {lektor.originFlag} {lektor.origin}
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1F1A17] mb-2">
                  {lektor.name}
                </h2>

                <p className="font-[family-name:var(--font-playfair)] italic text-xl text-[#C41E3A] mb-6">
                  {lektor.role}
                </p>

                {lektor.bio.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-[#6B5D54] text-lg leading-relaxed mb-4"
                  >
                    {paragraph}
                  </p>
                ))}

                <div className="flex flex-wrap gap-3 mt-6">
                  {lektor.highlights.map((highlight, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium border border-[#EBE6DF]"
                    >
                      <span>{highlight.icon}</span>
                      {highlight.text}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="mx-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#1F1A17] rounded-[48px] py-20 px-8"
        >
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl lg:text-4xl text-white leading-relaxed mb-8">
              „Naučíme vás jazyk, který zní jako hudba a chutná jako tapas."
            </p>
            <p className="text-[#FFE5E5] font-semibold">
              — Filozofie naší školy
            </p>
          </div>
        </motion.div>
      </section>

      {/* Team Summary */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Proč učíme{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
                ve dvou?
              </span>
            </h2>
            <p className="text-lg text-[#6B5D54] max-w-xl mx-auto">
              Každý kurz vedou vždy dva lektoři. Proč? Abyste slyšeli španělštinu
              z obou břehů Atlantiku.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#C41E3A]"
              >
                <span className="text-5xl block mb-4">{stat.icon}</span>
                <p className="font-[family-name:var(--font-playfair)] text-5xl font-bold text-[#C41E3A] mb-2">
                  {stat.number}
                </p>
                <p className="text-[#6B5D54]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-[48px] p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Chcete nás{" "}
                  <span className="font-[family-name:var(--font-playfair)] italic font-medium">
                    poznat osobně?
                  </span>
                </h2>
                <p className="text-white/85 text-lg">
                  Přijďte na zkušební hodinu zdarma. Poznáte naše lektory,
                  uvidíte jak učíme a zjistíte, jestli vám to u nás sedí.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#C41E3A] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
                >
                  Zkušební hodina zdarma
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/kurzy"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/40 hover:bg-white/10 hover:border-white transition-all duration-200"
                >
                  Zpět na kurzy
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
