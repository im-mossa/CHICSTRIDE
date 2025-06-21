"use client";

import React, { memo, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePanelApi } from "../hooks/usePanelApi";
import { cookieUtil, navigationUtil } from "../utils/helpers";
import Button from "./ui/Button";
import Skeleton from "react-loading-skeleton";

// تنظیمات اسکلتون
const SKELETON_COUNT_USER = 5;
const SKELETON_COUNT_BUTTONS = 4;

const PanelSection = () => {
  const router = useRouter();
  const { getUserInfo } = usePanelApi();
  const [user, setUser] = useState(null);

  const fetchUser = useCallback(() => {
    const currentUserJson = cookieUtil.get("currentUser");
    if (!currentUserJson) {
      navigationUtil.logout(router);
      return;
    }

    try {
      const { token } = JSON.parse(currentUserJson) || {};
      if (token) {
        getUserInfo(token, (data) => setUser(data[0]?.customer ?? null));
      } else {
        navigationUtil.logout(router);
      }
    } catch {
      navigationUtil.logout(router);
    }
  }, [getUserInfo, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // نمایش اسکلتون تا زمانی که کاربر لود نشده
  if (!user) {
    return (
      <div className="px-4 py-6">
        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: SKELETON_COUNT_USER }).map((_, i) => (
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
          {Array.from({ length: SKELETON_COUNT_BUTTONS }).map((_, i) => (
            <Skeleton key={i} height={50} width={150} />
          ))}
        </div>
      </div>
    );
  }

  // کارت‌های اطلاعات کاربر
  const infoCards = [
    { label: "First Name", value: user.firstName },
    { label: "Last Name", value: user.lastName },
    { label: "Phone", value: user.phone },
    { label: "Postal Code", value: user.postalCode },
    { label: "Address", value: user.address },
  ];

  return (
    <div className="px-4 py-6">
      <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {infoCards.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <p className="mb-2 text-sm font-medium text-gray-600">{label}</p>
            <p className="text-lg font-semibold text-gray-800">{value}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button href="/editProfile">Edit Profile</Button>
        <Button href="/invoices">View My Invoices</Button>
        <Button href="/changePassword">Change Password</Button>
        <Button onClick={() => navigationUtil.logout(router)}>Log Out</Button>
      </div>
    </div>
  );
};

export default memo(PanelSection);
