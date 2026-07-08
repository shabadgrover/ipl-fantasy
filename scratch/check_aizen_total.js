
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
    let sum = 0;
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const name = row[i];
      if (name && name !== "TOTAL" && name !== "MST Costs") {
        const p = parseFloat(row[pointsIdx]) || 0;
        sum += p;
      }
      if (name === "TOTAL") {
        console.log(`  Excel TOTAL: ${row[pointsIdx]}`);
      }
    }
    console.log(`  Calculated Sum (All): ${sum}`);
    
    let sumActive = 0;
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const name = row[i];
      if (name && name !== "TOTAL" && name !== "MST Costs" && !name.includes("(Out)")) {
        const p = parseFloat(row[pointsIdx]) || 0;
        sumActive += p;
      }
    }
    console.log(`  Calculated Sum (Active Only): ${sumActive}`);
  }
}
