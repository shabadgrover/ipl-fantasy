import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';

describe('League API', () => {
  const app = createApp();
  let ownerId;
  let leagueId;

  beforeAll(async () => {
    await prisma.$connect();

    const passwordHash = await bcrypt.hash('testpassword123', 4);
    const owner = await prisma.user.create({
      data: {
        name: 'Test Owner',
        email: `test-owner-${Date.now()}@example.com`,
        passwordHash,
      },
    });
    ownerId = owner.id;
  });

  afterAll(async () => {
    if (leagueId) {
      await prisma.leagueMember.deleteMany({ where: { leagueId } });
      await prisma.league.deleteMany({ where: { id: leagueId } });
    }
    if (ownerId) {
      await prisma.user.deleteMany({ where: { id: ownerId } });
    }
    await prisma.$disconnect();
  });

  it('POST /api/leagues creates a league', async () => {
    const response = await request(app)
      .post('/api/leagues')
      .send({ name: "Shabad's IPL League", ownerId });

    expect(response.status).toBe(201);
    expect(response.body.league).toMatchObject({
      name: "Shabad's IPL League",
      ownerId,
      privacy: 'PRIVATE',
      status: 'ACTIVE',
    });
    expect(response.body.league.id).toBeDefined();
    expect(response.body.league.inviteCode).toMatch(/^[A-F0-9]{8}$/);
    expect(response.body.league.members).toHaveLength(1);
    expect(response.body.league.members[0].role).toBe('OWNER');

    leagueId = response.body.league.id;
  });

  it('GET /api/leagues/:id retrieves the created league', async () => {
    const response = await request(app).get(`/api/leagues/${leagueId}`);

    expect(response.status).toBe(200);
    expect(response.body.league.id).toBe(leagueId);
    expect(response.body.league.name).toBe("Shabad's IPL League");
    expect(response.body.league.owner.id).toBe(ownerId);
    expect(response.body.league.seasons).toEqual([]);
  });

  it('POST /api/leagues returns 400 when name is missing', async () => {
    const response = await request(app)
      .post('/api/leagues')
      .send({ ownerId });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('League name is required');
  });

  it('POST /api/leagues returns 404 when owner does not exist', async () => {
    const response = await request(app)
      .post('/api/leagues')
      .send({ name: 'Ghost League', ownerId: 'nonexistent-id' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Owner user not found');
  });

  it('GET /api/leagues/:id returns 404 for unknown league', async () => {
    const response = await request(app).get('/api/leagues/nonexistent-id');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('League not found');
  });
});
