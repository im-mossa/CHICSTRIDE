// src/components/MenuItems.jsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes, FaShoppingCart, FaUser } from "react-icons/fa";
import { checkUser } from "../utils/helpers";
import useLogoSrc from "../hooks/useLogoSrc";

export default function MenuItems() {
  const [menuState, setMenuState] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "About us", path: "/aboutUs" },
  ];

  const logoSrc = useLogoSrc();

  return (
    <>
      {/* دکمه نمایش/مخفی کردن منو در موبایل */}
      <div
        data-testid="button"
        className="block md:hidden absolute top-4 left-4 cursor-pointer z-20"
        onClick={() => setMenuState(!menuState)}
      >
        {menuState ? (
          <FaTimes className="text-2xl pt-2" />
        ) : (
          <FaBars className="text-2xl pt-2" />
        )}
      </div>

      {/* لیست آیتم‌های منو */}
      <ul
        data-testid="menu"
        className={`footer-section fixed top-20 left-0 text-[16px] w-full h-[90vh] flex flex-col justify-center items-center
        z-[1] transition-all duration-500 ease-in-out
          ${menuState ? "translate-x-0" : "translate-x-[-100%]"}
          md:static md:translate-x-0 md:w-[60vw] md:flex-row md:h-auto md:bg-transparent md:justify-end`}
      >
        <li>
          <img
            src={logoSrc}
            className="absolute left-[30%] top-1/6 md:hidden w-[130px] h-[30px]"
          />
        </li>
        {navItems.map((item) => (
          <li
            key={item.path}
            className={`list-none p-4 border-b-4 border-transparent transition-all duration-200 ease-out
              w-full text-center hover:font-bold
              md:hover:bg-transparent md:hover:text-current md:hover:border-b-current
              ${isActive(item.path) ? "font-bold" : ""}`}
          >
            <Link href={item.path} onClick={() => setMenuState(false)}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <ul>
        <li>
          <Link href="/basket">
            <FaShoppingCart className="text-[18px] absolute right-[30px] top-1/3 hover:scale-125 transition-transform" />
          </Link>
        </li>
        <li>
          <div className="hover:cursor-pointer" onClick={() => checkUser()}>
            <FaUser className="text-[18px] absolute right-[60px] top-1/3 hover:scale-125 transition-transform" />
          </div>
        </li>
      </ul>
    </>
  );
}
