// src/hooks/useUserApi.js
import { useCallback } from "react";
import Swal from "sweetalert2";
import { useBaseApi } from "../api/baseApi";

/**
 * هوک برای عملیات کاربر: ورود، ثبت‌نام، تغییر رمز عبور و ویرایش پروفایل
 */
export default function useUserApi() {
    const { postData } = useBaseApi(); // فرض بر این است که useBaseApi همچنان ارائه می‌دهد

    const login = useCallback(
        (userData, onSuccess) => postData("user/login", userData, onSuccess),
        [postData]
    );

    const signUp = useCallback(
        (userData, onSuccess) => postData("user/register", userData, onSuccess),
        [postData]
    );

    const changePassword = useCallback(
        async (data, token, onSuccess) => {
            try {
                const res = await fetch("/api/user/changePassword", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });
                const json = await res.json();
                if (res.ok && json.status === "OK") {
                    onSuccess(json.data);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: json.message || `HTTP ${res.status}`,
                    });
                }
            } catch (err) {
                console.error("changePassword error:", err);
                Swal.fire({ icon: "error", title: "Network Error", text: err.message });
            }
        },
        []
    );

    const editProfile = useCallback(
        async (data, token, onSuccess) => {
            try {
                const res = await fetch("/api/user/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                });
                const json = await res.json();
                if (res.ok && json.status === "OK") {
                    onSuccess(json.data);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: json.message || `HTTP ${res.status}`,
                    });
                }
            } catch (err) {
                console.error("editProfile error:", err);
                Swal.fire({ icon: "error", title: "Network Error", text: err.message });
            }
        },
        []
    );

    return { login, signUp, changePassword, editProfile };
}
