import { useCallback } from "react";
import Swal from "sweetalert2";

/**
 * هوک برای فراخوانی فاکتورها با fetch مستقیم در کلاینت
 * مسیر دقیق API: https://onlineshop.holosen.net/api/invoice/user/{userId}
 */
export function useInvoiceApi() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://onlineshop.holosen.net/api";

    const getInvoicesByUser = useCallback(
        async (userId, pageIndex = 0, pageSize = 10, token) => {
            if (!userId || !token) {
                Swal.fire({ icon: "error", title: "Oops...", text: "[useInvoiceApi] Missing userId or token" });
                return [];
            }

            const url = `${baseUrl}/invoice/user/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
            console.log("[useInvoiceApi] fetching URL:", url);

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            let payload;
            try {
                payload = await res.json();
            } catch {
                throw Swal.fire({ icon: "error", title: "Oops...", text: `Invalid JSON response. HTTP ${res.status}` });
            }

            if (!res.ok) {
                const message = payload?.message || payload?.error || res.statusText || `HTTP ${res.status}`;
                throw Swal.fire({ icon: "error", title: "Oops...", text: `${message}` });
            }

            const invoices = Array.isArray(payload.data) ? payload.data : [];
            Swal.fire({ icon: "error", title: "Oops...", text: `${invoices}` });
            return invoices;
        },
        [baseUrl]
    );

    return { getInvoicesByUser };
}
