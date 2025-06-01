// src/hooks/useBaseApi.js
import { useCallback } from "react";
import Swal from "sweetalert2";
import { getApiURL } from "../api/apiAddress";
import { showButton, deleteCookie } from "../utils/helpers";

/**
 * Custom hook providing HTTP methods for API interactions
 */
export function useBaseApi() {
  const onError = useCallback(() => {
    Swal.fire({ icon: "error", title: "Oops...", text: "Error on getting information from server!" });
  }, []);

  const onError2 = useCallback((message) => {
    Swal.fire({ icon: "error", title: "Oops...", text: message });
  }, []);

  const onSuccess = useCallback(
    async (response, callback) => {
      const json = await response.json();
      switch (json.status) {
        case "OK":
          callback(json.data);
          break;
        case "NOT_FOUND":
          onError2(json.message);
          break;
        default:
          onError();
      }
    },
    [onError, onError2]
  );

  const getData = useCallback(
    async (suffix, callback) => {
      const url = getApiURL(suffix);
      try {
        const response = await fetch(url);
        if (response.ok) onSuccess(response, callback);
        else onError();
      } catch {
        onError();
      }
    },
    [onSuccess, onError]
  );

  const postData = useCallback(
    async (suffix, data, callback) => {
      const url = getApiURL(suffix);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (response.ok) onSuccess(response, callback);
        else onError();
      } catch {
        onError();
      }
      showButton();
    },
    [onSuccess, onError]
  );

  const putDataWithToken = useCallback(
    async (suffix, data, token, callback) => {
      const url = getApiURL(suffix);
      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        if (response.ok) onSuccess(response, callback);
        else onError();
      } catch {
        onError();
      }
      showButton();
    },
    [onSuccess, onError]
  );

  const putDataWithToken2 = useCallback(
    (suffix, data, token, callback) => {
      const url = getApiURL(suffix);
      const req = new XMLHttpRequest();
      req.open("PUT", url, true);
      req.setRequestHeader("Authorization", `Bearer ${token}`);
      req.setRequestHeader("Content-Type", "application/json");
      req.onreadystatechange = () => {
        if (req.readyState === 4 && req.status === 200) {
          const json = JSON.parse(req.responseText);
          callback(json.data);
        }
      };
      req.send(JSON.stringify(data));
    },
    []
  );

  const postDataWithToken = useCallback(
    async (suffix, data, token, callback) => {
      const url = getApiURL(suffix);
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        if (response.ok) onSuccess(response, callback);
        else onError();
      } catch {
        onError();
      }
      showButton();
    },
    [onSuccess, onError]
  );

  const getDataWithToken = useCallback(
    async (suffix, token, callback) => {
      const url = getApiURL(suffix);
      try {
        const response = await fetch(url, { method: "GET", headers: { Authorization: `Bearer ${token}` } });
        if (response.ok) onSuccess(response, callback);
        else {
          onError();
          deleteCookie("token");
          deleteCookie("currentUser");
        }
      } catch {
        onError();
        deleteCookie("token");
        deleteCookie("currentUser");
      }
    },
    [onSuccess, onError]
  );

  return { getData, postData, putDataWithToken, putDataWithToken2, postDataWithToken, getDataWithToken };
}
