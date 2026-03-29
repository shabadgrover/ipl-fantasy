import * as XLSX from 'xlsx';
import fs from 'fs';

const buf = fs.readFileSync('d:/ipl26/public/cricket_spirit_ipl26_Teams_2026-03-29.xlsx');
const workbook = XLSX.read(buf, { type: 'buffer' });
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
const result = {
  headers: rows[0],
  row1: rows[1],
  row2: rows[2]
};

fs.writeFileSync('d:/ipl26/excel_structure.json', JSON.stringify(result, null, 2));
console.log('Done writing structure to excel_structure.json');
