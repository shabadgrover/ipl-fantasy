import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');

dotenv.config({ path: path.join(rootDir, '.env') });

export const env = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export const assertDatabaseConfigured = () => {
  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and configure PostgreSQL.');
  }
};

export const assertJwtConfigured = () => {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not set. Copy .env.example to .env and configure a secure secret.');
  }
};
