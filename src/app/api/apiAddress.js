// src/api/apiAddress.js
export const API_BASE_URL = "https://onlineshop.holosen.net/api/";

export function getApiURL(suffix) {
  return `${API_BASE_URL}${suffix}`;
}
