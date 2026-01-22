"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw, Home, Mail } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center px-6 py-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Error badge */}
        <div className="inline-flex items-center gap-2 bg-white text-[#C41E3A] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-8">
          <AlertTriangle className="h-4 w-4" />
          Ups! Nastala chyba
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-[#1F1A17] mb-4">
          Algo salio{" "}
          <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
            mal
          </span>
        </h1>

        <h2 className="text-xl sm:text-2xl text-[#6B5D54] mb-2">
          Omlouváme se, něco se pokazilo
        </h2>

        <p className="text-[#6B5D54] max-w-md mx-auto mb-8 leading-relaxed">
          Naše stránka momentálně zažívá technické potíže. Zkuste to prosím
          znovu nebo se vraťte na hlavní stránku.
        </p>

        {/* Error icon */}
        <div className="mb-10">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-[32px] flex items-center justify-center shadow-lg shadow-[#C41E3A]/30">
            <AlertTriangle className="h-14 w-14 text-white" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 bg-[#C41E3A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#C41E3A]/30 hover:bg-[#9E1830] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <RefreshCcw className="h-5 w-5" />
            Zkusit znovu
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1F1A17] px-8 py-4 rounded-full font-semibold text-lg border-2 border-[#EBE6DF] hover:border-[#C41E3A] hover:text-[#C41E3A] transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            Hlavní stránka
          </Link>
        </div>

        {/* Contact support */}
        <div className="bg-white rounded-[24px] p-6 border border-[#EBE6DF]">
          <p className="text-[#6B5D54] mb-3">
            Pokud problém přetrvává, kontaktujte nás:
          </p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 text-[#C41E3A] font-semibold hover:text-[#9E1830] transition-colors"
          >
            <Mail className="h-4 w-4" />
            Napište nám
          </Link>
        </div>

        {/* Error digest for debugging (only in development) */}
        {error.digest && (
          <p className="mt-6 text-xs text-[#6B5D54]/60">
            Kód chyby: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
