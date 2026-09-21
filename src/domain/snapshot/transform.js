/**
 * Pure snapshot payload transforms (no storage I/O).
 */

/**
 * @param {object[]} teams
 */
export const toLeaderboardSnapshot = (teams) =>
  teams.map((team) => ({
    userId: team.id,
    name: team.teamName,
    totalPoints: team.totalPoints,
  }));

/**
 * @param {object[]} teams
 */
export const toTeamSnapshot = (teams) =>
  teams.map((team) => ({
    userId: team.id,
    team: team.players.map((player) => ({
      name: player.name,
      points: player.basePoints,
      finalPoints: player.finalPoints,
      isCaptain: player.isCaptain,
      isVC: player.isVC,
    })),
  }));
