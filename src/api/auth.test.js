import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { loginUser, registerUser, getMe } from './auth';
import { ApiError, API_BASE_URL } from './client';

describe('auth API', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe('loginUser', () => {
    it('sends POST /api/auth/login with credentials and returns user and token', async () => {
      const mockResponse = {
        user: { id: 'usr-123', name: 'Shabad', email: 'shabad@example.com' },
        token: 'mock-jwt-token-123',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const result = await loginUser({ email: 'shabad@example.com', password: 'password123' });

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/auth/login`);
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(options.body)).toEqual({
        email: 'shabad@example.com',
        password: 'password123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError with backend message on invalid credentials (401)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          error: 'Unauthorized',
          message: 'Invalid email or password',
        }),
      });

      await expect(
        loginUser({ email: 'wrong@example.com', password: 'badpassword' })
      ).rejects.toThrow('Invalid email or password');
    });

    it('throws ApiError when backend returns 400 validation error', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          error: 'Bad Request',
          message: 'Email and password are required',
        }),
      });

      await expect(
        loginUser({ email: '', password: '' })
      ).rejects.toThrow('Email and password are required');
    });
  });

  describe('registerUser', () => {
    it('sends POST /api/auth/register with user info and returns 201 response', async () => {
      const mockResponse = {
        user: { id: 'usr-456', name: 'Virat Kohli', email: 'virat@example.com' },
        token: 'new-jwt-token-456',
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const result = await registerUser({
        name: 'Virat Kohli',
        email: 'virat@example.com',
        password: 'securepassword123',
      });

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/auth/register`);
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({
        name: 'Virat Kohli',
        email: 'virat@example.com',
        password: 'securepassword123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError with duplicate email message on 409 conflict', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          error: 'Conflict',
          message: 'An account with this email already exists',
        }),
      });

      await expect(
        registerUser({
          name: 'Existing User',
          email: 'exists@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('An account with this email already exists');
    });

    it('throws ApiError with password length error on 400', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          error: 'Bad Request',
          message: 'Password must be at least 8 characters',
        }),
      });

      await expect(
        registerUser({
          name: 'User',
          email: 'user@example.com',
          password: '123',
        })
      ).rejects.toThrow('Password must be at least 8 characters');
    });
  });

  describe('getMe (Session Restoration)', () => {
    it('sends GET /api/auth/me with Authorization Bearer header', async () => {
      const mockResponse = {
        user: { id: 'usr-123', name: 'Shabad', email: 'shabad@example.com' },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockResponse,
      });

      const result = await getMe('saved-token-abc');

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/auth/me`);
      expect(options.method).toBe('GET');
      expect(options.headers['Authorization']).toBe('Bearer saved-token-abc');
      expect(result).toEqual(mockResponse);
    });

    it('throws ApiError on invalid or expired token (401)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          error: 'Unauthorized',
          message: 'Invalid or expired token',
        }),
      });

      await expect(getMe('expired-token')).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('Network / Backend Unavailable Handling', () => {
    it('catches network fetch failure and provides user-friendly error', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(
        loginUser({ email: 'test@example.com', password: 'password123' })
      ).rejects.toThrow(
        'Unable to connect to authentication server. Please ensure the backend is running.'
      );
    });
  });
});
