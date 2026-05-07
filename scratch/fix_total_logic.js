
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
  if (header === "Ankit's Team" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length; j++) {
       if (labels[j] === "Points") { pointsIdx = j; break; }
    }
    
    console.log(`Fixing Total for Team: ${header}`);
    let playerSum = 0;
    let mstCosts = 0;
    let totalRowIdx = -1;

    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const name = row[i];
      if (!name) continue;
      
      if (name === "TOTAL") {
        totalRowIdx = r;
      } else if (name === "MST Costs") {
        mstCosts = parseFloat(row[pointsIdx]) || 0;
      } else {
        playerSum += parseFloat(row[pointsIdx]) || 0;
      }
    }
    
    if (totalRowIdx !== -1) {
      const newTotal = playerSum + mstCosts;
      console.log(`  Player Sum: ${playerSum}`);
      console.log(`  MST Costs: ${mstCosts}`);
      console.log(`  New Total: ${newTotal}`);
      rows[totalRowIdx][pointsIdx] = newTotal;
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ TOTAL corrected in data.xlsx");
