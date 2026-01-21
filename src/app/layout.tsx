import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Španělština Brno | Kurzy španělštiny s rodilým mluvčím",
    template: "%s | Španělština Brno",
  },
  description:
    "Kurzy španělštiny v Brně s rodilým mluvčím z Chile. Malé skupiny max 4 studenti, dva lektoři, příprava na DELE. První hodina zdarma!",
  keywords: [
    "kurzy španělštiny Brno",
    "španělština Brno",
    "výuka španělštiny",
    "DELE příprava Brno",
    "intenzivní kurz španělštiny",
    "individuální výuka španělštiny",
    "španělština pro začátečníky Brno",
    "obchodní španělština",
  ],
  authors: [{ name: "Rodrigo Valenzuela" }],
  creator: "Weblyx.cz",
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://brno-spanelstina.cz",
    siteName: "Španělština Brno",
    title: "Španělština Brno | Kurzy španělštiny s rodilým mluvčím",
    description:
      "Kurzy španělštiny v Brně s rodilým mluvčím z Chile. Malé skupiny max 4 studenti, dva lektoři, příprava na DELE.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
