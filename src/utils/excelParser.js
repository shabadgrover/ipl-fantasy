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
  "Ankit's Team": { 
    phase1Captain: "Virat Kohli", phase1ViceCaptain: "Trent Boult",
    phase2Captain: "Virat Kohli", phase2ViceCaptain: "Sai Sudharsan",
    captainChangeMatch: 37
  },
  "shabad's Team": { 
    phase1Captain: "Shubman Gill", phase1ViceCaptain: "Yashasvi Jaiswal",
    phase2Captain: "Shubman Gill", phase2ViceCaptain: "Yashasvi Jaiswal"
  },
  "Aizen": { 
    phase1Captain: "Varun Chakravarthy", phase1ViceCaptain: "Ishan Kishan",
    phase2Captain: "Vaibhav Sooryavanshi", phase2ViceCaptain: "Ishan Kishan",
    captainChangeMatch: 37
  },
  "Jenna Morrh Warriors": { 
    phase1Captain: "Ruturaj Gaikwad", phase1ViceCaptain: "Hardik Pandya",
    phase2Captain: "Ruturaj Gaikwad", phase2ViceCaptain: "Hardik Pandya"
  },
  "Piyush dhiman's Team": { 
    phase1Captain: "Suryakumar Yadav", phase1ViceCaptain: "Kagiso Rabada",
    phase2Captain: "Suryakumar Yadav", phase2ViceCaptain: "Kagiso Rabada"
  },
  "Maat maro shota bacha hu": { 
    phase1Captain: "Shreyas Iyer", phase1ViceCaptain: "Marco Jansen",
    phase2Captain: "Shreyas Iyer", phase2ViceCaptain: "Marco Jansen"
  },
  "GURI XI": { 
    phase1Captain: "Dewald Brevis", phase1ViceCaptain: "Jasprit Bumrah",
    phase2Captain: "Dewald Brevis", phase2ViceCaptain: "Dhruv Jurel",
    captainChangeMatch: 37
  },
  "Deepanshuu's Team": { 
    phase1Captain: "Jos Buttler", phase1ViceCaptain: "Mitchell Marsh",
    phase2Captain: "Jos Buttler", phase2ViceCaptain: "Sanju Samson",
    captainChangeMatch: 37
  },
  "Sumit's Team": { 
    phase1Captain: "Rishabh Pant", phase1ViceCaptain: "Abhishek Sharma",
    phase2Captain: "Rishabh Pant", phase2ViceCaptain: "Abhishek Sharma"
  }
};

// Points at the end of Match 36 (Phase 1)
const phase1Baselines = {
  "Vaibhav Sooryavanshi": 791,
  "Varun Chakravarthy": 258,
  "Trent Boult": 69,
  "Sai Sudharsan": 487,
  "Sanju Samson": 611,
  "Mitchell Marsh": 418,
  "Dhruv Jurel": 587,
  "Jasprit Bumrah": 243
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
      for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
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
    let mstCost = 0;
    
    const roles = teamRoles[base.name] || {};
    
    // Rows start from index 2 (after header and labels)
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

      const isCaptain = rawName.includes("(C)");
      const isVC = rawName.includes("(VC)");
      const isOut = rawName.includes("(Out)");
      const isNew = rawName.includes("(New)");

      const cleanName = rawName
        .replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "")
        .trim();
      
      // Fallback to teamRoles if no marker is present in Excel
      const roles = teamRoles[base.name] || {};
      
      // Split Scoring Logic:
      // Apply Phase 1 multiplier to baseline points (up to Match 36)
      // Apply Phase 2 multiplier to points earned thereafter (Match 37+)
      const p1Baseline = phase1Baselines[cleanName] || 0;
      
      const p1Cap = roles.phase1Captain;
      const p1VC = roles.phase1ViceCaptain;
      const p2Cap = roles.phase2Captain;
      const p2VC = roles.phase2ViceCaptain;
      
      const isP1Cap = isCaptain || (cleanName === p1Cap);
      const isP1VC = isVC || (cleanName === p1VC);
      const isP2Cap = isCaptain || (cleanName === p2Cap);
      const isP2VC = isVC || (cleanName === p2VC);
      
      const multP1 = isP1Cap ? 2 : (isP1VC ? 1.5 : 1);
      const multP2 = isP2Cap ? 2 : (isP2VC ? 1.5 : 1);
      
      const pointsP1 = Math.min(basePoints, p1Baseline) * multP1;
      const pointsP2 = Math.max(0, basePoints - p1Baseline) * multP2;
      
      const finalPoints = Math.round(pointsP1 + pointsP2);
      
      // Determine CURRENT roles for display (Phase 1 for now, as only 36 matches are completed)
      const currentIsCaptain = isP1Cap;
      const currentIsVC = isP1VC;
      const currentMultiplier = multP1;
      
      const iplTeamRaw = row[base.iplCol] || "";
      const iplTeam = normalizeTeamName(iplTeamRaw);
      
      players.push({
        name: cleanName,
        rawName: rawName,
        iplTeam: iplTeam,
        iplAbbr: iplTeamMap[iplTeam] || iplTeam,
        basePoints,
        multiplier: currentMultiplier,
        finalPoints,
        isCaptain: currentIsCaptain, 
        isVC: currentIsVC,
        isOut: isOut,
        isNew: isNew,
        phase: isNew ? "phase2" : "phase1",
        phase1Captain: isP1Cap,
        phase1ViceCaptain: isP1VC,
        phase2Captain: isP2Cap,
        phase2ViceCaptain: isP2VC,
      });
      calculatedTotal += finalPoints;
    }
    
    teams.push({
      id: base.name,
      teamName: base.name,
      players,
      mstCost,
      totalPoints: calculatedTotal,
      roles: teamRoles[base.name] || {},
      isUser: false
    });
  });

  return teams;
};
