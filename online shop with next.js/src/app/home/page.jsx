// src/page/home/page.js
"use client";

import React, { useState } from "react";
import Slideshow from "@/app/components/Slideshow";
import CategorySection from "@/app/components/CategorySection";
import ProductSection from "@/app/components/ProductSection";

export default function Home() {
  const [activeTag, setActiveTag] = useState("Popular");

  return (
    <div className="py-8 home">
      {/* Slider */}
      <Slideshow />

      {/* Categories */}
      <CategorySection />

      {/* Filter Buttons */}
      <div className="flex gap-4 justify-center mt-8">
        {["Popular", "New", "All"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveTag(type)}
            className={`px-4 py-2 rounded-xl transition duration-200 text-white dark:bg-gray-500  hover:cursor-pointer
              ${activeTag === type ? "bg-gray-500" : "hover:bg-gray-100 hover:text-black"}`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Products Section receives activeTag as prop */}
      <ProductSection type={activeTag} />
    </div>
  );
}
