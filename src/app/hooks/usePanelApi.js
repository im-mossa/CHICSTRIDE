// src/hooks/usePanelApi.js
import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

export function usePanelApi() {
    const { getDataWithToken } = useBaseApi();

    const getUserInfo = useCallback(
        (token, onSuccess) => {
            // فراخوانی endpoint مربوط به کاربر جاری
            getDataWithToken("user", token, onSuccess);
        },
        [getDataWithToken]
    );

    return { getUserInfo };
}
