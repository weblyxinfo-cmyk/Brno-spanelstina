import type { Metadata, Viewport } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#C41E3A",
};

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
    default: "Spanelstina Brno | Kurzy spanelstiny s rodilym mluvcim",
    template: "%s | Spanelstina Brno",
  },
  description:
    "Kurzy spanelstiny v Brne s rodilym mluvcim z Chile. Male skupiny max 4 studenti, dva lektori, priprava na DELE. Prvni hodina zdarma!",
  keywords: [
    "kurzy spanelstiny Brno",
    "spanelstina Brno",
    "vyuka spanelstiny",
    "DELE priprava Brno",
    "intenzivni kurz spanelstiny",
    "individualni vyuka spanelstiny",
    "spanelstina pro zacatecniky Brno",
    "obchodni spanelstina",
  ],
  authors: [{ name: "Rodrigo Valenzuela" }],
  creator: "Weblyx.cz",
  applicationName: "Spanelstina Brno",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Spanelstina Brno",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://brno-spanelstina.cz",
    siteName: "Spanelstina Brno",
    title: "Spanelstina Brno | Kurzy spanelstiny s rodilym mluvcim",
    description:
      "Kurzy spanelstiny v Brne s rodilym mluvcim z Chile. Male skupiny max 4 studenti, dva lektori, priprava na DELE.",
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
        <Analytics />
        {children}
      </body>
    </html>
  );
}
