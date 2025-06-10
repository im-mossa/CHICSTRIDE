"use client";
import React, { useEffect, useState } from "react";
import { cookieUtil } from "../utils/helpers";
import { useInvoiceApi } from "@/app/hooks/useInvoiceApi";
import Button from "@/app/components/ui/Button";

export default function InvoicesSection() {
  const { getInvoicesByUser } = useInvoiceApi();
  const [invoices, setInvoices] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [isLastPage, setIsLastPage] = useState(false);

  const token = cookieUtil.get("token");
  // ابتدا رشتهٔ کوکی را دریافت می‌کنیم
  const rawUser = cookieUtil.get("currentUser");
  // سپس اگر مقداری برگشته، آن را JSON.parse می‌کنیم؛ در غیر این صورت، یک شیء خالی می‌سازیم
  const currentUser = rawUser ? JSON.parse(rawUser) : {};
  const userId = currentUser.customerId; // حالا userId به‌درستی خوانده خواهد شد

  useEffect(() => {
    if (!userId || !token) return;
    loadPage(pageIndex);
  }, [userId, token, pageIndex]);

  const loadPage = async (idx) => {
    // اسکلتون یا حالت لودینگ
    setInvoices([{ status: "…loading", addDate: "", payDate: "" }]);
    await getInvoicesByUser(userId, idx, pageSize, token, (data) => {
      setInvoices(data);
      setIsLastPage(data.length < pageSize);
    });
  };

  return (
    <main className="max-w-5xl mx-auto p-4 my-6">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-white text-left text-black">
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Add Date</th>
              <th className="px-4 py-2">Pay Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr
                key={i}
                className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
              >
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      inv.status === "PAID"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{inv.addDate}</td>
                <td className="px-4 py-2 text-sm">{inv.payDate || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPageIndex((i) => Math.max(0, i - 1))}
          disabled={pageIndex === 0}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
        >
          Previous
        </button>
        <span>Page {pageIndex + 1}</span>
        <button
          onClick={() => !isLastPage && setPageIndex((i) => i + 1)}
          disabled={isLastPage}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
        >
          Next
        </button>
      </div>

      {/* لینک بازگشت به داشبورد */}
      <div className="mt-6 pt-4 text-center">
        <Button href="/panel">Back to Dashboard</Button>
      </div>
    </main>
  );
}
