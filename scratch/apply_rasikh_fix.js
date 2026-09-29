
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

let correctionMade = false;

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header === "Ankit's Team" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length; j++) {
       if (labels[j] === "Points") { pointsIdx = j; break; }
    }
    
    console.log(`Processing Team: ${header}`);
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const name = row[i];
      if (name && name.toLowerCase().includes("rasikh dar salam")) {
        const currentPoints = parseFloat(row[pointsIdx]) || 0;
        row[pointsIdx] = currentPoints + 38;
        console.log(`  Updated ${name}: ${currentPoints} -> ${row[pointsIdx]}`);
        correctionMade = true;
      }
    }
    
    if (correctionMade) {
        // Update TOTAL row
        let rawSum = 0;
        for (let r = 2; r < rows.length; r++) {
          const row = rows[r];
          if (row[i] === "TOTAL") {
             console.log(`  Updating TOTAL: ${row[pointsIdx]} -> ${rawSum}`);
             row[pointsIdx] = rawSum;
             break;
          }
          if (row[i] && row[i] !== "MST Costs") {
             rawSum += parseFloat(row[pointsIdx]) || 0;
          }
        }
    }
  }
}

if (correctionMade) {
    const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
    workbook.Sheets[sheetName] = newWorksheet;
    XLSX.writeFile(workbook, './public/data.xlsx');
    console.log("✅ Correction applied to data.xlsx");
} else {
    console.log("❌ No correction made. Rasikh Dar Salam not found in Ankit's Team.");
}
