// src/app/components/ChangePasswordForm.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUserApi from "@/app/hooks/useUserApi";
import { getCookie, setCookie } from "@/app/utils/helpers";
// ایمپورت آیکون‌ها از react-icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 👈 آیکون‌ها
import Button from "./ui/Button";

export default function ChangePasswordForm() {
  const router = useRouter();
  const { changePassword } = useUserApi();

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const json = getCookie("currentUser");
    if (!json) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "Please log in first.",
      }).then(() => router.push("/login"));
      return;
    }
    try {
      const user = JSON.parse(json);
      setUsername(user.username);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in both passwords.",
      });
      return;
    }

    const json = getCookie("currentUser");
    const currentUser = JSON.parse(json);
    const payload = {
      ...currentUser,
      oldPassword: currentPassword,
      password: newPassword,
      repeatPassword: newPassword,
    };

    setLoading(true);
    try {
      await changePassword(payload, currentUser.token, (data) => {
        if (!Array.isArray(data) || !data[0]) {
          throw new Error("Empty response from server");
        }
        const updated = data[0];
        setCookie("currentUser", JSON.stringify(updated), 5);
        setCookie("token", updated.token, 5);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Your password has been changed.",
        }).then(() => router.push("/login"));
      });
    } catch (error) {
      console.error("Change password error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.message || "Error on getting information from server!",
      });
    } finally {
      setLoading(false);
    }
  };

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

        {/* Current Password */}
        <div className="relative">
          <label
            htmlFor="currentPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring pr-10"
          />
          <button
            type="button"
            onClick={() => setShowCurrent((v) => !v)}
            className="absolute inset-y-0 right-2 top-6 flex items-center text-gray-600 hover:text-black"
            tabIndex={-1}
          >
            {showCurrent ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <label
            htmlFor="newPassword"
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNew((v) => !v)}
            className="absolute inset-y-0 right-2 top-6 flex items-center text-gray-600 hover:text-black"
            tabIndex={-1}
          >
            {showNew ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
