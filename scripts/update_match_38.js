
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match38Points = {
  // LSG
  "Mohsin Khan": 216,
  "Rishabh Pant": 88,
  "Aiden Markram": 77,
  "George Linde": 58,
  "Ayush Badoni": 48,
  "Himmat Singh": 43,
  "Mohammed Shami": 41,
  "Prince Yadav": 28,
  "Nicholas Pooran": 17,
  "Digvesh Rathi": 16,
  "Mitchell Marsh": 14,
  "Mukul Choudhary": 13,
  
  // KKR
  "Rinku Singh": 197,
  "Cameron Green": 110,
  "Vaibhav Arora": 90,
  "Varun Chakravarthy": 84,
  "Sunil Narine": 74,
  "Kartik Tyagi": 54,
  "Anukul Roy": 46,
  "Angkrish Raghuvanshi": 17,
  "Ajinkya Rahane": 16,
  "Rovman Powell": 13,
  "Tim Seifert": 10,
  "Ramandeep Singh": 4
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

const foundPlayers = new Set();
let addedPointsCount = 0;

discoveredTeams.forEach(team => {
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    if (rawName.includes("(Out)")) continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim();
    const matchPoints = match38Points[cleanName] || 0;
    
    if (matchPoints > 0) {
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints + matchPoints;
      addedPointsCount++;
      foundPlayers.add(cleanName);
      console.log(`Added ${matchPoints} to ${cleanName} for ${team.name}`);
    }
  }
  
  // Update TOTAL row in Excel
  let rawSum = 0;
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    if (row[team.playerCol] === "TOTAL") {
       row[team.pointsCol] = rawSum;
       break;
    }
    if (row[team.playerCol]) {
       rawSum += parseFloat(row[team.pointsCol]) || 0;
    }
  }
});

// Log players from screenshot who were NOT found in any team
Object.keys(match38Points).forEach(playerName => {
  if (!foundPlayers.has(playerName)) {
    console.log(`[LOG] Player ${playerName} not found in any fantasy team database.`);
  }
});

console.log(`Total point assignments made: ${addedPointsCount}`);

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ Match 38 points applied to data.xlsx");
