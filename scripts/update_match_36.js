import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match36Points = {
  // RR
  "Vaibhav Sooryavanshi": 223,
  "Donovan Ferreira": 119,
  "Dhruv Jurel": 111,
  "Jofra Archer": 100,
  "Brijesh Sharma": 86,
  "Yashasvi Jaiswal": 22,
  "Shimron Hetmyer": 19,
  "Ravindra Jadeja": 16,
  "Nandre Burger": 16,
  "Ravi Bishnoi": 14,
  "Riyan Parag": 11,
  "Tushar Deshpande": 8,
  
  // SRH
  "Ishan Kishan": 156,
  "Abhishek Sharma": 127,
  "Nitish Kumar Reddy": 122,
  "Eshan Malinga": 86,
  "Heinrich Klaasen": 71,
  "Pat Cummins": 70,
  "Sakib Hussain": 48,
  "Praful Hinge": 46,
  "Salil Arora": 18,
  "Travis Head": 16,
  "Aniket Verma": 13,
  "Shivang Kumar": 4
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

let addedPointsCount = 0;

discoveredTeams.forEach(team => {
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    // Check if player is transferred out
    if (rawName.includes("(Out)")) continue; // DO NOT add points to transferred out players

    // Clean name for lookup
    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim();
    const matchPoints = match36Points[cleanName] || 0;
    
    if (matchPoints > 0) {
      // Update raw points in Excel
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints + matchPoints;
      addedPointsCount++;
      console.log(`Added ${matchPoints} to ${cleanName} for ${team.name}`);
    }
  }
  
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

console.log(`Total point assignments made: ${addedPointsCount}`);

// Write back to Excel
const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ Match 36 points applied to data.xlsx");
