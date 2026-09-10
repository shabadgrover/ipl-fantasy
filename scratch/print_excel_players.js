import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const players = new Set();

for (let i = 0; i < headers.length; i++) {
  if (headers[i] && labels[i] === "Player Name") {
    for (let r = 2; r < rows.length; r++) {
      const rawName = rows[r][i];
      if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
      const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
      players.add(cleanName);
    }
  }
}

console.log(JSON.stringify(Array.from(players).sort(), null, 2));
