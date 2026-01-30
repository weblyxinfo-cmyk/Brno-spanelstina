"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";

interface BookingCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function BookingCTA({
  title = "Zarezervujte si lekci",
  subtitle = "Vyberte si termín, který vám vyhovuje, a zaplaťte online. Potvrzení obdržíte ihned na email.",
  buttonText = "Rezervovat termín",
}: BookingCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-[#FFE5E5] to-[#FFDDD3] rounded-[48px] p-10 md:p-14 text-center relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 text-[200px] opacity-10 pointer-events-none">
        📅
      </div>

      <div className="w-16 h-16 bg-[#E07B53] rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Calendar className="w-8 h-8 text-white" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
        {title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="font-[family-name:var(--font-playfair)] italic font-medium text-[#E07B53]">
          {title.split(" ").slice(-1)[0]}
        </span>
      </h2>

      <p className="text-lg text-[#6B5D54] mb-8 max-w-xl mx-auto">{subtitle}</p>

      <Link
        href="/rezervace"
        className="inline-flex items-center justify-center gap-2 bg-[#E07B53] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#E07B53]/30 hover:bg-[#C4613D] hover:-translate-y-1 transition-all duration-200"
      >
        {buttonText}
        <ArrowRight className="h-5 w-5" />
      </Link>
    </motion.div>
  );
}
