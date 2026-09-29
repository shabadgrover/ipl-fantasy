import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { createApp } from '../src/app.js';
import { prisma } from '../src/config/database.js';

describe('Auth API', () => {
  const app = createApp();
  const testEmail = `auth-test-${Date.now()}@example.com`;
  const testPassword = 'securepass123';
  let userId;
  let authToken;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    if (userId) {
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('registers a valid user and returns a token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Auth Test User', email: testEmail, password: testPassword });

      expect(response.status).toBe(201);
      expect(response.body.user).toMatchObject({
        name: 'Auth Test User',
        email: testEmail,
      });
      expect(response.body.user.id).toBeDefined();
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.token).toBeDefined();

      userId = response.body.user.id;
      authToken = response.body.token;

      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      expect(dbUser.passwordHash).toBeDefined();
      expect(dbUser.passwordHash).not.toBe(testPassword);
      expect(await bcrypt.compare(testPassword, dbUser.passwordHash)).toBe(true);
    });

    it('rejects duplicate email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Duplicate User', email: testEmail, password: testPassword });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('An account with this email already exists');
    });

    it('rejects missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'noname@example.com', password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('rejects non-string name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 12345, email: 'badname@example.com', password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('rejects whitespace-only name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: '    ', email: 'whitespace@example.com', password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });

    it('rejects name exceeding maximum length (100 chars)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'A'.repeat(101), email: 'toolongname@example.com', password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name cannot exceed 100 characters');
    });

    it('rejects non-string email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Valid Name', email: 99999, password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email is required');
    });

    it('rejects email exceeding maximum length (255 chars)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Valid Name', email: `${'a'.repeat(250)}@example.com`, password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email cannot exceed 255 characters');
    });

    it('rejects invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Bad Email', email: 'not-an-email', password: testPassword });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email address');
    });

    it('rejects non-string password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Valid Name', email: 'nonstringpass@example.com', password: 12345678 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password is required');
    });

    it('rejects weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Short Pass', email: 'short@example.com', password: 'abc' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password must be at least 8 characters');
    });

    it('rejects password exceeding maximum length (72 chars)', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Long Pass', email: 'longpass@example.com', password: 'A'.repeat(73) });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password cannot exceed 72 characters');
    });

    it('rejects non-object or empty payload', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Name is required');
    });
  });

  describe('POST /api/auth/login', () => {
    it('authenticates with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testEmail);
      expect(response.body.user.passwordHash).toBeUndefined();
      expect(response.body.token).toBeDefined();

      authToken = response.body.token;
    });

    it('rejects invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('rejects missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testEmail });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email and password are required');
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user with a valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        id: userId,
        name: 'Auth Test User',
        email: testEmail,
      });
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('rejects missing token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });

    it('rejects invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid or expired token');
    });
  });
});
