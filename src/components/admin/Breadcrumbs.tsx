"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

// Map of route segments to Czech labels
const routeLabels: Record<string, string> = {
  admin: "Dashboard",
  kurzy: "Kurzy",
  lektori: "Lektori",
  urovne: "Urovne",
  cenik: "Cenik",
  reference: "Reference",
  nastaveni: "Nastaveni",
  obsah: "Obsah stranek",
  seo: "SEO",
  zpravy: "Zpravy",
  upravit: "Upravit",
  novy: "Novy",
};

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  // Parse the pathname into breadcrumb items
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with Dashboard
    breadcrumbs.push({
      label: "Dashboard",
      href: "/admin",
      isCurrentPage: pathname === "/admin",
    });

    // Build breadcrumbs for each segment after "admin"
    let currentPath = "/admin";
    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `/${segment}`;

      // Get label from mapping or capitalize the segment
      const label =
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1);

      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrentPage: i === segments.length - 1,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs if we're on the dashboard (only one item)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 mx-2 text-[#6B5D54]/50 flex-shrink-0" />
            )}
            {breadcrumb.isCurrentPage ? (
              <span className="text-[#6B5D54] font-medium">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-[#6B5D54] hover:text-[#E07B53] transition-colors flex items-center gap-1.5"
              >
                {index === 0 && <Home className="w-4 h-4" />}
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
