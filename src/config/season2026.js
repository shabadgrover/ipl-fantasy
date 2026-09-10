/**
 * IPL Fantasy League — 2026 Season 1 configuration.
 * All values preserved from the original inline application code.
 */

export const SEASON_LABEL = 'Season 1';
export const SEASON_YEAR = 2026;
export const LEADERBOARD_LAST_UPDATED_MATCH = 69;

/** Cumulative totals at end of Match 73 — used for matchPoints delta and rank trends */
export const BASELINE_PREVIOUS_MATCH = {
  "Sumit's Team": 10237.5,
  "Deepanshuu's Team": 10263.5,
  "shabad's Team": 10394.5,
  "Piyush dhiman's Team": 9273,
  "Ankit's Team": 8648,
  "Maat maro shota bacha hu": 7336.5,
  "Jenna Morrh Warriors": 7036,
  "Aizen": 9016,
  "GURI XI": 6724.5,
};

/** Captain / vice-captain assignments per fantasy team */
export const TEAM_ROLES = {
  "Ankit's Team": {
    phase1Captain: "Virat Kohli",
    phase1ViceCaptain: "Trent Boult",
    phase2Captain: "Virat Kohli",
    phase2ViceCaptain: "Sai Sudharsan",
    captainChangeMatch: 37,
  },
  "shabad's Team": {
    phase1Captain: "Shubman Gill",
    phase1ViceCaptain: "Yashasvi Jaiswal",
    phase2Captain: "Shubman Gill",
    phase2ViceCaptain: "Yashasvi Jaiswal",
  },
  Aizen: {
    phase1Captain: "Varun Chakravarthy",
    phase1ViceCaptain: "Ishan Kishan",
    phase2Captain: "Vaibhav Sooryavanshi",
    phase2ViceCaptain: "Ishan Kishan",
    captainChangeMatch: 37,
  },
  "Jenna Morrh Warriors": {
    phase1Captain: "Ruturaj Gaikwad",
    phase1ViceCaptain: "Hardik Pandya",
    phase2Captain: "Ruturaj Gaikwad",
    phase2ViceCaptain: "Hardik Pandya",
  },
  "Piyush dhiman's Team": {
    phase1Captain: "Suryakumar Yadav",
    phase1ViceCaptain: "Kagiso Rabada",
    phase2Captain: "Suryakumar Yadav",
    phase2ViceCaptain: "Kagiso Rabada",
  },
  "Maat maro shota bacha hu": {
    phase1Captain: "Shreyas Iyer",
    phase1ViceCaptain: "Marco Jansen",
    phase2Captain: "Shreyas Iyer",
    phase2ViceCaptain: "Marco Jansen",
  },
  "GURI XI": {
    phase1Captain: "Dewald Brevis",
    phase1ViceCaptain: "Jasprit Bumrah",
    phase2Captain: "Dewald Brevis",
    phase2ViceCaptain: "Dhruv Jurel",
    captainChangeMatch: 37,
  },
  "Deepanshuu's Team": {
    phase1Captain: "Jos Buttler",
    phase1ViceCaptain: "Mitchell Marsh",
    phase2Captain: "Jos Buttler",
    phase2ViceCaptain: "Sanju Samson",
    captainChangeMatch: 37,
  },
  "Sumit's Team": {
    phase1Captain: "Rishabh Pant",
    phase1ViceCaptain: "Abhishek Sharma",
    phase2Captain: "Rishabh Pant",
    phase2ViceCaptain: "Abhishek Sharma",
  },
};

/** Player cumulative base points at end of Match 36 (Phase 1 cutoff) */
export const PHASE1_BASELINES = {
  "Vaibhav Sooryavanshi": 791,
  "Varun Chakravarthy": 258,
  "Trent Boult": 69,
  "Sai Sudharsan": 487,
  "Sanju Samson": 611,
  "Mitchell Marsh": 418,
  "Dhruv Jurel": 587,
  "Jasprit Bumrah": 243,
};

/** Match timeline constants for phase-aware UI */
export const MATCH_PHASE = {
  phase1EndMatch: 36,
  newPlayerHideUntilMatch: 35,
  captainChangeMatch: 37,
};

/** Player access codes for the 2026 private league login gate */
export const PLAYER_ACCESS_CODES = {
  SHABAD123: { name: "Shabad", team: "shabad's Team" },
  NITESH123: { name: "Nitesh", team: "Aizen" },
  GURSHARAN123: { name: "Gursharan", team: "GURI XI" },
  PIYUSH123: { name: "Piyush", team: "Piyush dhiman's Team" },
  SUMIT123: { name: "Sumit", team: "Sumit's Team" },
  ANKIT123: { name: "Ankit", team: "Ankit's Team" },
  BHATTI123: { name: "Deepanshu", team: "Deepanshuu's Team" },
  HARSH123: { name: "Harsh", team: "Maat maro shota bacha hu" },
  SAHIL123: { name: "Sahil", team: "Jenna Morrh Warriors" },
};

/** Fantasy team names in the 2026 league */
export const FANTASY_TEAM_NAMES = Object.keys(TEAM_ROLES);
