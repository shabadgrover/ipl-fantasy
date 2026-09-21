import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';
import { env } from '../src/config/env.js';

describe('League API (Secure Authorization)', () => {
  const app = createApp();
  let ownerUser;
  let ownerToken;
  let memberUser;
  let memberToken;
  let nonMemberUser;
  let nonMemberToken;
  let createdLeagueId;
  let otherPrivateLeagueId;

  const createTestUser = async (namePrefix) => {
    const passwordHash = await bcrypt.hash('testpass123', 4);
    const user = await prisma.user.create({
      data: {
        name: `${namePrefix} User`,
        email: `${namePrefix.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`,
        passwordHash,
      },
    });
    const token = jwt.sign({ userId: user.id }, env.jwtSecret || 'test-jwt-secret-for-vitest-only');
    return { user, token };
  };

  beforeAll(async () => {
    await prisma.$connect();

    const ownerData = await createTestUser('Owner');
    ownerUser = ownerData.user;
    ownerToken = ownerData.token;

    const memberData = await createTestUser('Member');
    memberUser = memberData.user;
    memberToken = memberData.token;

    const nonMemberData = await createTestUser('NonMember');
    nonMemberUser = nonMemberData.user;
    nonMemberToken = nonMemberData.token;
  });

  afterAll(async () => {
    const userIds = [ownerUser?.id, memberUser?.id, nonMemberUser?.id].filter(Boolean);
    const leagueIds = [createdLeagueId, otherPrivateLeagueId].filter(Boolean);

    if (leagueIds.length > 0) {
      await prisma.leagueMember.deleteMany({ where: { leagueId: { in: leagueIds } } });
      await prisma.league.deleteMany({ where: { id: { in: leagueIds } } });
    }
    if (userIds.length > 0) {
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/leagues (Creation Security)', () => {
    it('rejects unauthenticated request with 401', async () => {
      const response = await request(app)
        .post('/api/leagues')
        .send({ name: 'Unauthenticated League' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('creates a league for the authenticated user and ignores spoofed ownerId', async () => {
      const response = await request(app)
        .post('/api/leagues')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          name: "Shabad's IPL League",
          privacy: 'PRIVATE',
          ownerId: nonMemberUser.id, // Attempted spoofing
        });

      expect(response.status).toBe(201);
      expect(response.body.league).toMatchObject({
        name: "Shabad's IPL League",
        ownerId: ownerUser.id, // Strictly set to authenticated user
        privacy: 'PRIVATE',
        status: 'ACTIVE',
      });
      expect(response.body.league.ownerId).not.toBe(nonMemberUser.id);
      expect(response.body.league.id).toBeDefined();
      expect(response.body.league.inviteCode).toMatch(/^[A-F0-9]{8}$/);
      expect(response.body.league.members).toHaveLength(1);
      expect(response.body.league.members[0].role).toBe('OWNER');
      expect(response.body.league.members[0].userId).toBe(ownerUser.id);

      // Verify member/owner emails are not exposed
      expect(response.body.league.owner.email).toBeUndefined();
      expect(response.body.league.members[0].user.email).toBeUndefined();

      createdLeagueId = response.body.league.id;

      // Add memberUser to this league for subsequent membership tests
      await prisma.leagueMember.create({
        data: {
          leagueId: createdLeagueId,
          userId: memberUser.id,
          role: 'MEMBER',
        },
      });
    });

    it('returns 400 when league name is missing or empty', async () => {
      const response = await request(app)
        .post('/api/leagues')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('League name is required');
    });

    it('returns 400 when league name exceeds 100 characters', async () => {
      const response = await request(app)
        .post('/api/leagues')
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'A'.repeat(101) });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('League name cannot exceed 100 characters');
    });
  });

  describe('GET /api/leagues/:id (Retrieval & IDOR Protection)', () => {
    it('rejects unauthenticated request with 401', async () => {
      const response = await request(app).get(`/api/leagues/${createdLeagueId}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('allows the league owner to retrieve their private league without exposing emails', async () => {
      const response = await request(app)
        .get(`/api/leagues/${createdLeagueId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.league.id).toBe(createdLeagueId);
      expect(response.body.league.name).toBe("Shabad's IPL League");
      expect(response.body.league.owner.id).toBe(ownerUser.id);
      expect(response.body.league.owner.email).toBeUndefined();
      expect(response.body.league.members[0].user.email).toBeUndefined();
    });

    it('allows a league member to retrieve the private league', async () => {
      const response = await request(app)
        .get(`/api/leagues/${createdLeagueId}`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(response.status).toBe(200);
      expect(response.body.league.id).toBe(createdLeagueId);
    });

    it('rejects an authenticated non-member from accessing another user private league with 403', async () => {
      const response = await request(app)
        .get(`/api/leagues/${createdLeagueId}`)
        .set('Authorization', `Bearer ${nonMemberToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('You do not have access to this league');
    });

    it('returns 404 for unknown league id', async () => {
      const response = await request(app)
        .get('/api/leagues/nonexistent-id-123')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('League not found');
    });
  });

  describe('GET /api/leagues (My Leagues Endpoint)', () => {
    beforeAll(async () => {
      // Create a separate league owned by nonMemberUser
      const otherLeague = await prisma.league.create({
        data: {
          name: "Other User's Private League",
          ownerId: nonMemberUser.id,
          inviteCode: 'OTHER999',
          privacy: 'PRIVATE',
          members: {
            create: {
              userId: nonMemberUser.id,
              role: 'OWNER',
            },
          },
        },
      });
      otherPrivateLeagueId = otherLeague.id;
    });

    it('rejects unauthenticated request with 401', async () => {
      const response = await request(app).get('/api/leagues');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('returns only leagues owned or joined by the authenticated user', async () => {
      const response = await request(app)
        .get('/api/leagues')
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.leagues)).toBe(true);

      const returnedLeagueIds = response.body.leagues.map((l) => l.id);
      expect(returnedLeagueIds).toContain(createdLeagueId);
      expect(returnedLeagueIds).not.toContain(otherPrivateLeagueId);

      const targetLeague = response.body.leagues.find((l) => l.id === createdLeagueId);
      expect(targetLeague._count.members).toBeDefined();
      expect(targetLeague.owner.id).toBe(ownerUser.id);
      expect(targetLeague.owner.email).toBeUndefined();
    });

    it('returns leagues where user is a member but not the owner', async () => {
      const response = await request(app)
        .get('/api/leagues')
        .set('Authorization', `Bearer ${memberToken}`);

      expect(response.status).toBe(200);
      const returnedLeagueIds = response.body.leagues.map((l) => l.id);
      expect(returnedLeagueIds).toContain(createdLeagueId);
      expect(returnedLeagueIds).not.toContain(otherPrivateLeagueId);
    });
  });
});
