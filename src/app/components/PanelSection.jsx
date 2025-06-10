"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePanelApi } from "../hooks/usePanelApi";
import { cookieUtil, navigationUtil } from "../utils/helpers";
import Button from "./ui/Button";
import Skeleton from "react-loading-skeleton";

export default function PanelSection() {
  const router = useRouter();
  const { getUserInfo } = usePanelApi();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUserJson = cookieUtil.get("currentUser");

    // اگر کوکی currentUser موجود نبود، کاربر باید به لاگین ریدایرکت شود
    if (!currentUserJson) {
      navigationUtil.logout(router); // کوکی‌ها را هم پاک می‌کند
      return;
    }

    try {
      const currentUser = JSON.parse(currentUserJson);

      if (currentUser?.token) {
        getUserInfo(currentUser.token, (data) => {
          setUser(data[0]?.customer ?? null);
        });
      } else {
        navigationUtil.logout(router);
      }
    } catch (error) {
      // اگر parsing کوکی شکست خورد، logout کنیم
      navigationUtil.logout(router);
    }
  }, [getUserInfo, router]);

  if (!user) {
    return (
      <div className="px-4 py-6">
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col p-4 bg-white rounded-lg shadow"
            >
              <Skeleton height={16} width={100} className="mb-2" />
              <Skeleton height={24} width="80%" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={50} width={150} />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Phone", value: user.phone },
    { label: "Postal Code", value: user.postalCode },
    { label: "Address", value: user.address },
  ];

  return (
    <div className="px-4 py-6">
      {/* کارت‌های اطلاعات کاربر */}
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <p className="mb-2 text-sm font-medium text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* دکمه‌ها */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button href="/editProfile">Edit Profile</Button>
        <Button href="/invoices">View My Invoices</Button>
        <Button href="/changePassword">Change Password</Button>
        <Button onClick={() => navigationUtil.logout(router)}>Log Out</Button>
      </div>
    </div>
  );
}
