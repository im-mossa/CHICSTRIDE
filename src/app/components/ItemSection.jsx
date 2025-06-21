"use client";

import React, { memo } from "react";
import Link from "next/link";

/**
 * کامپوننت نمایش یک آیتم دسته‌بندی یا محصول
 *
 * @param {{
 *   id: number | string,
 *   title: string,
 *   image: string,
 *   href?: string,
 * }} props
 */
const ItemSection = ({ id, title, image, href }) => {
  // اگر مسیر به کامپوننت پاس نشده، به مسیر پیش‌فرض برو
  const linkPath = href ?? `/showProduct/${id}`;

  return (
    <div
      className="
      flex-shrink-0 w-[160px] sm:w-[180px] md:w-[205px] h-[250px]
      relative overflow-hidden rounded-2xl shadow-lg
      transition-transform duration-300 ease-in-out
      hover:shadow-xl hover:scale-105
    "
    >
      <Link href={linkPath} className="block w-full h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <h3
          className="
          absolute bottom-0 left-0 w-full bg-black/50 text-white
          text-base sm:text-lg md:text-xl text-center
          py-2 sm:py-3 md:py-4
        "
        >
          {title}
        </h3>
      </Link>
    </div>
  );
};

// استفاده از React.memo برای جلوگیری از رندر اضافی
export default memo(ItemSection);
