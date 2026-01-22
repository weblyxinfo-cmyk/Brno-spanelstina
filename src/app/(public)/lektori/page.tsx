import { getLektori, parseJsonField, getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import LektoriClient from "./LektoriClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("lektori");
  return generateSeoMetadata(seo, {
    title: "Naši lektoři | Španělština Brno",
    description: "Poznejte náš tým lektorů španělštiny. Rodilí mluvčí z Chile a Španělska s letitými zkušenostmi s výukou.",
  });
}

export default async function LektoriPage() {
  const [lektoriData, content] = await Promise.all([
    getLektori(),
    getPageContent("lektori"),
  ]);

  // Transform data to parse JSON fields
  const lektori = lektoriData.map((l) => ({
    ...l,
    bio: parseJsonField<string[]>(l.bio),
    highlights: parseJsonField<Array<{ icon: string; text: string }>>(l.highlights),
  }));

  return <LektoriClient lektori={lektori} content={content} />;
}
