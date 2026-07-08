import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match35Points = {
  "KL Rahul": 298,
  "Nitish Rana": 183,
  "Kuldeep Yadav": 92,
  "Axar Patel": 42,
  "Vipraj Nigam": 36,
  "Pathum Nissanka": 23,
  "Sameer Rizvi": 12,
  "David Miller": 7,
  "T Natarajan": 8,
  "Auqib Nabi": 6,
  "Dushmantha Chameera": 4,
  "Lungi Ngidi": 4,
  "Tristan Stubbs": 4,
  "Mukesh Kumar": 0,
  "Prabhsimran Singh": 174,
  "Shreyas Iyer": 153,
  "Priyansh Arya": 97,
  "Nehal Wadhera": 55,
  "Cooper Connolly": 35,
  "Arshdeep Singh": 34,
  "Xavier Bartlett": 30,
  "Marco Jansen": 14,
  "Yuzvendra Chahal": 8,
  "Marcus Stoinis": 8,
  "Shashank Singh": 45,
  "Vijaykumar Vyshak": 6
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

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const discoveredTeams = [];
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    if (pointsIdx !== -1) {
      discoveredTeams.push({
        name: header.trim(),
        playerCol: i,
        pointsCol: pointsIdx
      });
    }
  }
}

const newTotals = {};

discoveredTeams.forEach(team => {
  let teamTotalWithMultipliers = 0;
  const roles = teamRoles[team.name] || {};
  
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL") continue;
    
    const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
    const matchPoints = match35Points[cleanName] || 0;
    
    // Update raw points in Excel
    const currentPoints = parseFloat(row[team.pointsCol]) || 0;
    row[team.pointsCol] = currentPoints + matchPoints;
    
    // Calculate total with multipliers (using cumulative points)
    const isCaptain = rawName.includes("(C)") || cleanName === roles.captain;
    const isVC = rawName.includes("(VC)") || cleanName === roles.viceCaptain;
    const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
    
    teamTotalWithMultipliers += (parseFloat(row[team.pointsCol]) || 0) * multiplier;
  }
  newTotals[team.name] = teamTotalWithMultipliers;
  
  // Update TOTAL row in Excel (just sum of raw points)
  let rawSum = 0;
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    if (row[team.playerCol] === "TOTAL") {
       row[team.pointsCol] = rawSum;
       break;
    }
    if (row[team.playerCol]) {
       rawSum += parseFloat(row[team.pointsCol]) || 0;
    }
  }
});

// Write back to Excel
const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');

console.log("Updated Totals (Match 35):");
console.log(JSON.stringify(newTotals, null, 2));
