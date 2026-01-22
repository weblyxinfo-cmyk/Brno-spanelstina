import { getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import KontaktClient from "./KontaktClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("kontakt");
  return generateSeoMetadata(seo, {
    title: "Kontakt | Španělština Brno",
    description: "Máte otázky? Chcete se přihlásit na kurz nebo zkušební hodinu zdarma? Napište nám nebo zavolejte – rádi vám poradíme.",
  });
}

export default async function KontaktPage() {
  const content = await getPageContent("kontakt");
  return <KontaktClient content={content} />;
}
