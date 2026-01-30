import { Metadata } from "next";
import RezervaceClient from "./RezervaceClient";
import { getActiveLessons } from "@/app/actions/booking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Rezervace lekce | Španělština Brno",
  description: "Zarezervujte si lekci španělštiny online. Vyberte typ lekce, termín a zaplaťte bezpečně kartou.",
};

export default async function RezervacePage() {
  let lessons: Awaited<ReturnType<typeof getActiveLessons>> = [];
  try {
    lessons = await getActiveLessons();
  } catch (error) {
    console.error("Error loading lessons:", error);
  }

  return <RezervaceClient initialLessons={lessons} />;
}
