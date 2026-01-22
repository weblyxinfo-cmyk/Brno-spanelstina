"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface Level {
  id: number;
  code: string;
  label: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  grammarTitle: string | null;
  grammar: string[];
  color: string | null;
}

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface JazykoveUrovneClientProps {
  levels: Level[];
  content: ContentMap;
}

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

const colorMap: Record<string, string> = {
  "#4CAF50": "from-[#4CAF50] to-[#388E3C]",
  "#8BC34A": "from-[#8BC34A] to-[#689F38]",
  "#CDDC39": "from-[#CDDC39] to-[#AFB42B]",
  "#FFC107": "from-[#FFC107] to-[#FFA000]",
  "#FF9800": "from-[#FF9800] to-[#F57C00]",
  "#F44336": "from-[#F44336] to-[#D32F2F]",
};

export default function JazykoveUrovneClient({ levels, content }: JazykoveUrovneClientProps) {
  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Jak poznám svoji jazykovou úroveň?");
  const heroSubtitle = c(content, "hero", "subtitle", "jazykovou úroveň?");
  const heroDescription = c(content, "hero", "description", "Používáme mezinárodní klasifikaci CEFR (Společný evropský referenční rámec). Zde najdete přehled úrovní a co na každé z nich zvládnete.");

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
              <span>📊</span> CEFR
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

      {/* Intro */}
      <section className="px-6 pb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg text-[#6B5D54] text-center max-w-3xl mx-auto leading-relaxed"
        >
          Nevíte, do které skupiny patříte? Níže najdete popis jednotlivých
          úrovní včetně gramatiky, kterou byste měli ovládat. Pokud si stále
          nejste jistí, přijďte na{" "}
          <strong className="text-[#1F1A17]">bezplatnou konzultaci</strong> –
          rádi vám pomůžeme.
        </motion.p>
      </section>

      {/* Levels */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {levels.map((level, index) => {
            const gradientClass = colorMap[level.color || "#4CAF50"] || "from-[#C41E3A] to-[#9E1830]";
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[48px] p-8 md:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start border-2 border-transparent hover:border-[#C41E3A] hover:translate-x-2 hover:shadow-xl transition-all duration-300"
              >
                {/* Badge */}
                <div
                  className={`w-28 h-32 md:w-32 md:h-36 bg-gradient-to-br ${gradientClass} rounded-[24px] flex flex-col items-center justify-center text-white flex-shrink-0 p-3`}
                >
                  <span className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-bold leading-none">
                    {level.code}
                  </span>
                  <span className="text-[10px] md:text-xs uppercase tracking-wider opacity-90 mt-2 text-center leading-tight">
                    {level.label}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1F1A17] mb-1">
                    {level.title}
                  </h2>
                  <p className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A] mb-4">
                    {level.subtitle}
                  </p>
                  <p className="text-[#6B5D54] leading-relaxed mb-6">
                    {level.description}
                  </p>

                  {/* Grammar tags */}
                  <div className="bg-[#FBF9F6] rounded-[24px] p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6B5D54] mb-3">
                      {level.grammarTitle}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {level.grammar.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white px-4 py-2 rounded-full text-sm font-medium text-[#1F1A17] border border-[#EBE6DF]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Test Section */}
      <section className="py-20 px-6 bg-[#1F1A17]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Nejste si{" "}
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#FFE5E5]">
              jistí?
            </span>
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Přijďte na bezplatnou konzultaci. Probereme vaše dosavadní
            zkušenosti a zařadíme vás do správné skupiny.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1F1A17] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            Domluvit konzultaci
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
            Připraveni{" "}
            <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
              začít?
            </span>
          </h2>
          <p className="text-lg text-[#6B5D54] mb-8 max-w-xl mx-auto">
            První hodina je zdarma. Vyzkoušejte si, jak u nás výuka probíhá, a
            pak se rozhodněte.
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center gap-2 bg-[#C41E3A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#C41E3A]/30 hover:bg-[#9E1830] hover:-translate-y-1 transition-all duration-200"
          >
            Zkušební hodina zdarma
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
