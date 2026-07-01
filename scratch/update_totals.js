import * as XLSX from 'xlsx';
import * as fs from 'fs';

const finalTotals = {
  "shabad's Team": 10483.5,
  "Sumit's Team": 10440.5,
  "Deepanshuu's Team": 10329.5,
  "Piyush dhiman's Team": 9391.5,
  "Ankit's Team": 9074,
  "Aizen": 9029,
  "Maat maro shota bacha hu": 7348.5,
  "Jenna Morrh Warriors": 7036,
  "GURI XI": 6965.5
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const teamsInfo = [];
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    let pointsCol = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsCol = j;
    }
    if (pointsCol !== -1) {
      teamsInfo.push({
        name: header.trim(),
        playerCol: i,
        pointsCol: pointsCol
      });
    }
  }
}

for (let r = 2; r < rows.length; r++) {
  const row = rows[r];
  for (const team of teamsInfo) {
    if (row[team.playerCol] === "TOTAL") {
      if (finalTotals[team.name] !== undefined) {
        row[team.pointsCol] = finalTotals[team.name];
        console.log(`Updated ${team.name} to ${finalTotals[team.name]}`);
      }
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Corrected totals applied to data.xlsx");
