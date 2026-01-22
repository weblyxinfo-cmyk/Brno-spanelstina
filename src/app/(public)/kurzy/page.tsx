import { getCourses, getPricing, parseJsonField, getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import KurzyClient from "./KurzyClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("kurzy");
  return generateSeoMetadata(seo, {
    title: "Kurzy španělštiny | Španělština Brno",
    description: "Skupinové, individuální a intenzivní kurzy španělštiny v Brně. Max 4 studenti ve skupině, dva lektoři. První hodina zdarma!",
  });
}

export default async function KurzyPage() {
  const [coursesData, pricingData, content] = await Promise.all([
    getCourses(),
    getPricing(),
    getPageContent("kurzy"),
  ]);

  // Create plain objects to avoid readonly issues
  const courses = coursesData.map((c) => ({
    id: c.id,
    title: c.title,
    subtitle: c.subtitle,
    description: c.description,
    icon: c.icon,
    badge: c.badge,
    category: c.category,
    featured: c.featured,
  }));

  const pricing = pricingData.map((p) => ({
    id: p.id,
    icon: p.icon,
    name: p.name,
    description: p.description,
    price: p.price,
    period: p.period,
    features: parseJsonField<string[]>(p.features),
    featured: p.featured,
  }));

  return <KurzyClient courses={courses} pricing={pricing} content={content} />;
}
