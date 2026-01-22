import { getFeaturedCourses, getFeaturedTestimonials, getPageContent, getPageSeo, generateMetadata as generateSeoMetadata } from "@/lib/db/queries";
import HomeClient from "./HomeClient";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("homepage");
  return generateSeoMetadata(seo, {
    title: "Španělština Brno | Kurzy španělštiny s osobním přístupem",
    description: "Malé skupiny, osobní přístup a dva lektoři v každém kurzu. Učíme španělsky tak, aby vás to bavilo a výsledky se dostavily.",
  });
}

export default async function HomePage() {
  const [courses, testimonials, content] = await Promise.all([
    getFeaturedCourses(),
    getFeaturedTestimonials(3),
    getPageContent("homepage"),
  ]);

  return <HomeClient courses={courses} testimonials={testimonials} content={content} />;
}
