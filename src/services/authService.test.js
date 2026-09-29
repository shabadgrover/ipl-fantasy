import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from './authService';
import * as authApi from '../api/auth';
import * as authStorage from '../utils/authStorage';

describe('authService', () => {
  let mockStore = {};

  beforeEach(() => {
    vi.restoreAllMocks();
    mockStore = {};

    globalThis.window = {
      localStorage: {
        getItem: (k) => mockStore[k] || null,
        setItem: (k, v) => {
          mockStore[k] = String(v);
        },
        removeItem: (k) => {
          delete mockStore[k];
        },
        clear: () => {
          mockStore = {};
        },
      },
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Login', () => {
    it('successful login stores token and user in storage and returns them', async () => {
      const mockResult = {
        user: { id: 'usr-1', name: 'Shabad', email: 'shabad@example.com' },
        token: 'valid-jwt-token-123',
      };

      vi.spyOn(authApi, 'loginUser').mockResolvedValue(mockResult);

      const result = await authService.login({
        email: 'shabad@example.com',
        password: 'password123',
      });

      expect(authApi.loginUser).toHaveBeenCalledWith({
        email: 'shabad@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResult);

      // Verify stored locally
      expect(authStorage.getStoredToken()).toBe('valid-jwt-token-123');
      expect(authStorage.getStoredUser()).toEqual(mockResult.user);
    });

    it('invalid credentials reject with an error and do not store tokens', async () => {
      vi.spyOn(authApi, 'loginUser').mockRejectedValue(new Error('Invalid email or password'));

      await expect(
        authService.login({ email: 'wrong@example.com', password: 'bad' })
      ).rejects.toThrow('Invalid email or password');

      expect(authStorage.getStoredToken()).toBeNull();
      expect(authStorage.getStoredUser()).toBeNull();
    });
  });

  describe('Registration', () => {
    it('successful registration stores token and user in storage and returns them', async () => {
      const mockResult = {
        user: { id: 'usr-2', name: 'Virat Kohli', email: 'virat@example.com' },
        token: 'new-reg-token-456',
      };

      vi.spyOn(authApi, 'registerUser').mockResolvedValue(mockResult);

      const result = await authService.register({
        name: 'Virat Kohli',
        email: 'virat@example.com',
        password: 'password123',
      });

      expect(authApi.registerUser).toHaveBeenCalledWith({
        name: 'Virat Kohli',
        email: 'virat@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResult);
      expect(authStorage.getStoredToken()).toBe('new-reg-token-456');
      expect(authStorage.getStoredUser()).toEqual(mockResult.user);
    });

    it('handles duplicate email / conflict error and does not store token', async () => {
      vi.spyOn(authApi, 'registerUser').mockRejectedValue(
        new Error('An account with this email already exists')
      );

      await expect(
        authService.register({
          name: 'Shabad',
          email: 'shabad@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('An account with this email already exists');

      expect(authStorage.getStoredToken()).toBeNull();
      expect(authStorage.getStoredUser()).toBeNull();
    });

    it('handles validation error and does not store token', async () => {
      vi.spyOn(authApi, 'registerUser').mockRejectedValue(
        new Error('Password must be at least 8 characters')
      );

      await expect(
        authService.register({
          name: 'Shabad',
          email: 'shabad@example.com',
          password: 'short',
        })
      ).rejects.toThrow('Password must be at least 8 characters');

      expect(authStorage.getStoredToken()).toBeNull();
      expect(authStorage.getStoredUser()).toBeNull();
    });
  });

  describe('Session Restoration', () => {
    it('returns null when no token is in storage', async () => {
      const getMeSpy = vi.spyOn(authApi, 'getMe');

      const session = await authService.restoreSession();

      expect(session).toBeNull();
      expect(getMeSpy).not.toHaveBeenCalled();
    });

    it('valid stored token calls /auth/me and restores session', async () => {
      authStorage.setStoredToken('active-token-789');

      const mockUser = { id: 'usr-1', name: 'Shabad', email: 'shabad@example.com' };
      vi.spyOn(authApi, 'getMe').mockResolvedValue({ user: mockUser });

      const session = await authService.restoreSession();

      expect(authApi.getMe).toHaveBeenCalledWith('active-token-789');
      expect(session).toEqual({
        user: mockUser,
        token: 'active-token-789',
      });
      expect(authStorage.getStoredUser()).toEqual(mockUser);
    });

    it('invalid or expired token clears stored auth state and returns null', async () => {
      authStorage.setStoredToken('expired-or-tampered-token');
      authStorage.setStoredUser({ id: 'usr-old', name: 'Old' });

      vi.spyOn(authApi, 'getMe').mockRejectedValue(new Error('Invalid or expired token'));

      const session = await authService.restoreSession();

      expect(session).toBeNull();
      expect(authStorage.getStoredToken()).toBeNull();
      expect(authStorage.getStoredUser()).toBeNull();
    });

    it('clears stored auth state if getMe returns no user', async () => {
      authStorage.setStoredToken('token-no-user');

      vi.spyOn(authApi, 'getMe').mockResolvedValue({ user: null });

      const session = await authService.restoreSession();

      expect(session).toBeNull();
      expect(authStorage.getStoredToken()).toBeNull();
    });
  });

  describe('Logout', () => {
    it('clears token, user, and legacy session from storage', () => {
      authStorage.setStoredToken('active-token');
      authStorage.setStoredUser({ id: 'usr-1', name: 'Shabad' });
      mockStore.userSession = JSON.stringify({ role: 'player' });

      authService.logout();

      expect(authStorage.getStoredToken()).toBeNull();
      expect(authStorage.getStoredUser()).toBeNull();
      expect(mockStore.userSession).toBeUndefined();
      expect(authService.hasStoredSession()).toBe(false);
    });
  });
});
