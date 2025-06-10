// src/app/components/ChangePasswordForm.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { cookieUtil, navigationUtil } from "../utils/helpers";
import Button from "./ui/Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const FIELDS = [
  { label: "Current Password", name: "currentPassword" },
  { label: "New Password", name: "newPassword" },
];

export default function ChangePasswordForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [show, setShow] = useState({ current: false, new: false });
  const [loading, setLoading] = useState(false);

  // Load username once on mount
  useEffect(() => {
    const raw = cookieUtil.get("currentUser");
    if (!raw) {
      Swal.fire({
        icon: "error",
        title: "Not logged in",
        text: "Please log in first.",
      }).then(() => router.push("/login"));
      return;
    }
    try {
      const user = JSON.parse(raw);
      setUsername(user.username);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleShow = useCallback((field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validate
      if (!form.currentPassword || !form.newPassword) {
        await Swal.fire({
          icon: "error",
          title: "Missing Fields",
          text: "Please fill in both fields.",
        });
        return;
      }

      const raw = cookieUtil.get("currentUser");
      if (!raw) return router.push("/login");
      const user = JSON.parse(raw);

      setLoading(true);
      try {
        const res = await fetch("/api/user/changePassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            oldPassword: form.currentPassword,
            password: form.newPassword,
            repeatPassword: form.newPassword,
            id: user.id,
            customerId: user.customerId,
          }),
        });

        const result = await res.json();
        if (res.ok && result.status === "OK") {
          await Swal.fire({
            icon: "success",
            title: "Success",
            text: "Password changed successfully.",
          });
          navigationUtil.logout(router);
        } else {
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: result.message || `HTTP ${res.status}`,
          });
        }
      } catch (err) {
        console.error("ChangePasswordForm Error:", err);
        await Swal.fire({
          icon: "error",
          title: "Network Error",
          text: err.message,
        });
      } finally {
        setLoading(false);
      }
    },
    [form, router]
  );

  return (
    <div className="max-w-md mx-auto p-6 my-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            disabled
            className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
          />
        </div>

        {FIELDS.map(({ label, name }) => (
          <div key={name} className="relative">
            <label
              htmlFor={name}
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={
                show[name === "currentPassword" ? "current" : "new"]
                  ? "text"
                  : "password"
              }
              value={form[name]}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring pr-10"
            />
            <button
              type="button"
              onClick={() =>
                toggleShow(name === "currentPassword" ? "current" : "new")
              }
              className="absolute inset-y-0 right-2 top-6 flex items-center"
              tabIndex={-1}
            >
              {show[name === "currentPassword" ? "current" : "new"] ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        ))}

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
