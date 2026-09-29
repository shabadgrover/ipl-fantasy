import { describe, it, expect, beforeEach } from 'vitest';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
  removeStoredUser,
  clearAuthStorage,
} from './authStorage';

describe('authStorage', () => {
  let store = {};

  beforeEach(() => {
    store = {};
    // Mock window and localStorage
    globalThis.window = {
      localStorage: {
        getItem: (key) => store[key] || null,
        setItem: (key, val) => {
          store[key] = String(val);
        },
        removeItem: (key) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
      },
    };
  });

  describe('token storage', () => {
    it('returns null when no token is stored', () => {
      expect(getStoredToken()).toBeNull();
    });

    it('stores and retrieves JWT token', () => {
      setStoredToken('test-jwt-token');
      expect(getStoredToken()).toBe('test-jwt-token');
    });

    it('removes token when null is passed to setStoredToken', () => {
      setStoredToken('test-jwt-token');
      setStoredToken(null);
      expect(getStoredToken()).toBeNull();
    });

    it('removes token with removeStoredToken', () => {
      setStoredToken('test-jwt-token');
      removeStoredToken();
      expect(getStoredToken()).toBeNull();
    });
  });

  describe('user storage', () => {
    it('returns null when no user is stored', () => {
      expect(getStoredUser()).toBeNull();
    });

    it('stores and retrieves parsed user object', () => {
      const user = { id: 'usr-1', name: 'Virat Kohli', email: 'virat@example.com' };
      setStoredUser(user);
      expect(getStoredUser()).toEqual(user);
    });

    it('returns null if stored user JSON is corrupted', () => {
      store.authUser = 'invalid-json';
      expect(getStoredUser()).toBeNull();
    });

    it('removes user with removeStoredUser', () => {
      setStoredUser({ id: 'usr-1', name: 'Virat' });
      removeStoredUser();
      expect(getStoredUser()).toBeNull();
    });
  });

  describe('clearAuthStorage', () => {
    it('clears token, user, and legacy userSession', () => {
      setStoredToken('active-token');
      setStoredUser({ id: 'usr-1', name: 'Virat' });
      store.userSession = JSON.stringify({ role: 'player', team: "shabad's Team" });

      clearAuthStorage();

      expect(getStoredToken()).toBeNull();
      expect(getStoredUser()).toBeNull();
      expect(store.userSession).toBeUndefined();
    });
  });
});
