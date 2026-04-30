
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match41Points = {
  "Ryan Rickelton": 239,
  "Will Jacks": 110,
  "Hardik Pandya": 109,
  "AM Ghazanfar": 76,
  "Trent Boult": 56,
  "Naman Dhir": 38,
  "Suryakumar Yadav": 21,
  "Tilak Varma": 17,
  "Jasprit Bumrah": 10,
  "Robin Minz": 5,
  "Shardul Thakur": 4,
  "Ashwani Kumar": -2,
  "Travis Head": 164,
  "Heinrich Klaasen": 153,
  "Abhishek Sharma": 101,
  "Salil Arora": 72,
  "Praful Hinge": 68,
  "Nitish Kumar Reddy": 65,
  "Eshan Malinga": 48,
  "Sakib Hussain": 36,
  "Pat Cummins": 14,
  "Harsh Dubey": 14,
  "Ishan Kishan": 10,
  "Aniket Verma": 4
};

const teamRoles = {
  "Ankit's Team": { captain: "Virat Kohli", viceCaptain: "Sai Sudharsan" },
  "shabad's Team": { captain: "Shubman Gill", viceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { captain: "Vaibhav Sooryavanshi", viceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { captain: "Ruturaj Gaikwad", viceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { captain: "Suryakumar Yadav", viceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { captain: "Shreyas Iyer", viceCaptain: "Marco Jansen" },
  "GURI XI": { captain: "Dewald Brevis", viceCaptain: "Dhruv Jurel" },
  "Deepanshuu's Team": { captain: "Jos Buttler", viceCaptain: "Sanju Samson" },
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

const currentMatchMultipliedAddition = {};

discoveredTeams.forEach(team => {
  let multipliedAddition = 0;
  const roles = teamRoles[team.name] || {};
  
  console.log(`\n--- Processing ${team.name} ---`);
  
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    if (rawName.includes("(Out)")) continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
    const matchPoints = match41Points[cleanName] || 0;
    
    if (matchPoints !== 0) {
      // Update Excel with RAW points
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints + matchPoints;
      
      // Calculate MULTIPLIED points for our logs/progression
      const isCaptain = cleanName === roles.captain;
      const isVC = cleanName === roles.viceCaptain;
      const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
      multipliedAddition += matchPoints * multiplier;
      
      console.log(`Added ${matchPoints} raw points to ${cleanName} (Multiplied: ${matchPoints * multiplier})`);
    } else {
        // If player has points in our map but is 0, they might not be playing but we should still check if they are in the team roles
    }
  }
  
  currentMatchMultipliedAddition[team.name] = multipliedAddition;

  // Update TOTAL row in Excel (Sum of raw points + MST Costs)
  let rawPlayerSum = 0;
  let mstCosts = 0;
  let totalRowIdx = -1;

  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const name = row[team.playerCol];
    if (!name) continue;
    
    if (name === "TOTAL") {
      totalRowIdx = r;
    } else if (name === "MST Costs") {
      mstCosts = parseFloat(row[team.pointsCol]) || 0;
    } else {
      rawPlayerSum += parseFloat(row[team.pointsCol]) || 0;
    }
  }
  
  if (totalRowIdx !== -1) {
    rows[totalRowIdx][team.pointsCol] = rawPlayerSum + mstCosts;
  }
});

console.log("\nMatch 41 Multiplied Additions (for Progression Graph):");
console.log(JSON.stringify(currentMatchMultipliedAddition, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 41 points applied to data.xlsx");
