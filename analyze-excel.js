import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
  const fileBuffer = fs.readFileSync('cricket_spirit_ipl26_Teams_2026-03-29.xlsx');
  const workbook = XLSX.read(fileBuffer);
  
  const result = {};
  workbook.SheetNames.forEach(sheetName => {
    const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length) result[sheetName] = roa;
  });
  
  console.log("Successfully parsed excel sheets:", Object.keys(result));
  fs.writeFileSync('excel-data.json', JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Error reading excel file:", error.message);
}
