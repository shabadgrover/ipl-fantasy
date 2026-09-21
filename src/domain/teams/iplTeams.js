export const IPL_TEAM_MAP = {
  "Sunrisers Hyderabad": "SRH",
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Punjab Kings": "PBKS",
  "Gujarat Titans": "GT",
  "Delhi Capitals": "DC",
  "Kolkata Knight Riders": "KKR",
  "Rajasthan Royals": "RR",
  "Lucknow Super Giants": "LSG",
  "Royal Challengers Bengaluru": "RCB",
};

/** @deprecated Use IPL_TEAM_MAP — kept for existing import paths */
export const iplTeamMap = IPL_TEAM_MAP;

/**
 * Normalizes IPL franchise names from Excel / external sources.
 * @param {string} name
 * @returns {string}
 */
export const normalizeTeamName = (name) => {
  if (!name) return "";
  const n = name.trim().toLowerCase();
  if (n === "rcb" || n.includes("royal challengers") || n.includes("bangluru") || n.includes("bangalore")) {
    return "Royal Challengers Bengaluru";
  }
  return name.trim();
};

/**
 * @param {string} iplTeam
 * @returns {string}
 */
export const getIplAbbr = (iplTeam) => IPL_TEAM_MAP[iplTeam] || iplTeam;
