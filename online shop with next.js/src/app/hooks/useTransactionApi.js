// src/hooks/useTransactionApi.js
import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

/**
 * هوک برای عملیات مرتبط با تراکنش‌ها (پرداخت)
 */
export default function useTransactionApi() {
    const { postDataWithToken } = useBaseApi();

    /**
     * هدایت کاربر به صفحه پرداخت
     * @param {object} data — شامل user و items
     * @param {string} token — توکن احراز هویت
     * @returns {Promise<any[]>} — فرض بر این است که سرور آدرس پرداخت را در یک آرایه برمی‌گرداند
     */
    const goToPayment = useCallback(
        (data, token) =>
            new Promise((resolve, reject) => {
                postDataWithToken(
                    "trx/gotoPayment",
                    data,
                    token,
                    (resp) => resolve(resp),
                    (err) => reject(err)
                );
            }),
        [postDataWithToken]
    );

    return { goToPayment };
}
