// src/hooks/useInvoiceApi.js
import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

/**
 * هوک برای عملیات مرتبط با تراکنش‌ها (پرداخت)
 * فراخوانی فاکتورها برای پرداخت کاربر
 * @returns {{ getInvoicesByUser: (userId: number, pageIndex?: number, pageSize?: number, token: string) => Promise<any[]> }}
 */
export default function useInvoiceApi() {
    const { getDataWithToken } = useBaseApi();

    const getInvoicesByUser = useCallback(
        (userId, pageIndex = 0, pageSize = 10, token) =>
            new Promise((resolve, reject) => {
                if (!userId || !token) {
                    return resolve([]);
                }
                // ساخت URL بر اساس پارامترها
                const url = `/invoice/user/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
                getDataWithToken(
                    url,
                    token,
                    (resp) => {
                        resolve(Array.isArray(resp) ? resp : resp.data || []);
                    },
                    (err) => {
                        console.error("[useInvoiceApi] getDataWithToken error:", err);
                        reject(err);
                    }
                );
            }),
        [getDataWithToken]
    );

    return { getInvoicesByUser };
}
