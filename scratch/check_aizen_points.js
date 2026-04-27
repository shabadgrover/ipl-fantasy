
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match38Points = {
  "Cameron Green": 110,
  "Varun Chakravarthy": 84,
  "Ajinkya Rahane": 16
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
  if (headers[i] === "Aizen") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    for (let r = 2; r < rows.length; r++) {
       const rawName = rows[r][i];
       if (!rawName) continue;
       const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
       if (match38Points[cleanName]) {
         console.log(`${cleanName}: ${rows[r][pointsIdx]}`);
       }
    }
  }
}
