import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const generateInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export const createLeague = async ({ name, ownerId, privacy }) => {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    throw new AppError('League name is required', 400);
  }
  if (!ownerId?.trim()) {
    throw new AppError('ownerId is required', 400);
  }

  const owner = await prisma.user.findUnique({ where: { id: ownerId } });
  if (!owner) {
    throw new AppError('Owner user not found', 404);
  }

  let inviteCode = generateInviteCode();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.league.findUnique({ where: { inviteCode } });
    if (!existing) break;
    inviteCode = generateInviteCode();
    attempts += 1;
  }

  const league = await prisma.league.create({
    data: {
      name: trimmedName,
      ownerId,
      inviteCode,
      privacy: privacy === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE',
      members: {
        create: {
          userId: ownerId,
          role: 'OWNER',
        },
      },
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  return league;
};

export const getLeagueById = async (id) => {
  if (!id?.trim()) {
    throw new AppError('League id is required', 400);
  }

  const league = await prisma.league.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      },
      seasons: true,
    },
  });

  if (!league) {
    throw new AppError('League not found', 404);
  }

  return league;
};
