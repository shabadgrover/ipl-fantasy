import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getMyLeagues, getLeagueById, createLeague } from './leagues';
import { ApiError, API_BASE_URL } from './client';

describe('leagues API', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  // ── getMyLeagues ───────────────────────────────────────────────────────────

  describe('getMyLeagues', () => {
    it('sends GET /api/leagues with Bearer token', async () => {
      const mockLeagues = [
        {
          id: 'league-1',
          name: 'Test League',
          privacy: 'PRIVATE',
          status: 'ACTIVE',
          _count: { members: 1 },
          owner: { id: 'user-1', name: 'Shabad' },
          myTeam: { id: 'team-1', name: "Shabad's Team" },
        },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ leagues: mockLeagues }),
      });

      const result = await getMyLeagues('mock-token');

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/leagues`);
      expect(options.method).toBe('GET');
      expect(options.headers['Authorization']).toBe('Bearer mock-token');
      expect(result.leagues).toEqual(mockLeagues);
    });

    it('returns empty leagues array for user with no leagues', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ leagues: [] }),
      });

      const result = await getMyLeagues('mock-token');
      expect(result.leagues).toEqual([]);
    });

    it('throws ApiError when unauthenticated (401)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'Authentication required' }),
      });

      await expect(getMyLeagues('bad-token')).rejects.toThrow('Authentication required');
    });
  });

  // ── createLeague ───────────────────────────────────────────────────────────

  describe('createLeague', () => {
    it('sends POST /api/leagues with name and privacy, no ownerId', async () => {
      const mockLeague = {
        id: 'league-new',
        name: 'My New League',
        privacy: 'PRIVATE',
        status: 'ACTIVE',
        ownerId: 'user-1',
        myTeam: { id: 'team-new', name: "Shabad's Team" },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ league: mockLeague }),
      });

      const result = await createLeague({ name: 'My New League', privacy: 'PRIVATE' }, 'mock-token');

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/leagues`);
      expect(options.method).toBe('POST');
      expect(options.headers['Authorization']).toBe('Bearer mock-token');

      const body = JSON.parse(options.body);
      // Must contain name and privacy
      expect(body.name).toBe('My New League');
      expect(body.privacy).toBe('PRIVATE');
      // Must NOT contain ownerId
      expect(body.ownerId).toBeUndefined();

      expect(result.league).toEqual(mockLeague);
    });

    it('returns myTeam in the created league response', async () => {
      const mockLeague = {
        id: 'league-2',
        name: 'Another League',
        privacy: 'PRIVATE',
        status: 'ACTIVE',
        myTeam: { id: 'team-2', name: "Sumit's Team" },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ league: mockLeague }),
      });

      const result = await createLeague({ name: 'Another League' }, 'mock-token');
      expect(result.league.myTeam).toBeDefined();
      expect(result.league.myTeam.name).toBe("Sumit's Team");
    });

    it('throws ApiError when league name is invalid (400)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'League name is required' }),
      });

      await expect(createLeague({ name: '' }, 'mock-token')).rejects.toThrow('League name is required');
    });

    it('throws ApiError on network failure', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('network down'));

      await expect(createLeague({ name: 'Test' }, 'tok')).rejects.toBeInstanceOf(ApiError);
    });
  });

  // ── getLeagueById ──────────────────────────────────────────────────────────

  describe('getLeagueById', () => {
    it('sends GET /api/leagues/:id with Bearer token', async () => {
      const mockLeague = {
        id: 'league-abc',
        name: 'Specific League',
        privacy: 'PRIVATE',
        myTeam: { id: 'team-abc', name: "Shabad's Team" },
      };

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ league: mockLeague }),
      });

      const result = await getLeagueById('league-abc', 'mock-token');

      const [url, options] = globalThis.fetch.mock.calls[0];
      expect(url).toBe(`${API_BASE_URL}/api/leagues/league-abc`);
      expect(options.method).toBe('GET');
      expect(result.league.myTeam.name).toBe("Shabad's Team");
    });

    it('throws ApiError for 403 (non-member access)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ message: 'You do not have access to this league' }),
      });

      await expect(getLeagueById('private-league', 'mock-token')).rejects.toThrow(
        'You do not have access to this league'
      );
    });
  });
});
