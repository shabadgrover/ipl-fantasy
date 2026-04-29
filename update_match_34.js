import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match34Points = {
  "Virat Kohli": 159,
  "Devdutt Padikkal": 127,
  "Josh Hazlewood": 70,
  "Krunal Pandya": 55,
  "Bhuvneshwar Kumar": 48,
  "Suyash Sharma": 44,
  "Jacob Bethell": 32,
  "Jitesh Sharma": 24,
  "Tim David": 20,
  "Rajat Patidar": 18,
  "Rasikh Salam": 10,
  "Romario Shepherd": 4,
  "Sai Sudharsan": 200,
  "Jason Holder": 105,
  "Rashid Khan": 80,
  "Shubman Gill": 56,
  "Mohammed Siraj": 52,
  "Jos Buttler": 51,
  "Manav Suthar": 50,
  "Washington Sundar": 45,
  "Kagiso Rabada": 14,
  "M Shahrukh Khan": 12,
  "Rahul Tewatia": 4,
  "Prasidh Krishna": 0
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
    const matchPoints = match34Points[cleanName] || 0;
    
    // Update raw points in Excel
    const currentPoints = parseFloat(row[team.pointsCol]) || 0;
    row[team.pointsCol] = currentPoints + matchPoints;
    
    // Calculate total with multipliers
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

console.log("Updated Totals (Match 34):");
console.log(JSON.stringify(newTotals, null, 2));
