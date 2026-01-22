import { getLevels, parseJsonField, getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import JazykoveUrovneClient from "./JazykoveUrovneClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("jazykove-urovne");
  return generateSeoMetadata(seo, {
    title: "Jazykové úrovně | Španělština Brno",
    description: "Přehled jazykových úrovní CEFR pro španělštinu. Od A1 po B2+ - zjistěte, která úroveň odpovídá vašim znalostem.",
  });
}

export default async function JazykoveUrovnePage() {
  const [levelsData, content] = await Promise.all([
    getLevels(),
    getPageContent("jazykove-urovne"),
  ]);

  // Transform data to parse JSON fields
  const levels = levelsData.map((l) => ({
    ...l,
    grammar: parseJsonField<string[]>(l.grammar),
  }));

  return <JazykoveUrovneClient levels={levels} content={content} />;
}
