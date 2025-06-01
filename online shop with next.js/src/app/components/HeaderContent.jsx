// src/components/HeaderContent.jsx
"use client";

import React from "react";
import ThemeToggle from "./ThemeToggle";
import MenuItems from "./MenuItems";
import useLogoSrc from "../hooks/useLogoSrc";

/**
 * HeaderContent renders the logo, theme toggle, and menu items.
 * The logo path is determined by the current theme via useLogoSrc hook.
 */
export default function HeaderContent() {
  const logoSrc = useLogoSrc();

  return (
    <div className="flex justify-center items-center h-20 max-w-[1500px] mx-auto">
      <img
        src={logoSrc}
        alt="Logo"
        className="absolute hidden md:block left-[30px] top-1/3 w-[130px] h-[30px]"
      />
      <ThemeToggle />
      <MenuItems />
    </div>
  );
}
