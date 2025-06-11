// src/api/apiAddress.js

export const API_BASE_URL = "https://onlineshop.holosen.net/api/";

/**
 * Build a full API URL by appending the given suffix to the base URL.
 * Uses the URL constructor to avoid duplicate slashes.
 *
 * @param {string} suffix - Path or query string to append (e.g., "products" or "/products?id=1").
 * @returns {string} Full API endpoint URL.
 */
export function getApiURL(suffix = "") {
  try {
    // new URL handles leading/trailing slashes for us
    return new URL(suffix, API_BASE_URL).toString();
  } catch (e) {
    // Fallback to simple concatenation if URL parsing fails
    const base = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    const path = suffix.startsWith("/") ? suffix.slice(1) : suffix;
    return `${base}${path}`;
  }
}