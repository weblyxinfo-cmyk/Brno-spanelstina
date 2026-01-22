"use client";

import Breadcrumbs from "./Breadcrumbs";

interface AdminContentProps {
  children: React.ReactNode;
}

export default function AdminContent({ children }: AdminContentProps) {
  return (
    <div className="p-8">
      <Breadcrumbs />
      {children}
    </div>
  );
}
