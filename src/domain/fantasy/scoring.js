/**
 * Pure fantasy scoring functions.
 * Captain 2×, Vice-captain 1.5×, with Match-36/37 phase split.
 */

/**
 * @param {boolean} isCaptain
 * @param {boolean} isVC
 * @returns {number}
 */
export const getCaptainMultiplier = (isCaptain, isVC) => {
  if (isCaptain) return 2;
  if (isVC) return 1.5;
  return 1;
};

/**
 * Split scoring: Phase 1 multiplier on points up to baseline, Phase 2 on remainder.
 * @param {number} basePoints
 * @param {number} phase1Baseline
 * @param {number} multP1
 * @param {number} multP2
 * @returns {number}
 */
export const calculateSplitFinalPoints = (basePoints, phase1Baseline, multP1, multP2) => {
  const pointsP1 = Math.min(basePoints, phase1Baseline) * multP1;
  const pointsP2 = Math.max(0, basePoints - phase1Baseline) * multP2;
  return pointsP1 + pointsP2;
};

/**
 * @param {string} rawName
 * @returns {{ cleanName: string, isCaptain: boolean, isVC: boolean, isOut: boolean, isNew: boolean }}
 */
export const parsePlayerMarkers = (rawName) => ({
  isCaptain: rawName.includes("(C)"),
  isVC: rawName.includes("(VC)"),
  isOut: rawName.includes("(Out)"),
  isNew: rawName.includes("(New)"),
  cleanName: rawName.replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "").trim(),
});

/**
 * Resolve phase-specific captain / vice-captain flags for a player.
 * @param {string} cleanName
 * @param {{ phase1Captain?: string, phase1ViceCaptain?: string, phase2Captain?: string, phase2ViceCaptain?: string }} roles
 * @param {{ isCaptain: boolean, isVC: boolean }} markers
 */
export const resolvePhaseCaptaincy = (cleanName, roles, markers) => {
  const isP1Cap = markers.isCaptain || cleanName === roles.phase1Captain;
  const isP1VC = markers.isVC || cleanName === roles.phase1ViceCaptain;
  const isP2Cap = markers.isCaptain || cleanName === roles.phase2Captain;
  const isP2VC = markers.isVC || cleanName === roles.phase2ViceCaptain;

  return {
    isP1Cap,
    isP1VC,
    isP2Cap,
    isP2VC,
    multP1: getCaptainMultiplier(isP1Cap, isP1VC),
    multP2: getCaptainMultiplier(isP2Cap, isP2VC),
  };
};

/**
 * Calculate final fantasy points for a single player row.
 * @param {object} params
 * @param {number} params.basePoints
 * @param {number} params.phase1Baseline
 * @param {object} params.roles
 * @param {{ isCaptain: boolean, isVC: boolean }} params.markers
 * @param {string} params.cleanName
 */
export const calculatePlayerFinalPoints = ({
  basePoints,
  phase1Baseline,
  roles,
  markers,
  cleanName,
}) => {
  const { multP1, multP2 } = resolvePhaseCaptaincy(cleanName, roles, markers);
  return calculateSplitFinalPoints(basePoints, phase1Baseline, multP1, multP2);
};
