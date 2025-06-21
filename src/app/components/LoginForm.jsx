"use client";

import React, { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useUserApi from "../hooks/useUserApi";
import { cookieUtil } from "../utils/helpers";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Button from "./ui/Button";

/** نمایش پیام خطا با SweetAlert */
const showError = (text, title = "Oops...") => {
  return Swal.fire({ icon: "error", title, text });
};

/** نمایش پیام موفقیت */
const showSuccess = (text, title = "Success") => {
  return Swal.fire({ icon: "success", title, text });
};

const LoginForm = () => {
  const router = useRouter();
  const { login } = useUserApi();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password } = credentials;
      if (!username.trim() || !password.trim()) {
        showError("Please fill all fields!");
        return;
      }

      setLoading(true);
      try {
        await login({ username, password }, (data) => {
          const user = data[0];
          // ذخیره‌سازی در کوکی
          cookieUtil.set("currentUser", JSON.stringify(user), 5, {
            secure: true,
            sameSite: "Strict",
          });
          cookieUtil.set("token", user.token, 5, {
            secure: true,
            sameSite: "Strict",
          });

          showSuccess("Welcome!");
          router.push("/panel");
        });
      } catch (error) {
        showError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [credentials, login, router]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Username", name: "username", type: "text" },
          {
            label: "Password",
            name: "password",
            type: showPassword ? "text" : "password",
          },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label
              htmlFor={name}
              className="block text-sm font-medium text-gray-700"
            >
              {label}
            </label>
            <div className={name === "password" ? "relative" : ""}>
              <input
                id={name}
                name={name}
                type={type}
                value={credentials[name]}
                onChange={handleChange}
                className="mt-1 block w-full px-9 py-2 border rounded-md focus:outline-none focus:ring"
                required
              />
              {name === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-black"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </Button>
          <Button href="../signUp" disabled={loading}>
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
};

export default memo(LoginForm);
