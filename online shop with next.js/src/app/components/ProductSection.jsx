// src/components/ProductSection.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useProductApi } from "../hooks/useProductApi";
import ItemSection from "./ItemSection";
import Skeleton from "react-loading-skeleton";

export default function ProductSection({
  type = "Popular",
  pageIndex = 0,
  pageSize = 10,
  catId = null,
  catName = "",
}) {
  const { getPopularProducts, getNewProducts, getAll, getByCategoryId } =
    useProductApi();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const sectionTitle = catName ? `${catName} Products` : `${type} Products`;

  useEffect(() => {
    setLoading(true);
    setProducts([]);
    const callback = (data) => {
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    if (type === "Popular") {
      getPopularProducts(callback);
    } else if (type === "New") {
      getNewProducts(callback);
    } else if (type === "All") {
      getAll(pageIndex, pageSize, callback);
    } else if (type === "Category" && catId != null) {
      getByCategoryId(catId, pageIndex, pageSize, callback);
    } else {
      getAll(pageIndex, pageSize, callback);
    }
  }, [
    type,
    pageIndex,
    pageSize,
    catId,
    catName,
    getPopularProducts,
    getNewProducts,
    getAll,
    getByCategoryId,
  ]);

  // وقتی loading است، یک آرایه از اسکلتون‌ها بساز
  const skeletons = Array(pageSize).fill(0);

  return (
    <section className="my-8 px-4">
      <h2 className="text-center text-2xl font-bold mb-6">{sectionTitle}</h2>

      {loading ? (
        <div className="flex flex-wrap gap-6 justify-center">
          {skeletons.map((_, idx) => (
            <div
              key={idx}
              className="
                flex-shrink-0 w-[160px] sm:w-[180px] md:w-[205px] h-[250px] relative overflow-hidden
        rounded-[15px] shadow-[1px_1px_5px_0_#bbb]
        transition-all duration-300 ease-in-out
        hover:shadow-[1px_1px_5px_0_#000] hover:scale-[1.03]
              "
            >
              <Skeleton className="w-full h-[200px]" containerClassName="block leading-none align-top" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} />
              <div className="px-2 py-2 text-center h-full footer-section">
                <Skeleton width="80%" height={20} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-6 justify-center">
          {products.map(({ id, title, image }) => (
            <ItemSection key={id} id={id} title={title} image={image} />
          ))}
        </div>
      )}
    </section>
  );
}
