import { describe, it, expect } from 'vitest';
import { getMatchPhase, shouldHideNewPlayers, getPlayerStateForMatch } from './phase.js';

describe('match phase helpers', () => {
  it('getMatchPhase returns phase1 through match 36', () => {
    expect(getMatchPhase(36)).toBe('phase1');
    expect(getMatchPhase(37)).toBe('phase2');
  });

  it('shouldHideNewPlayers through match 35 only', () => {
    expect(shouldHideNewPlayers(35)).toBe(true);
    expect(shouldHideNewPlayers(36)).toBe(false);
  });

  it('getPlayerStateForMatch uses phase-appropriate captaincy', () => {
    const player = {
      isOut: true,
      phase1Captain: false,
      phase1ViceCaptain: true,
      phase2Captain: true,
      phase2ViceCaptain: false,
    };

    const phase1 = getPlayerStateForMatch(player, 30);
    expect(phase1.effectiveIsOut).toBe(false);
    expect(phase1.isMatchCaptain).toBe(false);
    expect(phase1.isMatchVC).toBe(true);

    const phase2 = getPlayerStateForMatch(player, 40);
    expect(phase2.effectiveIsOut).toBe(true);
    expect(phase2.isMatchCaptain).toBe(true);
    expect(phase2.isMatchVC).toBe(false);
  });
});
