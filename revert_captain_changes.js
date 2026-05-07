import * as XLSX from 'xlsx';
import * as fs from 'fs';

const revertScaleMap = {
  // Deepanshu
  "Mitchell Marsh": 1 / 1.5,
  "Sanju Samson": 1.5,
  
  // Ankit
  "Trent Boult": 1 / 1.5,
  "Sai Sudharsan": 1.5,
  
  // Guri
  "Jasprit Bumrah": 1 / 1.5,
  "Dhruv Jurel": 1.5,
  
  // Nitesh
  "Varun Chakravarthy": 1 / 2.0,
  "Vaibhav Sooryavanshi": 2.0
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") {
        pointsIdx = j;
        break;
      }
    }

    if (pointsIdx !== -1) {
      let rawSum = 0;
      let totalRowIdx = -1;
      
      for (let r = 2; r < rows.length; r++) {
        const rawName = rows[r][i];
        if (!rawName) continue;
        
        if (rawName === "TOTAL") {
          totalRowIdx = r;
          continue;
        }

        const currentPoints = parseFloat(rows[r][pointsIdx]) || 0;
        const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        
        if (revertScaleMap[cleanName]) {
          const originalPoints = Math.round(currentPoints * revertScaleMap[cleanName]);
          rows[r][pointsIdx] = originalPoints;
          console.log(`Reverted ${cleanName}: ${currentPoints} -> ${originalPoints}`);
        }
        
        rawSum += parseFloat(rows[r][pointsIdx]) || 0;
      }
      
      if (totalRowIdx !== -1) {
        rows[totalRowIdx][pointsIdx] = rawSum;
      }
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log(`Successfully reverted base points in excel.`);
