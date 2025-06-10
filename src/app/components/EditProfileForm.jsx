// app/components/EditProfileForm.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { cookieUtil, navigationUtil } from "../utils/helpers";
import Button from "./ui/Button";

// تعریف فیلدهای فرم در یک آرایه برای جلوگیری از تکرار
const FIELDS = [
  { label: "First Name", name: "firstName", type: "text" },
  { label: "Last Name", name: "lastName", type: "text" },
  { label: "Username", name: "username", type: "text", disabled: true },
  { label: "Phone", name: "phone", type: "tel" },
  { label: "Postal Code", name: "postalCode", type: "text" },
  { label: "Address", name: "address", type: "text" },
];

export default function EditProfileForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(
    FIELDS.reduce((acc, { name }) => ({ ...acc, [name]: "" }), {})
  );
  const [loading, setLoading] = useState(false);

  // بارگذاری اطلاعات کاربر از کوکی
  useEffect(() => {
    const userJson = cookieUtil.get("currentUser");
    if (!userJson) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please login first.",
      }).then(() => router.push("/login"));
      return;
    }
    try {
      const user = JSON.parse(userJson);
      setFormData((prev) =>
        FIELDS.reduce(
          (acc, { name }) => ({ ...acc, [name]: user[name] ?? prev[name] }),
          {}
        )
      );
    } catch {
      router.push("/login");
    }
  }, [router]);

  // به‌روز رسانی state فرم
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ارسال داده‌ها به سرور
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // اعتبارسنجی فیلدها
      for (const { name } of FIELDS) {
        if (!formData[name]) {
          await Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please fill all fields!",
          });
          return;
        }
      }

      const userJson = cookieUtil.get("currentUser");
      if (!userJson) return router.push("/login");

      const user = JSON.parse(userJson);
      const payload = { ...formData, id: user.id, customerId: user.customerId };

      setLoading(true);
      try {
        const res = await fetch("/api/user/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(payload),
        });
        const json = await res.json();

        if (res.ok && json.status === "OK") {
          await Swal.fire({ icon: "success", title: "Profile updated!" });
          navigationUtil.logout(router);
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || `HTTP ${res.status}`,
          });
        }
      } catch (err) {
        console.error("Edit Profile Error:", err);
        await Swal.fire({
          icon: "error",
          title: "Network Error",
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, router]
  );

  return (
    <div className="max-w-md mx-auto p-6 my-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ label, name, type, disabled }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              required
            />
          </div>
        ))}
        <div className="text-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}