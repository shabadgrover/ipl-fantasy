import { describe, it, expect } from 'vitest';
import {
  buildInitialRanks,
  calculateMatchPoints,
  sortTeamsByTotalPoints,
  calculateRankTrend,
  assignRanksAndTrends,
  buildLeaderboard,
} from './standings.js';
import { BASELINE_PREVIOUS_MATCH } from '../../config/season2026.js';

describe('buildInitialRanks', () => {
  it('ranks teams by baseline points descending', () => {
    const ranks = buildInitialRanks(BASELINE_PREVIOUS_MATCH);
    expect(ranks[0]).toEqual({ id: "shabad's Team", rank: 1 });
    expect(ranks[1]).toEqual({ id: "Deepanshuu's Team", rank: 2 });
    expect(ranks[2]).toEqual({ id: "Sumit's Team", rank: 3 });
    expect(ranks[ranks.length - 1]).toEqual({ id: 'GURI XI', rank: 9 });
  });
});

describe('calculateMatchPoints', () => {
  it('returns delta from baseline', () => {
    const team = { id: "shabad's Team", totalPoints: 10500 };
    expect(calculateMatchPoints(team, BASELINE_PREVIOUS_MATCH)).toBe(10500 - 10394.5);
  });

  it('returns full total when team not in baseline', () => {
    const team = { id: 'Unknown Team', totalPoints: 5000 };
    expect(calculateMatchPoints(team, BASELINE_PREVIOUS_MATCH)).toBe(5000);
  });
});

describe('sortTeamsByTotalPoints', () => {
  it('sorts descending without mutating input', () => {
    const input = [
      { id: 'a', totalPoints: 100 },
      { id: 'b', totalPoints: 300 },
      { id: 'c', totalPoints: 200 },
    ];
    const sorted = sortTeamsByTotalPoints(input);
    expect(sorted.map((t) => t.id)).toEqual(['b', 'c', 'a']);
    expect(input[0].id).toBe('a');
  });
});

describe('calculateRankTrend', () => {
  it('detects rank improvement as up', () => {
    expect(calculateRankTrend(2, { id: 'x', rank: 5 })).toEqual({ trend: 'up', rankDiff: 3 });
  });

  it('detects rank drop as down', () => {
    expect(calculateRankTrend(5, { id: 'x', rank: 2 })).toEqual({ trend: 'down', rankDiff: -3 });
  });

  it('returns same when rank unchanged', () => {
    expect(calculateRankTrend(3, { id: 'x', rank: 3 })).toEqual({ trend: 'same', rankDiff: 0 });
  });
});

describe('assignRanksAndTrends', () => {
  it('assigns sequential ranks', () => {
    const sorted = [
      { id: 'a', totalPoints: 300 },
      { id: 'b', totalPoints: 200 },
    ];
    const initialRanks = [
      { id: 'a', rank: 2 },
      { id: 'b', rank: 1 },
    ];
    const result = assignRanksAndTrends(sorted, initialRanks);
    expect(result[0].rank).toBe(1);
    expect(result[0].trend).toBe('up');
    expect(result[1].rank).toBe(2);
    expect(result[1].trend).toBe('down');
  });
});

describe('buildLeaderboard', () => {
  it('produces full pipeline output with ranks and matchPoints', () => {
    const parsedTeams = Object.entries(BASELINE_PREVIOUS_MATCH).map(([id, totalPoints]) => ({
      id,
      teamName: id,
      totalPoints,
      players: [],
    }));

    const result = buildLeaderboard(parsedTeams, BASELINE_PREVIOUS_MATCH);

    expect(result).toHaveLength(9);
    expect(result[0].id).toBe("shabad's Team");
    expect(result[0].rank).toBe(1);
    expect(result[0].matchPoints).toBe(0);
    expect(result[0].trend).toBe('same');

    // Team with higher current total than baseline should trend up
    const boosted = parsedTeams.map((t) =>
      t.id === 'GURI XI' ? { ...t, totalPoints: t.totalPoints + 500 } : t
    );
    const boostedResult = buildLeaderboard(boosted, BASELINE_PREVIOUS_MATCH);
    const guri = boostedResult.find((t) => t.id === 'GURI XI');
    expect(guri.matchPoints).toBe(500);
    expect(guri.trend).toBe('up');
  });
});
