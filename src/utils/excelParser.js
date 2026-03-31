import * as XLSX from 'xlsx';

export const iplTeamMap = {
  "Sunrisers Hyderabad": "SRH",
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Punjab Kings": "PBKS",
  "Gujarat Titans": "GT",
  "Delhi Capitals": "DC",
  "Kolkata Knight Riders": "KKR",
  "Rajasthan Royals": "RR",
  "Lucknow Super Giants": "LSG",
  "Royal Challengers Bengaluru": "RCB"
};

const normalizeTeamName = (name) => {
  if (!name) return "";
  const n = name.trim().toLowerCase();
  if (n === "rcb" || n.includes("royal challengers") || n.includes("bangluru") || n.includes("bangalore")) {
    return "Royal Challengers Bengaluru";
  }
  return name.trim();
};

const teamRoles = {
  "Ankit's Team": { captain: "Virat Kohli", viceCaptain: "Trent Boult" },
  "shabad's Team": { captain: "Shubman Gill", viceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { captain: "Varun Chakravarthy", viceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { captain: "Ruturaj Gaikwad", viceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { captain: "Suryakumar Yadav", viceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { captain: "Shreyas Iyer", viceCaptain: "Marco Jansen" },
  "GURI XI": { captain: "Dewald Brevis", viceCaptain: "Jasprit Bumrah" },
  "Deepanshuu's Team": { captain: "Jos Buttler", viceCaptain: "Mitchell Marsh" },
  "Sumit's Team": { captain: "Rishabh Pant", viceCaptain: "Abhishek Sharma" }
};

export const parseExcelData = (arrayBuffer) => {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Use header: 1 to get raw rows for discovery
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (rows.length < 2) return [];

  const headers = rows[0];
  const labels = rows[1];
  
  // Discover Teams Dynamically
  const discoveredTeams = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    // A team header is non-empty and has "Player Name" in labels at the same index
    if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
      // Find the "IPL Team" and "Points" columns for this team block
      let iplIdx = -1;
      let pointsIdx = -1;
      
      // Look ahead for "IPL Team" and "Points" until the next team header
      for (let j = i; j < headers.length && (j === i || !headers[j]); j++) {
        if (labels[j] === "IPL Team") iplIdx = j;
        if (labels[j] === "Points") pointsIdx = j;
      }

      if (pointsIdx !== -1) {
        discoveredTeams.push({
          name: header.trim(),
          playerCol: i,
          iplCol: iplIdx,
          pointsCol: pointsIdx
        });
      }
    }
  }

  const teams = [];

  discoveredTeams.forEach(base => {
    const players = [];
    let calculatedTotal = 0;
    
    const roles = teamRoles[base.name] || {};
    
    // Rows start from index 2 (after header and labels)
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      const rawName = row[base.playerCol];
      
      if (!rawName || rawName === "TOTAL") continue; 

      const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
      
      const isCaptain = cleanName === roles.captain;
      const isVC = cleanName === roles.viceCaptain;
      const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
      
      const iplTeamRaw = row[base.iplCol] || "";
      const iplTeam = normalizeTeamName(iplTeamRaw);
      const basePoints = parseInt(row[base.pointsCol]) || 0;
      const finalPoints = basePoints * multiplier;
      
      players.push({
        name: cleanName,
        rawName: rawName,
        iplTeam: iplTeam,
        iplAbbr: iplTeamMap[iplTeam] || iplTeam,
        basePoints,
        multiplier,
        finalPoints,
        isCaptain,
        isVC
      });
      calculatedTotal += finalPoints;
    }
    
    teams.push({
      id: base.name,
      teamName: base.name,
      players,
      totalPoints: calculatedTotal,
      isUser: false
    });
  });

  return teams;
};
