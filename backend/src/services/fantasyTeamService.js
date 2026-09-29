import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Create a FantasyTeam record for an existing LeagueMember.
 * The team name defaults to "<memberName>'s Team".
 *
 * This is intended to be called within a Prisma transaction (tx).
 * Pass the transaction client as the first argument.
 *
 * @param {import('@prisma/client').PrismaClient} tx - Prisma transaction client (or regular prisma)
 * @param {string} leagueMemberId - The LeagueMember id to attach the team to
 * @param {string} memberName - The authenticated user's name (from JWT)
 * @returns {Promise<import('@prisma/client').FantasyTeam>}
 */
export const createDefaultTeam = async (tx, leagueMemberId, memberName) => {
  const teamName = `${memberName}'s Team`;
  return tx.fantasyTeam.create({
    data: {
      name: teamName,
      leagueMemberId,
    },
  });
};

/**
 * Get the authenticated user's FantasyTeam for a specific league.
 *
 * @param {string} userId - The authenticated user's id
 * @param {string} leagueId - The league id
 * @returns {Promise<{ id: string, name: string } | null>}
 */
export const getMyTeamForLeague = async (userId, leagueId) => {
  if (!userId || !leagueId) return null;

  const member = await prisma.leagueMember.findUnique({
    where: {
      leagueId_userId: { leagueId, userId },
    },
    include: {
      fantasyTeam: {
        select: { id: true, name: true },
      },
    },
  });

  return member?.fantasyTeam ?? null;
};
