"use client";
import React from "react";
import ShowProductSection from "@/app/components/ShowProductSection";
import { useParams } from "next/navigation";

export default function showProduct() {
  // useParams فقط در Client Component کار می‌کند
  const { id } = useParams(); // idِ مسیر /showProduct/:id

  // اینجا می‌توانیم id را به کامپوننت ShowSliderSection بدهیم
  return <ShowProductSection slideId={id} />;
}
