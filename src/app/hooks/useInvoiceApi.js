import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

export function useInvoiceApi() {
    const { getDataWithToken } = useBaseApi();

    const getInvoicesByUser = useCallback(
        (userId, pageIndex, pageSize, token, onSuccess) => {
            const suffix = `invoice/user/${userId}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
            getDataWithToken(suffix, token, onSuccess);
        },
        [getDataWithToken]
    );

    return { getInvoicesByUser };
}
