import { apiFetch } from './client';

/**
 * Fetch all leagues the authenticated user belongs to.
 * Each league includes `myTeam` for the authenticated user.
 *
 * @param {string} token - JWT bearer token
 * @returns {Promise<{ leagues: Array }>}
 */
export async function getMyLeagues(token) {
  return apiFetch('/api/leagues', { method: 'GET', token });
}

/**
 * Fetch a single league by id.
 * Includes `myTeam` for the authenticated user.
 *
 * @param {string} leagueId
 * @param {string} token - JWT bearer token
 * @returns {Promise<{ league: object }>}
 */
export async function getLeagueById(leagueId, token) {
  return apiFetch(`/api/leagues/${leagueId}`, { method: 'GET', token });
}

/**
 * Create a new league.
 * The backend derives the owner from the JWT — never pass ownerId from the client.
 *
 * @param {{ name: string, privacy?: 'PRIVATE' | 'PUBLIC' }} params
 * @param {string} token - JWT bearer token
 * @returns {Promise<{ league: object }>}
 */
export async function createLeague({ name, privacy = 'PRIVATE' }, token) {
  return apiFetch('/api/leagues', {
    method: 'POST',
    token,
    body: { name, privacy },
    // Deliberately NOT including ownerId — the backend derives it from JWT
  });
}
