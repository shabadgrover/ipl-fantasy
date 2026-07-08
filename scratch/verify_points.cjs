
const XLSX = require('xlsx');

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

const MOM_BONUSES = {
    "Yashasvi Jaiswal": 50,
    "Sanju Samson": 50,
    "Vaibhav Sooryavanshi": 50,
    "Rashid Khan": 50,
    "Mohammed Shami": 50,
    "Tim David": 50,
    "Jacob Duffy": 50,
    "Shardul Thakur": 50,
    "Nandre Burger": 50,
    "Cooper Connolly": 50,
    "Sameer Rizvi": 100, // Two matches
    "Nitish Kumar Reddy": 50,
    "Piyansh Arya": 50,
    "Ravi Bishnoi": 50,
    "Mukul Choudhary": 50,
    "Shreyas Iyer": 50
};

const workbook = XLSX.readFile('public/data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const discoveredTeams = [];
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
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
        pointsCol: pointsIdx
      });
    }
  }
}

const results = discoveredTeams.map(base => {
  let total = 0;
  const roles = teamRoles[base.name] || {};
  const players = [];

  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawName = row[base.playerCol];
    if (!rawName || rawName === "TOTAL") continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
    const isCaptain = rawName.includes("(C)") || cleanName === roles.captain;
    const isVC = rawName.includes("(VC)") || cleanName === roles.viceCaptain;
    const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
    const points = parseInt(row[base.pointsCol]) || 0;
    
    let bonus = 0;
    // We don't know if MOM bonuses are already in spreadsheet or need to be added.
    // Let's assume they might be added separately if the total doesn't match.

    total += points * multiplier;
    players.push({ name: cleanName, points, multiplier, total: points * multiplier });
  }

  return { name: base.name, total };
});

console.log(JSON.stringify(results, null, 2));
