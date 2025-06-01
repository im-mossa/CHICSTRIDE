// src/components/ThemeToggle.jsx
"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  // بار اول حالت ذخیره‌شده یا سیستم
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = saved === "dark" || saved === "light" ? saved : system;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      onClick={toggle}
      className="absolute right-[90px] top-[30%] hover:scale-125 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <FaMoon className="text-l" />
      ) : (
        <FaSun className="text-l" />
      )}
    </button>
  );
}
