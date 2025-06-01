// src/utils/helpers.js
import Swal from "sweetalert2";

/**
 * Get query parameter value by name
 */
export function getParameterByName(name, url = typeof window !== 'undefined' ? window.location.href : '') {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Cookie utilities
 */
export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  document.cookie = `${cname}=${cvalue};expires=${d.toUTCString()};path=/`;
}

export function getCookie(cname) {
  if (typeof document === "undefined") {
    // در زمان SSR (سرور) document وجود ندارد
    return "";
  }

  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");

  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length);
    }
  }
  return "";
}

export function deleteCookie(cname) {
  document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Show and hide loading state
 */
export function showLoading() {
  Swal.fire({
    title: 'Please Wait...!',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => Swal.showLoading(),
  }).then(() => { });
  document.querySelectorAll('.action-btn, .action-btn2').forEach(btn => btn && (btn.style.display = 'none'));
  const wait = document.querySelector('.please-wait');
  if (wait) wait.style.display = 'block';
}

export function showButton() {
  document.querySelectorAll('.action-btn, .action-btn2').forEach(btn => btn && (btn.style.display = 'block'));
  const wait = document.querySelector('.please-wait');
  if (wait) wait.style.display = 'none';
}

/**
 * User navigation
 */
export function checkUser() {
  const user = getCookie('currentUser');
  window.location.href = user ? '/panel' : '/login';
}

export function logOutSystem() {
  deleteCookie('currentUser');
  deleteCookie('token');
  window.location.href = '/login';
}
