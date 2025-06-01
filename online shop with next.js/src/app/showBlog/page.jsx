// src/app/panel/page.jsx
import React, { Suspense } from "react";
import ShowBlogSection from "@/app/components/ShowBlogSection";

export default function PanelPage() {
  return (
    <Suspense
      fallback={<div className="py-20 text-center">Loading product...</div>}
    >
      <ShowBlogSection />
    </Suspense>
  );
}
