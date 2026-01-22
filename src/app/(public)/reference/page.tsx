import { getTestimonials, getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import { getPublicStats } from "@/app/actions/admin";
import ReferenceClient from "./ReferenceClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("reference");
  return generateSeoMetadata(seo, {
    title: "Reference | Španělština Brno",
    description: "Co říkají naši studenti o kurzech španělštiny v Brně. Přečtěte si reference a hodnocení od spokojených studentů.",
  });
}

export default async function ReferencePage() {
  const [testimonials, stats, content] = await Promise.all([
    getTestimonials(),
    getPublicStats(),
    getPageContent("reference"),
  ]);

  return <ReferenceClient testimonials={testimonials} stats={stats} content={content} />;
}
