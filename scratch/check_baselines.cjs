
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const playersToCheck = [
  "Vaibhav Sooryavanshi",
  "Varun Chakravarthy",
  "Trent Boult",
  "Sai Sudharsan",
  "Sanju Samson",
  "Mitchell Marsh",
  "Dhruv Jurel",
  "Jasprit Bumrah"
];

const results = {};

for (let i = 0; i < headers.length; i++) {
  if (labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    if (pointsIdx !== -1) {
      for (let r = 2; r < rows.length; r++) {
        const rawName = rows[r][i];
        if (!rawName) continue;
        const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        if (playersToCheck.includes(cleanName)) {
          if (!results[cleanName]) results[cleanName] = [];
          results[cleanName].push({
            team: headers[i],
            points: rows[r][pointsIdx]
          });
        }
      }
    }
  }
}

console.log(JSON.stringify(results, null, 2));
