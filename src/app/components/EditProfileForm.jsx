// src/components/EditProfileForm.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUserApi from "../hooks/useUserApi";
import {
  getCookie,
  setCookie,
  showLoading,
  showButton,
} from "../utils/helpers";
import Button from "./ui/Button";

export default function EditProfileForm() {
  const router = useRouter();
  const { editProfile } = useUserApi();

  // state فرم
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    postalCode: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // بارگذاری اطلاعات کنونی کاربر و پر کردن فرم
  useEffect(() => {
    const json = getCookie("currentUser");
    if (!json) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please login first.",
      }).then(() => router.push("/login"));
      return;
    }
    try {
      const u = JSON.parse(json);
      setFormData({
        firstName: u.firstName,
        lastName: u.lastName,
        username: u.username,
        phone: u.phone,
        postalCode: u.postalCode,
        address: u.address,
      });
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // اعتبارسنجی ساده
    for (let key of [
      "firstName",
      "lastName",
      "username",
      "phone",
      "postalCode",
      "address",
    ]) {
      if (!formData[key]) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill all fields!",
        });
        return;
      }
    }

    const currentUser = JSON.parse(getCookie("currentUser"));
    const payload = {
      ...formData,
      id: currentUser.id,
      customerId: currentUser.customerId,
      token: currentUser.token,
    };

    setLoading(true);
    showLoading();
    try {
      await editProfile(payload, currentUser.token, (data) => {
        const updated = Array.isArray(data) ? data[0] : data;
        // ذخیره در کوکی
        setCookie("currentUser", JSON.stringify(updated), 5);
        setCookie("token", updated.token, 5);
        Swal.fire({ icon: "success", title: "Profile Updated!" }).then(() =>
          router.push("/login")
        );
      });
    } catch (err) {
      // خطاها در useUserApi با Swal مدیریت می‌شوند
    } finally {
      setLoading(false);
      showButton();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 my-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Username", name: "username", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "Postal Code", name: "postalCode", type: "text" },
          { label: "Address", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {name === "username" ? (
              <div className="relative">
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={formData[name]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring hover:cursor-not-allowed"
                  required
                  disabled
                />
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

        <div className="text-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
