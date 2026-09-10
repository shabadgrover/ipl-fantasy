
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header === "Aizen" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length; j++) {
       if (labels[j] === "Points") { pointsIdx = j; break; }
    }
    
    console.log(`Team: ${header}`);
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const name = row[i];
      if (name === "MST Costs") {
        console.log(`  MST Costs: ${row[pointsIdx]}`);
      }
    }
    console.log(`  Excel TOTAL: ${rows[rows.length-1][pointsIdx]}`); // This might be wrong if TOTAL is not last
  }
}
