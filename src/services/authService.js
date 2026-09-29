import { loginUser, registerUser, getMe } from '../api/auth';
import {
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  clearAuthStorage,
} from '../utils/authStorage';

/**
 * Frontend Authentication Service.
 * Coordinates auth API calls with local storage synchronization.
 */
export const authService = {
  /**
   * Logs in a user with email and password.
   * On success: stores JWT and user locally and returns them.
   *
   * @param {object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<{ user: object, token: string }>}
   */
  async login({ email, password }) {
    const result = await loginUser({ email, password });
    setStoredToken(result.token);
    setStoredUser(result.user);
    return result;
  },

  /**
   * Registers a new user.
   * On success: stores JWT and user locally and returns them.
   *
   * @param {object} data
   * @param {string} data.name
   * @param {string} data.email
   * @param {string} data.password
   * @returns {Promise<{ user: object, token: string }>}
   */
  async register({ name, email, password }) {
    const result = await registerUser({ name, email, password });
    setStoredToken(result.token);
    setStoredUser(result.user);
    return result;
  },

  /**
   * Restores an existing session on application start.
   * Checks for a stored token, verifies it against GET /api/auth/me.
   * If valid: returns { user, token }.
   * If invalid/expired: clears stored session and returns null.
   *
   * @returns {Promise<{ user: object, token: string } | null>}
   */
  async restoreSession() {
    const token = getStoredToken();
    if (!token) {
      return null;
    }

    try {
      const response = await getMe(token);
      if (response?.user) {
        setStoredUser(response.user);
        return { user: response.user, token };
      }
      clearAuthStorage();
      return null;
    } catch (err) {
      // Clear invalid or expired session
      clearAuthStorage();
      return null;
    }
  },

  /**
   * Logs out the current user.
   * Clears JWT, user data, and obsolete session keys from local storage.
   */
  logout() {
    clearAuthStorage();
  },

  /**
   * Returns currently stored user if any.
   */
  getCurrentUser() {
    return getStoredUser();
  },

  /**
   * Returns currently stored JWT token if any.
   */
  getCurrentToken() {
    return getStoredToken();
  },

  /**
   * Checks whether a stored token currently exists.
   */
  hasStoredSession() {
    return Boolean(getStoredToken());
  },
};
