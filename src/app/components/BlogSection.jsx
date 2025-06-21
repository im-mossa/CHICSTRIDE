// app/components/BlogSection.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Skeleton from "react-loading-skeleton";
import { useBlogApi } from "../hooks/useBlogApi";
import ItemSection from "./ItemSection";

export default function BlogSection() {
  const { getAllPosts } = useBlogApi();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(() => {
    getAllPosts((data) => {
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [getAllPosts]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (loading) {
    return (
      <section>
        <h2 className="pt-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
          Blog
        </h2>
        <div className="w-[98%] mx-auto my-6 pt-2 overflow-x-auto">
          <div className="flex gap-4 p-2">
            {[...Array(1)].map((_, idx) => (
              <div
                key={idx}
                className="
                              flex-shrink-0 w-[160px] sm:w-[180px] md:w-[205px] h-[250px] relative overflow-hidden
                      rounded-[15px] shadow-[1px_1px_5px_0_#bbb]
                      transition-all duration-300 ease-in-out
                      hover:shadow-[1px_1px_5px_0_#000] hover:scale-[1.03]
                            "
              >
                <Skeleton
                  className="w-full h-[200px]"
                  containerClassName="block leading-none align-top"
                  style={{
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                  }}
                />
                <div className="px-2 py-2 text-center h-full footer-section">
                  <Skeleton width="80%" height={20} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="pt-4 text-center text-lg sm:text-xl md:text-2xl font-semibold">
        Blog
      </h2>

      <div className="w-[98%] mx-auto my-6 pt-2 overflow-x-auto">
        <div className="flex gap-4 p-2">
          {posts.map(({ id, title, image }) => (
            <ItemSection
              key={id}
              id={id}
              title={title}
              image={image}
              href={`/showBlog/${id}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
