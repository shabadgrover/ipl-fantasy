/**
 * Leaderboard sorting, ranking, and trend calculations.
 */

/**
 * Build initial rank list from a baseline points map (higher points = better rank).
 * @param {Record<string, number>} baselinePointsByTeamId
 * @returns {{ id: string, rank: number }[]}
 */
export const buildInitialRanks = (baselinePointsByTeamId) =>
  Object.keys(baselinePointsByTeamId)
    .sort((a, b) => baselinePointsByTeamId[b] - baselinePointsByTeamId[a])
    .map((id, index) => ({ id, rank: index + 1 }));

/**
 * @param {object} team
 * @param {Record<string, number>} baselinePointsByTeamId
 */
export const calculateMatchPoints = (team, baselinePointsByTeamId) => {
  const previousPoints = baselinePointsByTeamId[team.id] || 0;
  return team.totalPoints - previousPoints;
};

/**
 * Attach matchPoints delta to each team without changing totalPoints.
 * @param {object[]} teams
 * @param {Record<string, number>} baselinePointsByTeamId
 */
export const applyMatchPointsDelta = (teams, baselinePointsByTeamId) =>
  teams.map((team) => ({
    ...team,
    matchPoints: calculateMatchPoints(team, baselinePointsByTeamId),
    totalPoints: team.totalPoints,
  }));

/**
 * @param {object[]} teams
 * @returns {object[]}
 */
export const sortTeamsByTotalPoints = (teams) =>
  [...teams].sort((a, b) => b.totalPoints - a.totalPoints);

/**
 * @param {number} currentRank
 * @param {{ id: string, rank: number } | undefined} prevEntry
 * @returns {{ trend: 'up' | 'down' | 'same', rankDiff: number }}
 */
export const calculateRankTrend = (currentRank, prevEntry) => {
  if (!prevEntry) {
    return { trend: "same", rankDiff: 0 };
  }

  const rankDiff = prevEntry.rank - currentRank;
  let trend = "same";
  if (currentRank < prevEntry.rank) trend = "up";
  else if (currentRank > prevEntry.rank) trend = "down";

  return { trend, rankDiff };
};

/**
 * Assign ranks and trend indicators to sorted teams.
 * @param {object[]} sortedTeams
 * @param {{ id: string, rank: number }[]} initialRanks
 */
export const assignRanksAndTrends = (sortedTeams, initialRanks) =>
  sortedTeams.map((team, index) => {
    const currentRank = index + 1;
    const prevEntry = initialRanks.find((p) => p.id === team.id);
    const { trend, rankDiff } = calculateRankTrend(currentRank, prevEntry);
    return { ...team, trend, rankDiff, rank: currentRank };
  });

/**
 * Full pipeline: parsed teams → ranked leaderboard with trends.
 * @param {object[]} parsedTeams
 * @param {Record<string, number>} baselinePointsByTeamId
 */
export const buildLeaderboard = (parsedTeams, baselinePointsByTeamId) => {
  const initialRanks = buildInitialRanks(baselinePointsByTeamId);
  const withMatchPoints = applyMatchPointsDelta(parsedTeams, baselinePointsByTeamId);
  const sortedTeams = sortTeamsByTotalPoints(withMatchPoints);
  return assignRanksAndTrends(sortedTeams, initialRanks);
};

/**
 * @param {object[]} teamsWithTrend
 * @returns {{ id: string, rank: number }[]}
 */
export const toRankingsStorage = (teamsWithTrend) =>
  teamsWithTrend.map((t, idx) => ({ id: t.id, rank: idx + 1 }));
