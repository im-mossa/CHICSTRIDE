// src/app/components/CategorySection.jsx
"use client";

import React, { useEffect, useState } from "react";
import useCategoryApi from "../api/categoryApi";
import ItemSection from "./ItemSection";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategorySection() {
  const { getAllCategories } = useCategoryApi();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getAllCategories((data) => setCategories(Array.isArray(data) ? data : []));
  }, [getAllCategories]);

  // loading skeleton: اگر هنوز categories خالی است
  if (!categories.length) {
    return (
      <section>
        <h2 className="pt-4 text-center text-2xl font-semibold">
          Product Categories
        </h2>
        <div className="w-[98%] mx-auto my-6 pt-2 h-[280px] overflow-x-auto">
          <div className="flex gap-4">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="
                    flex-shrink-0 w-[160px] sm:w-[180px] md:w-[205px] h-[250px]
                    relative overflow-hidden rounded-[15px]
                    shadow-[1px_1px_5px_0_#bbb]
                    transition-all duration-300 ease-in-out
                    hover:shadow-[1px_1px_5px_0_#000] hover:scale-[1.03]
                  "
                >
                  <Skeleton
                    className="w-full h-[200px] object-cover"
                    containerClassName="block leading-none align-top"
                    style={{
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <div className="px-2 py-2 text-center h-full footer-section">
                    <Skeleton width="80%" height={20} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="pt-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
        Product Categories
      </h2>
      <div className="w-[98%] mx-auto my-6 pt-2 h-[280px] overflow-x-auto">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <ItemSection
              key={cat.id}
              id={cat.id}
              title={cat.title}
              image={cat.image}
              // لینک جدید داینامیک:
              //  /products/Category/[cat.id]/[cat.title]
              href={`/products/Category/${cat.id}/${encodeURIComponent(
                cat.title
              )}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
