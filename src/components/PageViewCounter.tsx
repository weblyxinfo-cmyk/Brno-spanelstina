"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { recordPageView, fetchPageViews } from "@/app/actions/pageViews";

interface PageViewCounterProps {
  recordView?: boolean;
}

export default function PageViewCounter({ recordView = true }: PageViewCounterProps) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadViews() {
      if (recordView) {
        const result = await recordPageView();
        if (result.success) {
          setCount(result.count);
        }
      } else {
        const result = await fetchPageViews();
        if (result.success) {
          setCount(result.count);
        }
      }
    }
    loadViews();
  }, [recordView]);

  if (count === null) {
    return null;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-[#6B5D54]">
      <Eye className="h-4 w-4" />
      <span>{count.toLocaleString("cs-CZ")} zobrazení</span>
    </span>
  );
}
