"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import useSliderApi from "../api/sliderApi";
import Link from "next/link";

export default function Slideshow() {
  const { getAll } = useSliderApi();
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // بارگذاری اسلایدها
  useEffect(() => {
    setLoading(true);
    getAll((data) => {
      setSlides(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  // اتوپلی
  useEffect(() => {
    if (slides.length === 0) return;
    const timeoutId = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [current, slides.length]);

  if (loading) {
    return (
      <div className="relative w-[80vw] h-[300px] mx-auto overflow-hidden rounded-2xl">
        <Skeleton className="w-full h-full" containerClassName="leading-none align-top" />
        <div className="absolute align-top top-0 left-0 backdrop-blur-sm rounded-br-2xl p-4 z-10 w-[10em] h-[6em] footer-section">
          <Skeleton width="35%" height={16} />
          <Skeleton width="65%" height={14} className="mt-2" />
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return <div className="p-6 text-center">No slides available.</div>;
  }

  const SlideBox = ({ id, image, title, subTitle }) => (
    <div className="relative flex-shrink-0 w-[80vw] h-[500px] max-[471px]:h-[300px]">
      <img
        src={image}
        alt={title}
        title={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 left-0 bg-white/70 backdrop-blur-sm rounded-br-2xl p-4 flex flex-col justify-start items-start z-20 w-[10em] h-[6em]">
        <Link href={`/showSlider/${id}`}>
          <h2 className="text-[1em] font-bold text-black">{title}</h2>
          <p className="mt-2 text-[1em] text-black">{subTitle}</p>
        </Link>
      </div>
    </div>
  );

  return (
    <section className="relative overflow-hidden w-[80vw] mx-auto rounded-2xl">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          width: `${slides.length * 80}vw`,
          transform: `translateX(+${current * 80}vw)`,
        }}
      >
        {slides.map(({ id, image, title, subTitle }) => (
          <SlideBox key={id} id={id} image={image} title={title} subTitle={subTitle} />
        ))}
      </div>

      {/* دکمه قبلی */}
      <button
        onClick={() =>
          setCurrent((i) => (i - 1 + slides.length) % slides.length)
        }
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 text-white text-2xl z-10"
      >
        ‹
      </button>

      {/* دکمه بعدی */}
      <button
        onClick={() => setCurrent((i) => (i + 1) % slides.length)}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full hover:bg-black/70 text-white text-2xl z-10"
      >
        ›
      </button>
    </section>
  );
}
