"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  const handleMoreInfo = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
    window.location.href = "/gdpr";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div
            className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8"
          >
            <div
              className="rounded-t-2xl bg-white px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
              style={{ color: "#1F1A17" }}
            >
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-center text-sm sm:text-left sm:text-base">
                  Tento web používá cookies pro zlepšení vašeho zážitku.
                </p>
                <div className="flex flex-shrink-0 gap-3">
                  <button
                    onClick={handleMoreInfo}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100"
                    style={{ color: "#1F1A17" }}
                  >
                    Více informací
                  </button>
                  <button
                    onClick={handleAccept}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#C41E3A" }}
                  >
                    Přijmout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
