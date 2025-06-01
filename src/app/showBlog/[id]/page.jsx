"use client";
import React from "react";
import ShowBlogSection from "@/app/components/ShowBlogSection";
import { useParams } from "next/navigation";

export default function ShowBlog() {
  // useParams فقط در Client Component کار می‌کند
  const { id } = useParams(); // idِ مسیر /ShowBlog/:id

  // اینجا می‌توانیم id را به کامپوننت ShowSliderSection بدهیم
  return <ShowBlogSection slideId={id} />;
}
