"use client";
import React from "react";
import ShowSliderSection from "@/app/components/ShowSliderSection";
import { useParams } from "next/navigation";

export default function ShowSliderPage() {
  // useParams فقط در Client Component کار می‌کند
  const { id } = useParams(); // idِ مسیر /showSlider/:id

  // اینجا می‌توانیم id را به کامپوننت ShowSliderSection بدهیم
  return <ShowSliderSection slideId={id} />;
}
