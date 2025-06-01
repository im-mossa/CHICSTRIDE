//app/components/ShowProduct.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useProductApi } from "@/app/hooks/useProductApi";
import BasketDB from "@/app/db/BasketDB";
import Swal from "sweetalert2";
import Button from "@/app/components/ui/Button";
import Skeleton from "react-loading-skeleton";

export default function ShowProductSection({ slideId }) {
  const productId = slideId;
  const { getById } = useProductApi();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);

  // بارگذاری محصول
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    getById(productId, (dataList) => {
      setProduct(dataList[0] || null);
      setLoading(false);
    });
  }, [productId, getById]);

  const changeColor = (color) => setSelectedColor(color);
  const changeSize = (size) => setSelectedSize(size);

  const addToBasket = () => {
    if (!selectedColor) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a color!",
      });
      return;
    }
    if (!selectedSize) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please select a size!",
      });
      return;
    }

    BasketDB.addToBasket(product, selectedSize, selectedColor);
    Swal.fire({
      icon: "success",
      title: "Added!",
      text: "Product added to basket.",
    });
  };

  // اسکلتون هنگام لودینگ
  if (loading) {
    return (
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Skeleton تصویر */}
            <div className="md:w-1/2">
              <Skeleton className="w-full h-[300px] md:h-[500px] rounded-lg" />
            </div>
            {/* Skeleton جزئیات */}
            <div className="md:w-1/2 space-y-6">
              <Skeleton width="55%" height={32} />
              <Skeleton width="10%" height={24} />
              <div>
                {/* <Skeleton width="30%" height={20} /> */}
                <div className="flex gap-4 mt-2">
                  <Skeleton circle width={32} height={32} />
                  <Skeleton circle width={32} height={32} />
                  <Skeleton circle width={32} height={32} />
                </div>
              </div>
              <div>
                <Skeleton width="30%" height={20} />
                <div className="flex gap-4 mt-2">
                  <Skeleton width={48} height={32} />
                  <Skeleton width={48} height={32} />
                  <Skeleton width={48} height={32} />
                </div>
              </div>
              <div>
                <Skeleton width="10%" height={24} />
                <Skeleton width="30%" height={24} />
              </div>
              <div>
                <Skeleton width="20%" height={24} />
                <Skeleton count={4} />
              </div>
              <Skeleton width="50%" height={40} />
            </div>
          </div>
        </main>
    );
  }

  if (!product) {
    return <div className="py-20 text-center">No product found.</div>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* تصویر محصول */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-lg shadow"
          />
        </div>

        {/* جزئیات */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-2xl font-bold">
            {product.category.title} – {product.title}
          </h1>

          {/* انتخاب رنگ */}
          <div>
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex gap-4">
              {product.colors.map((c) => (
                <button
                  key={c.id}
                  onClick={() => changeColor(c)}
                  title={c.title}
                  className={`w-8 h-8 rounded-full border-6 transition-colors ${
                    selectedColor?.id === c.id
                      ? "border-blue-400"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: `#${c.hexValue}` }}
                />
              ))}
            </div>
          </div>

          {/* انتخاب سایز */}
          <div>
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex gap-4">
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => changeSize(s)}
                  className={`px-3 py-1 rounded border-6 transition-colors ${
                    selectedSize?.id === s.id
                      ? "border-blue-400"
                      : "border-gray-300"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* قیمت */}
          <div>
            <h3 className="font-semibold mb-2">Price</h3>
            <div className="text-2xl font-bold">TL{product.price}</div>
          </div>

          {/* توضیحات */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p>{product.description}</p>
          </div>

          <Button onClick={addToBasket}>Add to Basket</Button>
        </div>
      </div>
    </main>
  );
}
