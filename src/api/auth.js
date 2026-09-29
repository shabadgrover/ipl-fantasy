import { apiFetch } from './client';

/**
 * Sends login request with email and password.
 * Backend responds with { user, token }.
 *
 * @param {object} credentials
 * @param {string} credentials.email
 * @param {string} credentials.password
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function loginUser({ email, password }) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

/**
 * Sends registration request with name, email, and password.
 * Backend responds with status 201 and { user, token }.
 *
 * @param {object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} params.password
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function registerUser({ name, email, password }) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

/**
 * Fetches current authenticated user info using Bearer token.
 * Backend responds with { user }.
 *
 * @param {string} token - JWT bearer token
 * @returns {Promise<{ user: object }>}
 */
export async function getMe(token) {
  return apiFetch('/api/auth/me', {
    method: 'GET',
    token,
  });
}
