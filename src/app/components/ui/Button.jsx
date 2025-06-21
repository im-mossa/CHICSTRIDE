"use client";

import React, { memo } from "react";
import Link from "next/link";

const baseClasses = `
  text-center bg-[#333] text-white
  py-3 px-6 border-2 border-black rounded-lg
  shadow transition-all duration-300 ease-in-out
  cursor-pointer hover:bg-black active:bg-white active:text-black
  disabled:opacity-50 disabled:cursor-not-allowed
`;

/**
 * دکمه یا لینک کاربردی با استایل یکسان
 *
 * @param {object} props
 * @param {string} [props.href]    مسیر لینک
 * @param {() => void} [props.onClick]  هندلر کلیک
 * @param {"button"|"submit"|"reset"} [props.type]  نوع دکمه
 * @param {boolean} [props.disabled]
 * @param {string} [props.className]   کلاس‌های اضافی
 * @param {React.ReactNode} props.children
 */
const Button = ({
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const classes = `${baseClasses} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

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
};

export default memo(Button);
