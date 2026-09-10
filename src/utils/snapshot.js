/**
 * Snapshot System for Fantasy Cricket Web App
 * Safely stores current data as a backup before upcoming changes.
 */

import { toLeaderboardSnapshot, toTeamSnapshot } from '../domain/snapshot/transform.js';

const LEADERBOARD_KEY = 'phase1LeaderboardSnapshot';
const TEAM_KEY = 'phase1TeamSnapshot';

/**
 * Saves a snapshot of the current leaderboard and team data.
 * Runs only once - will not overwrite existing snapshots.
 *
 * @param {Array} teams - The current list of parsed team data from Excel
 */
export const saveCurrentStateSnapshot = (teams) => {
  if (!teams || teams.length === 0) return;

  const existingLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
  const existingTeams = localStorage.getItem(TEAM_KEY);

  if (existingLeaderboard && existingTeams) {
    console.log('Snapshots already exist. Skipping backup.');
    return;
  }

  try {
    const leaderboardSnapshot = toLeaderboardSnapshot(teams);
    const teamSnapshot = toTeamSnapshot(teams);

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboardSnapshot));
    localStorage.setItem(TEAM_KEY, JSON.stringify(teamSnapshot));

    console.log('✅ Phase 1 Snapshots saved successfully!');
    console.log('Leaderboard Snapshot:', leaderboardSnapshot);
  } catch (error) {
    console.error('❌ Failed to save snapshots:', error);
  }
};

/**
 * Retrieves the saved snapshots if they exist.
 */
export const getSavedSnapshots = () => {
  try {
    const leaderboard = JSON.parse(localStorage.getItem(LEADERBOARD_KEY));
    const teams = JSON.parse(localStorage.getItem(TEAM_KEY));

    if (leaderboard && teams) {
      return { leaderboard, teams };
    }
  } catch (error) {
    console.error('Error retrieving snapshots:', error);
  }
  return null;
};

/**
 * Clears snapshots (for debugging/reset purposes)
 */
export const clearSnapshots = () => {
  localStorage.removeItem(LEADERBOARD_KEY);
  localStorage.removeItem(TEAM_KEY);
  console.log('Snapshots cleared.');
};
