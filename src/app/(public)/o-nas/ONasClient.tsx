"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Globe2, Heart, BookOpen } from "lucide-react";

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface ONasClientProps {
  content: ContentMap;
}

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

const timeline = [
  {
    year: "2010",
    title: "Začátek příběhu",
    description:
      "Rodrigo Valenzuela zakládá v Brně první kurzy španělštiny. Začíná s malou skupinkou nadšenců v pronajatých prostorách.",
  },
  {
    year: "2012",
    title: "Olga se připojuje",
    description:
      "Po návratu z Andalusie se k týmu přidává Olga Trampotová. Vzniká unikátní koncept dvou lektorů v každém kurzu.",
  },
  {
    year: "2015",
    title: "Vlastní prostory",
    description:
      "Stěhujeme se do vlastních prostor na Zábrdovické 2. Konečně máme místo, kde se studenti cítí jako doma.",
  },
  {
    year: "2020",
    title: "Online výuka",
    description:
      "Úspěšně zvládáme přechod na online výuku. Zjišťujeme, že osobní přístup funguje i přes obrazovku.",
  },
  {
    year: "2025",
    title: "15 let s vámi",
    description:
      "Slavíme 15 let výuky španělštiny v Brně. Stovky spokojených studentů a stále stejná vášeň pro jazyk.",
  },
];

const values = [
  {
    icon: Users,
    title: "Malé skupiny",
    subtitle: "Max 4 studenti",
    description:
      "V malé skupině má každý prostor mluvit, ptát se a dělat chyby. Nikdo se neztratí v davu a každý dostane individuální pozornost.",
  },
  {
    icon: Globe2,
    title: "Dva lektoři",
    subtitle: "Dva světy španělštiny",
    description:
      "V každém kurzu se střídají dva lektoři – jeden z Evropy, jeden z Latinské Ameriky. Poznáte oba přízvuky a kulturní rozdíly.",
  },
  {
    icon: Heart,
    title: "Osobní přístup",
    subtitle: "Nejsme továrna na kurzy",
    description:
      "Známe každého studenta jménem. Víme, proč se učí španělsky, a přizpůsobujeme výuku jejich cílům.",
  },
  {
    icon: BookOpen,
    title: "Praxe před teorií",
    subtitle: "Mluvit od první hodiny",
    description:
      "Věříme, že jazyk se naučíte mluvením, ne biflováním gramatiky. Od první hodiny budete komunikovat.",
  },
];

const stats = [
  { number: "15+", label: "let zkušeností" },
  { number: "500+", label: "spokojených studentů" },
  { number: "4", label: "max. studenti ve skupině" },
  { number: "2", label: "lektoři v každém kurzu" },
];

export default function ONasClient({ content }: ONasClientProps) {
  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Učíme španělsky s láskou");
  const heroSubtitle = c(content, "hero", "subtitle", "s láskou");
  const heroDescription = c(content, "hero", "description", "Od roku 2010 pomáháme Brňákům objevovat krásu španělštiny. Nejsme velká jazykovka – jsme parta nadšenců, kteří milují svou práci.");
  const missionTitle = c(content, "mission", "title", "Náš příběh");
  const missionDescription = c(content, "mission", "description", "Od malých začátků k největší rodinné jazykovce v Brně");
  const valuesTitle = c(content, "values", "title", "Proč učíme jinak?");
  const valuesDescription = c(content, "values", "description", "Věříme, že jazyky se nejlépe učí v přátelské atmosféře, kde se nikdo nebojí udělat chybu.");

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
              <span>🏫</span> Naše škola
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
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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

      {/* Story Timeline */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              {missionTitle.includes(" ") ? (
                <>
                  {missionTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
                    {missionTitle.split(" ").slice(-1)}
                  </span>
                </>
              ) : missionTitle}
            </h2>
            <p className="text-lg text-[#6B5D54]">
              {missionDescription}
            </p>
          </div>

          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-6 md:p-8 grid grid-cols-[auto_1fr] gap-6 items-start hover:shadow-lg transition-shadow"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-[16px] flex items-center justify-center text-white font-bold text-xl">
                  {item.year}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1F1A17] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[#6B5D54] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values / Philosophy */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              {valuesTitle.includes(" ") ? (
                <>
                  {valuesTitle.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
                    {valuesTitle.split(" ").slice(-1)}
                  </span>
                </>
              ) : valuesTitle}
            </h2>
            <p className="text-lg text-[#6B5D54] max-w-2xl mx-auto">
              {valuesDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FBF9F6] rounded-[32px] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#C41E3A]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1A17] mb-1">
                  {value.title}
                </h3>
                <p className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A] mb-4">
                  {value.subtitle}
                </p>
                <p className="text-[#6B5D54] leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#1F1A17] rounded-[48px] p-12 md:p-16 text-center"
        >
          <p className="font-[family-name:var(--font-playfair)] italic text-2xl sm:text-3xl text-white leading-relaxed mb-6">
            „Neučíme jen jazyk – učíme vás cítit rytmus španělštiny, rozumět
            kultuře a nebát se mluvit."
          </p>
          <p className="text-[#FFE5E5] font-semibold">
            — Rodrigo Valenzuela, zakladatel
          </p>
        </motion.div>
      </section>

      {/* Location hint */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-[48px] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h3 className="text-2xl font-bold text-[#1F1A17] mb-4">
                Kde nás najdete?
              </h3>
              <p className="text-[#6B5D54] leading-relaxed mb-4">
                Sídlíme v příjemných prostorách na Zábrdovické 2 v Brně. Snadno
                se k nám dostanete tramvají 2 nebo 3.
              </p>
              <p className="text-[#6B5D54] leading-relaxed">
                Přijďte se podívat – rádi vám ukážeme, kde kouzlo probíhá, a
                dáme vám kávu.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#FFE5E5] to-[#EBE6DF] rounded-[32px] h-64 flex items-center justify-center">
              <span className="text-6xl">📍</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 pb-20">
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
                Chcete nás{" "}
                <span className="font-[family-name:var(--font-playfair)] italic font-medium">
                  poznat?
                </span>
              </h2>
              <p className="text-white/85 text-lg max-w-xl mx-auto mb-8">
                Přijďte na zkušební hodinu zdarma. Uvidíte, jak učíme, poznáte
                naše lektory a zjistíte, jestli vám to u nás sedí.
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
