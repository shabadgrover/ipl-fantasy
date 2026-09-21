import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

const generateInviteCode = () => crypto.randomBytes(4).toString('hex').toUpperCase();

export const createLeague = async ({ name, ownerId, privacy }) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw new AppError('League name is required', 400);
  }
  const trimmedName = name.trim();
  if (trimmedName.length > 100) {
    throw new AppError('League name cannot exceed 100 characters', 400);
  }

  if (!ownerId || typeof ownerId !== 'string' || !ownerId.trim()) {
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

  try {
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
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    });

    return league;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new AppError('A league with this invite code already exists. Please try again.', 409);
    }
    if (error.code === 'P2025') {
      throw new AppError('Referenced user or resource not found', 404);
    }
    throw error;
  }
};

export const getLeagueById = async (id, userId) => {
  if (!id || typeof id !== 'string' || !id.trim()) {
    throw new AppError('League id is required', 400);
  }

  let league;
  try {
    league = await prisma.league.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true },
        },
        members: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        seasons: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError('League not found', 404);
    }
    throw error;
  }

  if (!league) {
    throw new AppError('League not found', 404);
  }

  const isOwner = league.ownerId === userId;
  const isMember = league.members.some((m) => m.userId === userId);

  if (league.privacy === 'PRIVATE' && !isOwner && !isMember) {
    throw new AppError('You do not have access to this league', 403);
  }

  return league;
};

export const getUserLeagues = async (userId) => {
  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    throw new AppError('User ID is required', 400);
  }

  try {
    const leagues = await prisma.league.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: { id: true, name: true },
        },
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return leagues;
  } catch (error) {
    if (error.code === 'P2025') {
      throw new AppError('Resource not found', 404);
    }
    throw error;
  }
};
