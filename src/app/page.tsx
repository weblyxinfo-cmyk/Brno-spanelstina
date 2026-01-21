"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Globe2,
  Award,
  Gift,
  ArrowRight,
  Star,
  Calendar,
  Clock,
  MapPin
} from "lucide-react";

const usps = [
  {
    icon: Users,
    title: "Max 4 studenti",
    description: "Nejmenší skupiny v Brně. Každý dostane prostor mluvit a ptát se.",
  },
  {
    icon: Globe2,
    title: "Dva lektoři",
    description: "Španělská i latinskoamerická španělština v každém kurzu.",
  },
  {
    icon: Award,
    title: "DELE příprava",
    description: "Připravíme vás na mezinárodně uznávané certifikáty.",
  },
  {
    icon: Gift,
    title: "1. hodina zdarma",
    description: "Vyzkoušejte si výuku bez závazku. Rozhodněte se až potom.",
  },
];

const courses = [
  {
    title: "Skupinové kurzy",
    subtitle: "Semestrální výuka",
    description: "Učte se v přátelské partě maximálně 4 lidí na podobné úrovni.",
    icon: "👥",
    badge: "Nejoblíbenější",
    href: "/kurzy#skupinove",
  },
  {
    title: "Individuální výuka",
    subtitle: "Výuka šitá na míru",
    description: "Tempo, obsah i čas určujete vy. Pro ty, kdo ví, co potřebují.",
    icon: "👤",
    href: "/kurzy#individualni",
  },
  {
    title: "Intenzivní kurzy",
    subtitle: "Dvoutýdenní programy",
    description: "Rychlý pokrok za krátkou dobu. Ideální před cestou do Španělska.",
    icon: "⚡",
    badge: "Léto 2025",
    href: "/kurzy#intenzivni",
  },
  {
    title: "Příprava na DELE",
    subtitle: "Mezinárodní certifikát",
    description: "Připravíme vás na zkoušku Intermedio i Superior.",
    icon: "🎓",
    href: "/kurzy#dele",
  },
];

const testimonials = [
  {
    text: "Skvělá atmosféra a perfektní lektoři. Po roce už se dokážu bez problémů domluvit ve Španělsku!",
    author: "Petra K.",
    role: "Studentka B1",
  },
  {
    text: "Malé skupiny jsou velká výhoda. Konečně mám prostor mluvit a nebojím se dělat chyby.",
    author: "Martin V.",
    role: "Student A2",
  },
  {
    text: "Rodrigo a Olga jsou skvělý tým. Výuka je zábavná a člověk se těší na každou hodinu.",
    author: "Jana M.",
    role: "Studentka B2",
  },
];

export default function HomePage() {
  return (
    <div className="bg-[#FBF9F6]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-6">
        {/* Background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-[#FADDD6] to-transparent opacity-40 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 bg-white text-[#D35233] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-8">
              <span>🇪🇸</span> Kurzy španělštiny v Brně
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1F1A17] leading-tight mb-6"
          >
            Naučte se španělsky
            <br />
            <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#D35233]">
              s radostí
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#6B5D54] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Malé skupiny, osobní přístup a dva lektoři v každém kurzu.
            Učíme španělsky tak, aby vás to bavilo a výsledky se dostavily.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center gap-2 bg-[#D35233] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#D35233]/30 hover:bg-[#B5412A] hover:-translate-y-1 transition-all duration-200"
            >
              Zkušební hodina zdarma
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/kurzy"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1F1A17] px-8 py-4 rounded-full font-semibold text-lg border-2 border-[#EBE6DF] hover:border-[#D35233] hover:text-[#D35233] transition-all duration-200"
            >
              Prohlédnout kurzy
            </Link>
          </motion.div>

          {/* Quick info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-[#6B5D54]"
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Zimní semestr od 15.9.2025
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              2× týdně 90 minut
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Zábrdovická 2, Brno
            </span>
          </motion.div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Proč se učit{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#D35233]">
                u nás?
              </span>
            </h2>
            <p className="text-lg text-[#6B5D54] max-w-xl mx-auto">
              Kombinujeme osobní přístup s profesionální výukou
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usps.map((usp, index) => (
              <motion.div
                key={usp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-[#D35233]"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#D35233] to-[#B5412A] rounded-2xl flex items-center justify-center mb-6">
                  <usp.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1A17] mb-2">
                  {usp.title}
                </h3>
                <p className="text-[#6B5D54] leading-relaxed">
                  {usp.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Vyberte si{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#D35233]">
                svůj kurz
              </span>
            </h2>
            <p className="text-lg text-[#6B5D54] max-w-xl mx-auto">
              Od prvních slov po plynulou konverzaci
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={course.href}
                  className="group block bg-[#FBF9F6] rounded-[32px] p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#D35233] relative overflow-hidden"
                >
                  {course.badge && (
                    <span className="absolute top-6 right-6 bg-[#D35233] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                      {course.badge}
                    </span>
                  )}
                  <span className="text-5xl mb-6 block">{course.icon}</span>
                  <h3 className="text-2xl font-bold text-[#1F1A17] mb-1 group-hover:text-[#D35233] transition-colors">
                    {course.title}
                  </h3>
                  <p className="font-[family-name:var(--font-playfair)] italic text-[#D35233] mb-4">
                    {course.subtitle}
                  </p>
                  <p className="text-[#6B5D54] leading-relaxed mb-6">
                    {course.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#D35233] font-semibold group-hover:gap-3 transition-all">
                    Více informací
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/kurzy"
              className="inline-flex items-center justify-center gap-2 bg-[#1F1A17] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#D35233] transition-colors duration-200"
            >
              Zobrazit všechny kurzy
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Co říkají{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#D35233]">
                naši studenti
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[32px] p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-[#D35233] text-[#D35233]"
                    />
                  ))}
                </div>
                <p className="text-[#1F1A17] leading-relaxed mb-6 text-lg">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div>
                  <p className="font-bold text-[#1F1A17]">{testimonial.author}</p>
                  <p className="text-sm text-[#6B5D54]">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/reference"
              className="inline-flex items-center gap-2 text-[#D35233] font-semibold hover:gap-3 transition-all"
            >
              Přečíst další reference
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#D35233] to-[#B5412A] rounded-[48px] p-12 md:p-16 text-center relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Připraveni{" "}
                <span className="font-[family-name:var(--font-playfair)] italic font-medium">
                  začít?
                </span>
              </h2>
              <p className="text-white/90 text-lg max-w-xl mx-auto mb-8">
                První hodina je zdarma. Vyzkoušejte si, jak u nás výuka probíhá,
                a pak se rozhodněte.
              </p>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#D35233] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
              >
                Zkušební hodina zdarma
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
