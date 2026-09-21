import { MATCH_PHASE } from '../../config/season2026.js';

/**
 * @param {number} matchId
 * @returns {'phase1' | 'phase2'}
 */
export const getMatchPhase = (matchId) =>
  matchId <= MATCH_PHASE.phase1EndMatch ? "phase1" : "phase2";

/**
 * Whether MST-acquired players should be hidden for this match in schedule view.
 * @param {number} matchId
 */
export const shouldHideNewPlayers = (matchId) =>
  matchId <= MATCH_PHASE.newPlayerHideUntilMatch;

/**
 * Derive display state for a squad player at a given match in the schedule.
 * @param {object} player
 * @param {number} matchId
 */
export const getPlayerStateForMatch = (player, matchId) => {
  const isPhase1 = shouldHideNewPlayers(matchId);
  const matchPhase = getMatchPhase(matchId);

  return {
    effectiveIsOut: isPhase1 ? false : player.isOut,
    isMatchCaptain: matchPhase === "phase1" ? player.phase1Captain : player.phase2Captain,
    isMatchVC: matchPhase === "phase1" ? player.phase1ViceCaptain : player.phase2ViceCaptain,
  };
};
