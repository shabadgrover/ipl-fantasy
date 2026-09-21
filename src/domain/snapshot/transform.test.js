import { describe, it, expect } from 'vitest';
import { toLeaderboardSnapshot, toTeamSnapshot } from './transform.js';

describe('snapshot transforms', () => {
  const teams = [
    {
      id: "shabad's Team",
      teamName: "shabad's Team",
      totalPoints: 10394.5,
      players: [
        {
          name: 'Shubman Gill',
          basePoints: 500,
          finalPoints: 1000,
          isCaptain: true,
          isVC: false,
        },
      ],
    },
  ];

  it('toLeaderboardSnapshot maps team totals', () => {
    expect(toLeaderboardSnapshot(teams)).toEqual([
      {
        userId: "shabad's Team",
        name: "shabad's Team",
        totalPoints: 10394.5,
      },
    ]);
  });

  it('toTeamSnapshot maps player details', () => {
    expect(toTeamSnapshot(teams)).toEqual([
      {
        userId: "shabad's Team",
        team: [
          {
            name: 'Shubman Gill',
            points: 500,
            finalPoints: 1000,
            isCaptain: true,
            isVC: false,
          },
        ],
      },
    ]);
  });
});
