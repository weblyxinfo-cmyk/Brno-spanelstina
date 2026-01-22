import Link from "next/link";
import { MapPin, Mail, Clock, Facebook } from "lucide-react";
import PageViewCounter from "@/components/PageViewCounter";
import { SITE_CONFIG } from "@/lib/constants";

const footerLinks = {
  kurzy: [
    { name: "Skupinové kurzy", href: "/kurzy#skupinove" },
    { name: "Individuální výuka", href: "/kurzy#individualni" },
    { name: "Intenzivní kurzy", href: "/kurzy#intenzivni" },
    { name: "Příprava na DELE", href: "/kurzy#dele" },
  ],
  skola: [
    { name: "O nás", href: "/o-nas" },
    { name: "Lektoři", href: "/lektori" },
    { name: "Reference", href: "/reference" },
    { name: "Jazykové úrovně", href: "/jazykove-urovne" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#EBE6DF]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#1F1A17]">
                Španělština <span className="text-[#C41E3A]">Brno</span>
              </span>
            </Link>
            <p className="mt-4 text-[#6B5D54] text-sm leading-relaxed max-w-xs">
              Učíme španělsky s osobním přístupem od roku 2010. Malé skupiny, velké výsledky.
            </p>
          </div>

          {/* Kurzy */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5D54] mb-4">
              Kurzy
            </h3>
            <ul className="space-y-3">
              {footerLinks.kurzy.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#1F1A17] hover:text-[#C41E3A] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Škola */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5D54] mb-4">
              Škola
            </h3>
            <ul className="space-y-3">
              {footerLinks.skola.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[#1F1A17] hover:text-[#C41E3A] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B5D54] mb-4">
              Kontakt
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={SITE_CONFIG.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-[#1F1A17] hover:text-[#C41E3A] transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{SITE_CONFIG.contact.address}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="flex items-center gap-2 text-[#1F1A17] hover:text-[#C41E3A] transition-colors text-sm"
                >
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>{SITE_CONFIG.contact.email}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-[#6B5D54] text-sm">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{SITE_CONFIG.location.transport}</span>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1F1A17] hover:text-[#C41E3A] transition-colors text-sm"
                >
                  <Facebook className="h-4 w-4 flex-shrink-0" />
                  <span>Facebook</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#EBE6DF] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6B5D54]">
            © {new Date().getFullYear()} Rodrigo Valenzuela. Všechna práva vyhrazena.
          </p>
          <PageViewCounter />
          <p className="text-sm text-[#6B5D54]">
            Vytvořil{" "}
            <a
              href="https://weblyx.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C41E3A] hover:underline"
            >
              Weblyx.cz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
