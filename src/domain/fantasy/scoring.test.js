import { describe, it, expect } from 'vitest';
import {
  getCaptainMultiplier,
  calculateSplitFinalPoints,
  parsePlayerMarkers,
  resolvePhaseCaptaincy,
  calculatePlayerFinalPoints,
} from './scoring.js';
import { TEAM_ROLES } from '../../config/season2026.js';

describe('getCaptainMultiplier', () => {
  it('returns 2 for captain', () => {
    expect(getCaptainMultiplier(true, false)).toBe(2);
  });

  it('returns 1.5 for vice-captain', () => {
    expect(getCaptainMultiplier(false, true)).toBe(1.5);
  });

  it('returns 1 for regular player', () => {
    expect(getCaptainMultiplier(false, false)).toBe(1);
  });

  it('prioritizes captain over vice-captain', () => {
    expect(getCaptainMultiplier(true, true)).toBe(2);
  });
});

describe('calculateSplitFinalPoints', () => {
  it('applies single multiplier when no phase baseline', () => {
    expect(calculateSplitFinalPoints(100, 0, 2, 2)).toBe(200);
  });

  it('splits points at Match-36 baseline with different phase multipliers', () => {
    // Vaibhav Sooryavanshi: baseline 791, base 900, phase2 captain (2× both phases)
    const result = calculateSplitFinalPoints(900, 791, 2, 2);
    expect(result).toBe(791 * 2 + 109 * 2);
  });

  it('applies phase1 multiplier only to baseline portion', () => {
    // 500 base, 791 baseline, P1 VC (1.5×), P2 regular (1×)
    const result = calculateSplitFinalPoints(500, 791, 1.5, 1);
    expect(result).toBe(500 * 1.5);
  });

  it('applies phase2 multiplier only to points after baseline', () => {
    // 900 base, 791 baseline, P1 regular (1×), P2 captain (2×)
    const result = calculateSplitFinalPoints(900, 791, 1, 2);
    expect(result).toBe(791 + 109 * 2);
  });
});

describe('parsePlayerMarkers', () => {
  it('parses captain marker', () => {
    expect(parsePlayerMarkers('Virat Kohli (C)')).toEqual({
      isCaptain: true,
      isVC: false,
      isOut: false,
      isNew: false,
      cleanName: 'Virat Kohli',
    });
  });

  it('parses multiple markers', () => {
    expect(parsePlayerMarkers('Devdutt Padikkal (New)')).toMatchObject({
      isNew: true,
      cleanName: 'Devdutt Padikkal',
    });
  });
});

describe('resolvePhaseCaptaincy', () => {
  it('uses teamRoles when Excel has no markers', () => {
    const roles = TEAM_ROLES["Ankit's Team"];
    const result = resolvePhaseCaptaincy('Virat Kohli', roles, { isCaptain: false, isVC: false });
    expect(result.isP1Cap).toBe(true);
    expect(result.isP2Cap).toBe(true);
    expect(result.multP2).toBe(2);
  });
});

describe('calculatePlayerFinalPoints', () => {
  it('matches full pipeline for a regular player', () => {
    const result = calculatePlayerFinalPoints({
      basePoints: 150,
      phase1Baseline: 0,
      roles: {},
      markers: { isCaptain: false, isVC: false },
      cleanName: 'Rohit Sharma',
    });
    expect(result).toBe(150);
  });

  it('matches Aizen phase2 captain with phase1 baseline player', () => {
    const roles = TEAM_ROLES.Aizen;
    const result = calculatePlayerFinalPoints({
      basePoints: 900,
      phase1Baseline: 791,
      roles,
      markers: { isCaptain: false, isVC: false },
      cleanName: 'Vaibhav Sooryavanshi',
    });
    // P1: not cap/VC in phase1, P2: captain
    expect(result).toBe(791 + 109 * 2);
  });
});
