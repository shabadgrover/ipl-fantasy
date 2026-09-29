import { createApp } from './app.js';
import { env, assertDatabaseConfigured, assertJwtConfigured } from './config/env.js';
import { prisma } from './config/database.js';

assertDatabaseConfigured();
assertJwtConfigured();

const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`IPL Fantasy API listening on http://localhost:${env.port}`);
});

const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
