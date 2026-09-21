import { TEAM_ROLES, PHASE1_BASELINES } from '../../config/season2026.js';
import { normalizeTeamName, getIplAbbr } from './iplTeams.js';
import { parsePlayerMarkers, resolvePhaseCaptaincy, calculateSplitFinalPoints } from '../fantasy/scoring.js';

/**
 * Discover fantasy team column blocks from Excel header rows.
 * @param {unknown[]} headers
 * @param {unknown[]} labels
 */
export const discoverTeamsFromExcelHeaders = (headers, labels) => {
  const discoveredTeams = [];

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header && typeof header === "string" && header.trim() !== "" && labels[i] === "Player Name") {
      let iplIdx = -1;
      let pointsIdx = -1;

      for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
        if (labels[j] === "IPL Team") iplIdx = j;
        if (labels[j] === "Points") pointsIdx = j;
      }

      if (pointsIdx !== -1) {
        discoveredTeams.push({
          name: header.trim(),
          playerCol: i,
          iplCol: iplIdx,
          pointsCol: pointsIdx,
        });
      }
    }
  }

  return discoveredTeams;
};

/**
 * Parse a single fantasy team's players from Excel rows.
 * @param {unknown[][]} rows
 * @param {{ name: string, playerCol: number, iplCol: number, pointsCol: number }} base
 * @param {Record<string, object>} [teamRolesConfig]
 * @param {Record<string, number>} [phase1Baselines]
 */
export const parseTeamFromExcelRows = (
  rows,
  base,
  teamRolesConfig = TEAM_ROLES,
  phase1Baselines = PHASE1_BASELINES
) => {
  const players = [];
  let calculatedTotal = 0;
  let mstCost = 0;
  const roles = teamRolesConfig[base.name] || {};

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawName = row[base.playerCol];

    if (!rawName || rawName === "TOTAL") continue;

    const basePoints = parseFloat(row[base.pointsCol]) || 0;

    if (rawName === "MST Costs") {
      mstCost = basePoints;
      calculatedTotal += mstCost;
      continue;
    }

    const markers = parsePlayerMarkers(rawName);
    const { cleanName, isOut, isNew } = markers;
    const p1Baseline = phase1Baselines[cleanName] || 0;
    const { isP1Cap, isP1VC, isP2Cap, isP2VC, multP1, multP2 } = resolvePhaseCaptaincy(
      cleanName,
      roles,
      markers
    );

    const finalPoints = calculateSplitFinalPoints(basePoints, p1Baseline, multP1, multP2);

    const iplTeamRaw = row[base.iplCol] || "";
    const iplTeam = normalizeTeamName(iplTeamRaw);

    players.push({
      name: cleanName,
      rawName,
      iplTeam,
      iplAbbr: getIplAbbr(iplTeam),
      basePoints,
      multiplier: multP2,
      finalPoints,
      isCaptain: isP2Cap,
      isVC: isP2VC,
      isOut,
      isNew,
      phase: isNew ? "phase2" : "phase1",
      phase1Captain: isP1Cap,
      phase1ViceCaptain: isP1VC,
      phase2Captain: isP2Cap,
      phase2ViceCaptain: isP2VC,
    });
    calculatedTotal += finalPoints;
  }

  return {
    id: base.name,
    teamName: base.name,
    players,
    mstCost,
    totalPoints: calculatedTotal,
    roles: teamRolesConfig[base.name] || {},
    isUser: false,
  };
};

/**
 * Parse all teams from raw Excel row data.
 * @param {unknown[][]} rows
 * @param {Record<string, object>} [teamRolesConfig]
 * @param {Record<string, number>} [phase1Baselines]
 */
export const parseTeamsFromExcelRows = (
  rows,
  teamRolesConfig = TEAM_ROLES,
  phase1Baselines = PHASE1_BASELINES
) => {
  if (rows.length < 2) return [];

  const headers = rows[0];
  const labels = rows[1];
  const discoveredTeams = discoverTeamsFromExcelHeaders(headers, labels);

  return discoveredTeams.map((base) =>
    parseTeamFromExcelRows(rows, base, teamRolesConfig, phase1Baselines)
  );
};
