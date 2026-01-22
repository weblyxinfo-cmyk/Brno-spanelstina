"use client";

import { motion } from "framer-motion";
import { MapPin, Mail, Clock, Send, CreditCard, Car, Facebook } from "lucide-react";
import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";

interface ContentMap {
  [section: string]: { [key: string]: string };
}

interface KontaktClientProps {
  content: ContentMap;
}

// Helper to get content with fallback
function c(content: ContentMap, section: string, key: string, fallback: string): string {
  return content[section]?.[key] || fallback;
}

const courseTypes = [
  "Skupinový kurz",
  "Individuální výuka",
  "Intenzivní kurz",
  "Příprava na DELE",
  "Obchodní španělština",
  "Nevím, potřebuji poradit",
];

export default function KontaktClient({ content }: KontaktClientProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    courseType: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get dynamic content with fallbacks
  const heroTitle = c(content, "hero", "title", "Ozvěte se nám");
  const heroSubtitle = c(content, "hero", "subtitle", "nám");
  const heroDescription = c(content, "hero", "description", "Máte otázky? Chcete se přihlásit na kurz nebo zkušební hodinu zdarma? Napište nám nebo zavolejte – rádi vám poradíme.");
  const address = c(content, "info", "address", "Zábrdovická 2, 615 00 Brno");

  const contactInfo = [
    {
      icon: MapPin,
      title: "Učebna",
      content: address,
      subtitle: "10 min. od centra, naproti zastávce Vojenská nemocnice",
    },
    {
      icon: Mail,
      title: "Email",
      content: "sp-info@seznam.cz",
      subtitle: "Odpovídáme do 24 hodin",
    },
    {
      icon: Car,
      title: "Doprava",
      content: "Tram. č. 2, 3 – Vojenská nemocnice",
      subtitle: "Možnost parkování v areálu",
    },
    {
      icon: CreditCard,
      title: "Bankovní spojení",
      content: "670100-2207917982/6210",
      subtitle: "mBank",
    },
    {
      icon: Facebook,
      title: "Facebook",
      content: "Španělština Brno",
      subtitle: "Sledujte nás pro novinky a akce",
      link: "https://www.facebook.com/profile.php?id=100057147803313",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await submitContactForm(formData);

    setIsSubmitting(false);
    if (result.success) {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", courseType: "", message: "" });
    } else {
      alert(result.error || "Nepodařilo se odeslat zprávu.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
              <span>📬</span> Kontakt
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

      {/* Contact Section */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-[48px] p-8 md:p-12"
            >
              <h2 className="text-2xl font-bold text-[#1F1A17] mb-2">
                Napište nám
              </h2>
              <p className="text-[#6B5D54] mb-8">
                Vyplňte formulář a ozveme se vám do 24 hodin.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <span className="text-6xl mb-4 block">✅</span>
                  <h3 className="text-xl font-bold text-[#1F1A17] mb-2">
                    Zpráva odeslána!
                  </h3>
                  <p className="text-[#6B5D54]">
                    Děkujeme za váš zájem. Ozveme se vám co nejdříve.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 text-[#C41E3A] font-semibold hover:underline"
                  >
                    Odeslat další zprávu
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-[#1F1A17] mb-2"
                    >
                      Jméno a příjmení *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-[#FBF9F6]"
                      placeholder="Jan Novák"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-[#1F1A17] mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-[#FBF9F6]"
                        placeholder="jan@email.cz"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-[#1F1A17] mb-2"
                      >
                        Telefon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-[#FBF9F6]"
                        placeholder="+420 777 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="courseType"
                      className="block text-sm font-semibold text-[#1F1A17] mb-2"
                    >
                      Typ kurzu
                    </label>
                    <select
                      id="courseType"
                      name="courseType"
                      value={formData.courseType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-[#FBF9F6] appearance-none"
                    >
                      <option value="">Vyberte typ kurzu...</option>
                      {courseTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-[#1F1A17] mb-2"
                    >
                      Zpráva *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-2xl border-2 border-[#EBE6DF] focus:border-[#C41E3A] focus:outline-none transition-colors bg-[#FBF9F6] resize-none"
                      placeholder="Napište nám, co vás zajímá..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#C41E3A] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#C41E3A]/30 hover:bg-[#9E1830] hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      "Odesílám..."
                    ) : (
                      <>
                        Odeslat zprávu
                        <Send className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              {contactInfo.map((item) => {
                const Wrapper = item.link ? 'a' : 'div';
                const wrapperProps = item.link ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
                return (
                  <Wrapper
                    key={item.title}
                    {...wrapperProps}
                    className={`bg-white rounded-[32px] p-6 flex items-start gap-5 ${item.link ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer' : ''}`}
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-[#C41E3A] to-[#9E1830] rounded-2xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6B5D54] mb-1">{item.title}</p>
                      <p className={`text-lg font-bold ${item.link ? 'text-[#C41E3A]' : 'text-[#1F1A17]'}`}>
                        {item.content}
                      </p>
                      <p className="text-sm text-[#6B5D54]">{item.subtitle}</p>
                    </div>
                  </Wrapper>
                );
              })}

              {/* Google Maps */}
              <div className="bg-white rounded-[32px] p-4 h-72 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.0307846692927!2d16.621847!3d49.200897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4712943a8a9d1b9d%3A0x400af0f6614b1b0!2sZ%C3%A1brdovick%C3%A1%202%2C%20615%2000%20Brno-Husovice!5e0!3m2!1scs!2scz!4v1705849200000!5m2!1scs!2scz"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: "24px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa - Španělština Brno"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1F1A17] mb-4">
              Časté{" "}
              <span className="font-[family-name:var(--font-playfair)] italic text-[#C41E3A]">
                dotazy
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Jak probíhá zkušební hodina zdarma?",
                a: "Přijdete na běžnou hodinu kurzu a zapojíte se do výuky. Uvidíte, jak učíme, poznáte lektory i ostatní studenty. Není to nic formálního – prostě si to vyzkoušíte.",
              },
              {
                q: "Musím se na zkušební hodinu objednat?",
                a: "Ano, napište nám nebo zavolejte, ať víme, že přijdete, a zařadíme vás do vhodné skupiny podle vaší úrovně.",
              },
              {
                q: "Co když nevím, jakou mám úroveň?",
                a: "Nevadí! Při první konzultaci si spolu popovídáme a zjistíme, kam vás zařadit. Můžete se také podívat na stránku Jazykové úrovně.",
              },
              {
                q: "Kdy začínají kurzy?",
                a: "Skupinové kurzy začínají vždy na začátku semestru (září a únor). Individuální výuku můžete začít kdykoliv.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#FBF9F6] rounded-[24px] p-6"
              >
                <h3 className="font-bold text-[#1F1A17] mb-2">{faq.q}</h3>
                <p className="text-[#6B5D54]">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
