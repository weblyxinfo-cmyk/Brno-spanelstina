"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { name: "Kurzy", href: "/kurzy" },
  { name: "O nás", href: "/o-nas" },
  { name: "Lektoři", href: "/lektori" },
  { name: "Jazykové úrovně", href: "/jazykove-urovne" },
  { name: "Reference", href: "/reference" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="mx-auto max-w-7xl rounded-[32px] bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#1F1A17]">
              Španělština <span className="text-[#C41E3A]">Brno</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-[#6B5D54] hover:text-[#C41E3A] transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/kontakt"
              className="rounded-full bg-[#C41E3A] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C41E3A]/30 hover:bg-[#9E1830] hover:-translate-y-0.5 transition-all duration-200"
            >
              Zkusit zdarma
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden rounded-full p-2 text-[#6B5D54] hover:bg-[#EBE6DF] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Otevřít menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-2 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-base font-medium text-[#6B5D54] hover:bg-[#EBE6DF] hover:text-[#C41E3A] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/kontakt"
                  className="block rounded-full bg-[#C41E3A] px-4 py-3 text-center text-base font-semibold text-white hover:bg-[#9E1830] transition-colors mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Zkusit zdarma
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
