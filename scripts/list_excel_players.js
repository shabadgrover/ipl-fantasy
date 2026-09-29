import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const playerNames = new Set();

for (let r = 2; r < rows.length; r++) {
  const row = rows[r];
  for (let c = 0; c < row.length; c++) {
    if (labels[c] === "Player Name") {
      const val = row[c];
      if (val && val !== "TOTAL" && val !== "MST Costs") {
        const cleanName = val.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        playerNames.add(cleanName);
      }
    }
  }
}

console.log("DRAFTED PLAYERS IN EXCEL (" + playerNames.size + "):");
console.log(Array.from(playerNames).sort());
