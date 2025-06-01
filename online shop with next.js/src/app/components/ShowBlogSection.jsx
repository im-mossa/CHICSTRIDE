"use client";

import React, { useEffect, useState } from "react";
import { useBlogApi } from "@/app/hooks/useBlogApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ShowBlogSection({ slideId }) {
  const blogId = slideId;

  const { getPostById } = useBlogApi();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (blogId) {
      setLoading(true);
      getPostById(blogId, (dataList) => {
        const data = dataList?.[0];
        setBlog(data || null);
        setLoading(false);
      });
    }
  }, [blogId, getPostById]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-10">
        <Skeleton className="w-full h-[400px] object-cover rounded-lg mb-6" />
        <Skeleton width="60%" height={40} className="mb-4" />
        <Skeleton width="40%" height={30} className="mb-6" />
        <Skeleton count={5} className="mb-2" />
        <Skeleton width={80} height={20} />
        <div className="flex gap-4 mt-6">
          <Skeleton width={80} height={20} />
          <Skeleton width={120} height={20} />
        </div>
      </main>
    );
  }

  if (!blog) {
    return <div className="py-20 text-center">No blog post found.</div>;
  }

  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 py-6">
        <img
          src={blog.image}
          alt="blog"
          className="w-full max-h-[400px] object-cover rounded-lg"
        />

        <h1 className="text-2xl sm:text-3xl font-bold my-4">{blog.title}</h1>

        <h3 className="text-xl sm:text-2xl font-semibold mb-6">
          {blog.subTitle}
        </h3>

        <p className="text-base sm:text-lg leading-relaxed mb-6">
          {blog.description}
        </p>

        <div className="text-sm text-gray-600 space-y-2">
          <div>
            <strong>{blog.visitCount}</strong> Visited
          </div>
          <div>
            Date of writing:{" "}
            <span>{new Date(blog.addDate).toLocaleDateString()}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
