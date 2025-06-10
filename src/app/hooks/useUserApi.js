// app/hooks/useUserApi.js
import { useCallback } from "react";
import { useBaseApi } from "../api/baseApi";

const ENDPOINTS = {
    LOGIN: "user/login",
    REGISTER: "user/register",
    CHANGE_PASSWORD: "user/changePassword",
    UPDATE_PROFILE: "user/update",
};

export default function useUserApi() {
    const { postData, putDataWithToken } = useBaseApi();

    const login = useCallback(
        (userData, onSuccess) => postData(ENDPOINTS.LOGIN, userData, onSuccess),
        [postData]
    );

    const signUp = useCallback(
        (userData, onSuccess) => postData(ENDPOINTS.REGISTER, userData, onSuccess),
        [postData]
    );

    const changePassword = useCallback(
        (data, token, onSuccess) =>
            putDataWithToken(ENDPOINTS.CHANGE_PASSWORD, data, token, onSuccess),
        [putDataWithToken]
    );

    const editProfile = useCallback(
        (data, token, onSuccess) =>
            putDataWithToken(ENDPOINTS.UPDATE_PROFILE, data, token, onSuccess),
        [putDataWithToken]
    );

    return { login, signUp, changePassword, editProfile };
}
