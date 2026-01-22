import Link from "next/link";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center px-6 py-20">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#FFE5E5] to-transparent opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Spanish flag emoji and error badge */}
        <div className="inline-flex items-center gap-2 bg-white text-[#E07B53] px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm mb-8">
          <span>🇪🇸</span> Error 404
        </div>

        {/* Main heading with Spanish flair */}
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#E07B53] mb-4">
          Ay caramba!
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1A17] mb-4">
          Stránka{" "}
          <span className="font-[family-name:var(--font-playfair)] italic text-[#E07B53]">
            nebyla nalezena
          </span>
        </h2>

        <p className="text-lg text-[#6B5D54] max-w-md mx-auto mb-8 leading-relaxed">
          Zdá se, že tato stránka se ztratila někde mezi Brnem a Barcelonou.
          Možná zkuste hledat jinde nebo se vraťte na hlavní stránku.
        </p>

        {/* Decorative 404 */}
        <div className="relative mb-10">
          <div className="text-[180px] sm:text-[220px] font-bold text-[#EBE6DF] leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#E07B53] to-[#C4613D] rounded-3xl flex items-center justify-center shadow-lg shadow-[#E07B53]/30">
              <MapPin className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-[#E07B53] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-[#E07B53]/30 hover:bg-[#C4613D] hover:-translate-y-1 transition-all duration-200"
          >
            <Home className="h-5 w-5" />
            Zpět na hlavní stránku
          </Link>
          <Link
            href="/kurzy"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1F1A17] px-8 py-4 rounded-full font-semibold text-lg border-2 border-[#EBE6DF] hover:border-[#E07B53] hover:text-[#E07B53] transition-all duration-200"
          >
            <Search className="h-5 w-5" />
            Prohlédnout kurzy
          </Link>
        </div>

        {/* Quick navigation */}
        <div className="mt-12 pt-8 border-t border-[#EBE6DF]">
          <p className="text-sm text-[#6B5D54] mb-4">Možná hledáte:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: "/kurzy", label: "Kurzy" },
              { href: "/o-nas", label: "O nás" },
              { href: "/lektori", label: "Lektoři" },
              { href: "/kontakt", label: "Kontakt" },
              { href: "/reference", label: "Reference" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1 text-[#E07B53] hover:text-[#C4613D] font-medium text-sm hover:underline"
              >
                <ArrowLeft className="h-3 w-3" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
