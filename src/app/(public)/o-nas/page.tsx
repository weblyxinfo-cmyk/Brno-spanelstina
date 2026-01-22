import { getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import ONasClient from "./ONasClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("o-nas");
  return generateSeoMetadata(seo, {
    title: "O nás | Španělština Brno",
    description: "Od roku 2010 pomáháme Brňákům objevovat krásu španělštiny. Nejsme velká jazykovka – jsme parta nadšenců, kteří milují svou práci.",
  });
}

export default async function ONasPage() {
  const content = await getPageContent("o-nas");
  return <ONasClient content={content} />;
}
