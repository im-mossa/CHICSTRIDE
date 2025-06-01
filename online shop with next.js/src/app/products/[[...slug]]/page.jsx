// src/app/products/[[...slug]]/page.jsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import CategorySection from "@/app/components/CategorySection";
import ProductSection from "@/app/components/ProductSection";

export default function ProductsPage() {
  const params = useParams(); // { slug: string[] | undefined }
  const slug = params?.slug || []; // اگر undefined باشد، به [] تبدیل می‌کنیم

  // حالت پیش‌فرض:
  //  - اگر slug خالی باشد، type = "All"
  //  - اگر فقط یک عنصر باشد، type = slug[0]
  //  - اگر سه‌تایی باشد و type === "Category"، taxId=slug[1] و catName=slug[2]
  let type = "All";
  let catId = null;
  let catName = "";

  if (slug.length >= 1) {
    type = slug[0]; // Popular, New, All یا Category
    if (type === "Category" && slug.length >= 3) {
      catId = slug[1];
      catName = decodeURIComponent(slug[2]);
    }
  }

  return (
    <div className="py-2">
      {/* همیشه CategorySection را نمایش می‌دهیم (می‌توانید شرطی کنید اگر
          type==="Category" نباشد حذف شود) */}
      <CategorySection />

      {/* ProductSection با props داینامیک */}
      <ProductSection type={type} catId={catId} catName={catName} />
    </div>
  );
}
