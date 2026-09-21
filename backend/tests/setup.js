import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is required for backend tests. Copy .env.example to .env and configure PostgreSQL.'
  );
}

process.env.NODE_ENV = 'test';

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-for-vitest-only';
}
