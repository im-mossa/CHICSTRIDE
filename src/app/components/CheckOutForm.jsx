"use client";

import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import BasketDB from "../db/BasketDB";
import { useRouter } from "next/navigation";
import { cookieUtil, navigationUtil } from "../utils/helpers";
import useTransactionApi from "../hooks/useTransactionApi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "./ui/Button";

// مقدار اولیه فرم
const initialForm = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  phone: "",
  postalCode: "",
  address: "",
  // برای سازگاری با backend، فیلدهای پسورد قدیمی را داشته باشیم اما در validation نادیده بگیریم
  oldPassword: "",
  repeatPassword: "",
};

// پیکربندی فیلدها برای رندر داینامیک
const fields = [
  { label: "First Name", name: "firstName" },
  { label: "Last Name", name: "lastName" },
  { label: "User Name", name: "username" },
  { label: "Password", name: "password", type: "password" },
  { label: "Phone", name: "phone" },
  { label: "Postal Code", name: "postalCode" },
  { label: "Address", name: "address" },
];

export default function CheckoutForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const { goToPayment } = useTransactionApi();

  // بارگذاری اطلاعات کاربر از کوکی
  useEffect(() => {
    const json = cookieUtil.get("currentUser");
    if (!json) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please log in first.",
      }).then(navigationUtil.logout(router));
      return;
    }
    try {
      const user = JSON.parse(json);
      setFormData((prev) => ({ ...prev, ...user }));
    } catch {
      console.warn("Invalid currentUser cookie");
      navigationUtil.logout(router); // کوکی‌ها را هم پاک می‌کند
    }
  }, []);

  // هندل تغییر فیلدها
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // آماده‌سازی آیتم‌های سبد خرید
  const buildItems = useCallback(() => {
    const basketList = BasketDB.load() || [];
    return basketList.map(
      ({
        id,
        title,
        image,
        price,
        qty,
        colorId,
        colorTitle,
        colorHex,
        sizeId,
        sizeTitle,
      }) => ({
        id,
        product: {
          id,
          title,
          image,
          description: "",
          addDate: "",
          visitCount: 0,
          price,
          category: { id: 0, title: "", image: "" },
          colors: [
            { id: colorId, title: colorTitle || "", hexValue: colorHex || "" },
          ],
          sizes: [{ id: sizeId, title: sizeTitle || "" }],
        },
        quantity: qty,
        unitPrice: price,
      })
    );
  }, []);

  // ارسال به پرداخت
  const handleGoToPayment = useCallback(async () => {
    // اعتبارسنجی: فقط فیلدهای نمایش‌داده‌شده را چک کنیم
    const visibleFieldNames = fields.map((f) => f.name);
    const missing = visibleFieldNames.filter((name) => {
      const v = formData[name];
      const str = v == null ? "" : String(v).trim();
      return str === "";
    });

    if (missing.length > 0) {
      const labels = missing.map(
        (name) => fields.find((f) => f.name === name)?.label || name
      );
      return Swal.fire({
        icon: "error",
        title: "Fields Missing",
        text: `Please fill in: ${labels.join(", ")}`,
      });
    }

    // آماده‌سازی داده‌ها
    const items = buildItems();
    const payload = { user: formData, items };
    const token = cookieUtil.get("token") || "";

    try {
      const resp = await goToPayment(payload, token);
      if (Array.isArray(resp) && resp[0]) {
        window.location.href = resp[0];
      } else {
        throw new Error("Invalid server response");
      }
    } catch (err) {
      console.error("Payment failed", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "The payment was unsuccessful.",
      });
    }
  }, [formData, buildItems, goToPayment]);

  return (
    <section className="max-w-md mx-auto my-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Check Out</h2>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map(({ label, name, type = "text" }) => (
          <div key={name} className="flex flex-col">
            <label htmlFor={name} className="mb-1">
              {label}
            </label>
            {name === "password" ? (
              <div className="relative">
                <input
                  id={name}
                  name={name}
                  type={showPassword ? "text" : "password"}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 top-1 flex items-center text-gray-600 hover:text-black"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            ) : (
              <input
                id={name}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
                required
              />
            )}
          </div>
        ))}
        <Button type="button" onClick={handleGoToPayment}>
          Go To Payment
        </Button>
      </form>
    </section>
  );
}
