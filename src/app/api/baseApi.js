// app/api/baseApi.js
import { useCallback } from "react";
import Swal from "sweetalert2";
import { getApiURL } from "../api/apiAddress";
import { cookieUtil } from "../utils/helpers";

/**
 * Custom hook providing HTTP methods for API interactions
 */
export function useBaseApi() {
  const notifyError = useCallback((message = "Error on communicating with server!") => {
    Swal.fire({ icon: "error", title: "Oops...", text: message });
  }, []);

  // Clear authentication cookies
  const clearAuth = useCallback(() => {
    cookieUtil.remove('token');
    cookieUtil.remove('currentUser');
  }, []);

  // Notify error and clear auth
  const handleAuthError = useCallback((message = "Authentication failed. Please login again.") => {
    notifyError(message);
    clearAuth();
  }, [notifyError, clearAuth]);

  const handleResponse = useCallback(
    async (response, callback) => {
      const json = await response.json();
      if (response.ok && json.status === "OK") {
        callback(json.data);
      } else if (json.status === "NOT_FOUND") {
        notifyError(json.message);
      } else {
        notifyError();
      }
    },
    [notifyError]
  );

  const request = useCallback(
    async ({ method = 'GET', suffix, data, token, callback, onFailure }) => {
      const url = getApiURL(suffix);
      const headers = { Accept: "application/json" };
      if (data) headers['Content-Type'] = "application/json";
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const response = await fetch(url, { method, headers, body: data ? JSON.stringify(data) : undefined });
        if (response.ok) {
          await handleResponse(response, callback);
        } else if (onFailure) {
          onFailure();
        } else {
          notifyError();
        }
      } catch {
        if (onFailure) onFailure();
        else notifyError();
      }
    },
    [handleResponse, notifyError]
  );

  const getData = useCallback((suffix, callback) => {
    return request({ suffix, callback });
  }, [request]);

  const postData = useCallback((suffix, data, callback) => {
    return request({ method: 'POST', suffix, data, callback });
  }, [request]);

  const putDataWithToken = useCallback((suffix, data, token, callback) => {
    return request({ method: 'PUT', suffix, data, token, callback });
  }, [request]);

  const postDataWithToken = useCallback((suffix, data, token, callback) => {
    return request({ method: 'POST', suffix, data, token, callback });
  }, [request]);

  // GET with token: clear auth cookies on error via handleAuthError
  const getDataWithToken = useCallback((suffix, token, callback) => {
    return request({
      method: 'GET',
      suffix,
      token,
      callback,
      onFailure: () => handleAuthError(),
    });
  }, [request, handleAuthError]);

  return { getData, postData, putDataWithToken, postDataWithToken, getDataWithToken };
}