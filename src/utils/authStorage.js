/**
 * Local storage abstraction for auth credentials.
 * Manages JWT token and user info, and clears obsolete sessions.
 */

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';
const LEGACY_SESSION_KEY = 'userSession';

const isStorageAvailable = () => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

export const getStoredToken = () => {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
};

export const setStoredToken = (token) => {
  if (!isStorageAvailable()) return;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  } catch (err) {
    console.error('Failed to save auth token to localStorage', err);
  }
};

export const removeStoredToken = () => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

export const getStoredUser = () => {
  if (!isStorageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (!isStorageAvailable()) return;
  try {
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_KEY);
    }
  } catch (err) {
    console.error('Failed to save auth user to localStorage', err);
  }
};

export const removeStoredUser = () => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(USER_KEY);
  } catch {}
};

/**
 * Clears all auth storage, including any legacy userSession key.
 */
export const clearAuthStorage = () => {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {}
};
