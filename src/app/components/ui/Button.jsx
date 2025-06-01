// src/components/Button.jsx
"use client";

import React from "react";
import Link from "next/link";

const baseClasses = `
 text-center 
  bg-[#333] text-white
  py-[15px] px-[30px]
  border-2 border-black
  rounded-[10px]
  shadow-[1px_1px_5px_0_#bbb]
  transition-all duration-300 ease-in-out
  cursor-pointer
  hover:bg-black
  active:bg-white active:text-black
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export default function Button({
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  children,
  ...props
}) {
  const classes = `${baseClasses} ${className}`;

  if (href) {
    // اگر لینک باشه
    return (
      <Link href={href} {...props} className={classes}>
        {children}
      </Link>
    );
  }

  // دکمه‌ی معمولی
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
