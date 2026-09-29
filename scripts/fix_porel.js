import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const teamIdx = 25; // "Maat maro shota bacha hu"
let fixed = false;

for (let r = 2; r < rows.length; r++) {
  const name = rows[r][teamIdx];
  if (name === "Abishek Porel") {
    rows[r][teamIdx] = "Abishek Porel (Out)";
    fixed = true;
    console.log(`Fixed: Abishek Porel -> Abishek Porel (Out) at Row ${r}`);
  }
}

if (fixed) {
  const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
  workbook.Sheets[sheetName] = newWorksheet;
  XLSX.writeFile(workbook, './public/data.xlsx');
  console.log("Excel updated successfully.");
} else {
  console.log("Abishek Porel not found in Maat maro team column.");
}
