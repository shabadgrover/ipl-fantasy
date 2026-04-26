import * as XLSX from 'xlsx';
import * as fs from 'fs';

const scaleMap = {
  // Deepanshu
  "Mitchell Marsh": 1.5, // Old VC
  "Sanju Samson": 1 / 1.5, // New VC
  
  // Ankit
  "Trent Boult": 1.5, // Old VC
  "Sai Sudharsan": 1 / 1.5, // New VC
  
  // Guri
  "Jasprit Bumrah": 1.5, // Old VC
  "Dhruv Jurel": 1 / 1.5, // New VC
  
  // Nitesh
  "Varun Chakravarthy": 2.0, // Old Captain
  "Vaibhav Sooryavanshi": 1 / 2.0 // New Captain
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

let updatedCount = 0;

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
        
        if (rawName !== "MST Costs") {
          const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
          
          if (scaleMap[cleanName]) {
            const scaledPoints = currentPoints * scaleMap[cleanName];
            rows[r][pointsIdx] = scaledPoints;
            console.log(`Scaled ${cleanName}: ${currentPoints} -> ${scaledPoints}`);
            updatedCount++;
            
            // Remove hardcoded (C) or (VC) from their name if present, 
            // as excelParser will now assign roles dynamically from teamRoles dictionary.
            rows[r][i] = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/gi, " ").trim();
          }
          
          rawSum += parseFloat(rows[r][pointsIdx]) || 0;
        } else {
          rawSum += currentPoints;
        }
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
console.log(`Successfully scaled base points for ${updatedCount} players.`);
