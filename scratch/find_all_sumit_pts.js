
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const teamName = "Sumit's Team";
let playerCol = -1;
let pointsCol = -1;

for (let i = 0; i < headers.length; i++) {
  if (headers[i] === teamName && labels[i] === "Player Name") {
    playerCol = i;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsCol = j;
    }
    break;
  }
}

if (playerCol !== -1) {
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const name = row[playerCol];
    const pts = row[pointsCol];
    if (pts !== undefined && pts !== null && pts !== "") {
        console.log(`Row ${r}: Name: [${name}], Points: [${pts}]`);
    }
  }
}
