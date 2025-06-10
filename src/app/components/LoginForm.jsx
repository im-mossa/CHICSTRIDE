"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUserApi from "../hooks/useUserApi";
import { cookieUtil } from "../utils/helpers";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 👈 آیکون‌ها
import Button from "./ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useUserApi();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill all fields!",
      });
      return;
    }
    setLoading(true);
    try {
      await login({ username, password }, (data) => {
        const user = data[0];
        cookieUtil.set("currentUser", JSON.stringify(user), 5, { secure: true, sameSite: "Strict" });
        cookieUtil.set("token", user.token, 5, { secure: true, sameSite: "Strict" });
        Swal.fire({ icon: "success", title: "Welcome!" });
        router.push("/panel");
      });
    } catch {
      // errors handled by useBaseApi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-black"
              tabIndex={-1}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading" : "Login"}
          </Button>
          <Button href="../signUp">Sign up</Button>
        </div>
      </form>
    </div>
  );
}