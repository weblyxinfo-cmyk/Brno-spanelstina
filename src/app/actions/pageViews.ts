"use server";

import { getPageViews, incrementPageViews } from "@/lib/db/queries";

export async function recordPageView(): Promise<{ success: boolean; count: number }> {
  try {
    const count = await incrementPageViews();
    return { success: true, count };
  } catch (error) {
    console.error("Error recording page view:", error);
    return { success: false, count: 0 };
  }
}

export async function fetchPageViews(): Promise<{ success: boolean; count: number }> {
  try {
    const count = await getPageViews();
    return { success: true, count };
  } catch (error) {
    console.error("Error fetching page views:", error);
    return { success: false, count: 0 };
  }
}
