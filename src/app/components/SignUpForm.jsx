"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUserApi from "../hooks/useUserApi";
import { cookieUtil } from "../utils/helpers";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // 👈 آیکون‌ها
import Button from "./ui/Button";

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useUserApi();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    postalCode: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key]) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill all fields!",
        });
        return;
      }
    }
    setLoading(true);
    try {
      await signUp(formData, (data) => {
        const user = data[0];
        cookieUtil.set("currentUser", JSON.stringify(user), 5, { secure: true, sameSite: "Strict" });
        cookieUtil.set("token", user.token, 5, { secure: true, sameSite: "Strict" });
        Swal.fire({ icon: "success", title: "Welcome!" });
        router.push("/login");
      });
    } catch {
      // errors handled by useBaseApi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "First Name", name: "firstName", type: "text" },
          { label: "Last Name", name: "lastName", type: "text" },
          { label: "Username", name: "username", type: "text" },
          { label: "Password", name: "password", type: "password" },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "Postal Code", name: "postalCode", type: "text" },
          { label: "Address", name: "address", type: "text" },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700"
            >
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
            {loading ? "Please wait..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </div>
  );
}
