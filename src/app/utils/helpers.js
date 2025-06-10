// src/utils/helpers.js

/**
 * Cookie utilities
 */
export const cookieUtil = (() => {
  const isBrowser = typeof document !== 'undefined';

  const set = (name, value, days = 1, options = {}) => {
    if (!isBrowser) return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    // append additional options like secure, sameSite
    Object.entries(options).forEach(([opt, val]) => {
      cookie += `; ${opt}` + (val === true ? '' : `=${val}`);
    });
    document.cookie = cookie;
  };

  const get = (name) => {
    if (!isBrowser) return '';
    const encodedName = encodeURIComponent(name) + '=';
    return document.cookie.split('; ').reduce((res, cookie) => {
      return cookie.startsWith(encodedName)
        ? decodeURIComponent(cookie.substring(encodedName.length))
        : res;
    }, '');
  };

  const remove = (name) => {
    if (!isBrowser) return;
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  };

  return { set, get, remove };
})();

/**
 * Redirect utilities (client-side)
 */
export const navigationUtil = {
  requireAuth: (router, redirectTo = '/login', panel = '/panel') => {
    const user = cookieUtil.get('currentUser');
    router.push(user ? panel : redirectTo);
  },

  logout: (router, redirectTo = '/login') => {
    cookieUtil.remove('currentUser');
    cookieUtil.remove('token');
    router.push(redirectTo);
  }
};
