
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
  if (labels[i] === "Player Name") {
    for (let r = 2; r < rows.length; r++) {
      const name = rows[r][i];
      if (name && name.includes("Rasikh")) {
        console.log(`Found: "${name}" at row ${r+1}, col ${i+1}`);
      }
    }
  }
}
