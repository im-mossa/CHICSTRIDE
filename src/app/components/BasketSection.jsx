// app/components/BasketSection.jsx
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { cookieUtil } from "../utils/helpers";
import Button from "./ui/Button";

export default function BasketSection() {
  const [items, setItems] = useState([]);

  // بارگذاری سبد از کوکی هنگام mount
  useEffect(() => {
    const data = cookieUtil.get("basket");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setItems(Array.isArray(parsed) ? parsed.filter(Boolean) : []);
      } catch {
        setItems([]);
      }
    }
  }, []);

  // محاسبه مجموع قیمت با useMemo
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.qty * item.price, 0),
    [items]
  );

  // بروزرسانی سبد در state و کوکی
  const updateBasket = useCallback((newItems) => {
    setItems(newItems);
    cookieUtil.set("basket", JSON.stringify(newItems), 30, {
      secure: true,
      sameSite: "Strict",
    });
  }, []);

  const increaseQTY = useCallback(
    (idx) =>
      updateBasket(
        items.map((itm, i) => (i === idx ? { ...itm, qty: itm.qty + 1 } : itm))
      ),
    [items, updateBasket]
  );

  const decreaseQTY = useCallback(
    (idx) =>
      updateBasket(
        items
          .map((itm, i) => (i === idx ? { ...itm, qty: itm.qty - 1 } : itm))
          .filter((itm) => itm.qty > 0)
      ),
    [items, updateBasket]
  );

  // اگر سبد خالی باشد
  if (items.length === 0) {
    return (
      <section className="p-6 text-center">
        <h2 className="text-2xl font-bold py-4">Your basket is empty!</h2>
        <div className="py-4">
          <Button href="/products">Browse Products</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="p-4 md:p-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Basket <i className="fa fa-shopping-cart"></i>
      </h2>

      {/* جدول دسکتاپ */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-collapse mb-6 text-black">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Image</th>
              <th className="p-2">Title</th>
              <th className="p-2">Color/Size</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Actions</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itm, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="p-2">
                  <img
                    src={itm.image}
                    alt={itm.title}
                    className="h-20 mx-auto"
                  />
                </td>
                <td className="p-2 font-medium">{itm.title}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: `#${itm.colorHex}` }}
                    />
                    <span>{itm.sizeTitle}</span>
                  </div>
                </td>
                <td className="p-2 text-center">{itm.qty}</td>
                <td className="pt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => increaseQTY(idx)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => decreaseQTY(idx)}
                    className="px-[0.6rem] py-1 border rounded"
                  >
                    -
                  </button>
                </td>
                <td className="p-2 text-right">{itm.qty * itm.price} IRR</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* کارت موبایل */}
      <div className="md:hidden space-y-4 text-black">
        {items.map((itm, idx) => (
          <div
            key={idx}
            className={`flex flex-col sm:flex-row items-center p-4 rounded-lg shadow ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-200"
            }`}
          >
            <img
              src={itm.image}
              alt={itm.title}
              className="w-full sm:w-24 h-24 object-cover rounded"
            />
            <div className="flex-1 ml-0 sm:ml-4 mt-4 sm:mt-0">
              <h3 className="font-semibold text-lg">{itm.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-5 h-5 rounded-full border"
                  style={{ backgroundColor: `#${itm.colorHex}` }}
                />
                <span>{itm.sizeTitle}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => decreaseQTY(idx)}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-2">{itm.qty}</span>
                <button
                  onClick={() => increaseQTY(idx)}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 text-right font-bold">
              {itm.qty * itm.price} IRR
            </div>
          </div>
        ))}
      </div>

      <div className="text-right text-xl font-bold py-4">
        Total: {total} IRR
      </div>
      <div className="text-center py-4">
        <Button href="/checkOut">Proceed To Payment</Button>
      </div>
    </section>
  );
}