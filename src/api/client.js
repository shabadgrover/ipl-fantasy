/**
 * API client configuration and fetch wrapper.
 * Provides centralized base URL configuration and error handling.
 */

export const API_BASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  'http://localhost:3001';

/**
 * Custom error class for API errors.
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Standardized fetch wrapper that:
 * - Prepends the API base URL to relative endpoints
 * - Automatically stringifies JSON bodies and sets Content-Type
 * - Appends Authorization: Bearer <token> if token option is supplied
 * - Handles non-2xx responses by extracting clean backend error messages
 * - Gracefully handles connection failures / network errors
 *
 * @param {string} endpoint - API path (e.g. '/api/auth/login') or absolute URL
 * @param {object} options - Fetch options including body, headers, token, etc.
 * @returns {Promise<any>} Parsed response data
 */
export async function apiFetch(endpoint, options = {}) {
  const { token, body, headers = {}, ...restOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const requestHeaders = {
    ...headers,
  };

  let serializedBody = body;
  if (body !== undefined && body !== null && typeof body === 'object' && !(body instanceof FormData)) {
    requestHeaders['Content-Type'] = 'application/json';
    serializedBody = JSON.stringify(body);
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      body: serializedBody,
    });
  } catch (err) {
    throw new ApiError(
      'Unable to connect to authentication server. Please ensure the backend is running.',
      0,
      { originalError: err?.message }
    );
  }

  let data = null;
  const contentType = response.headers?.get?.('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}
