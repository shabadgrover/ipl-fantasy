import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

function getPointsCol(teamCol) {
  for (let k = teamCol; k < labels.length && (k === teamCol || !headers[k]); k++) {
    if (labels[k] === "Points") return k;
  }
  return -1;
}

// Helper to recalculate total
function recalcTotal(teamCol) {
  const pointsCol = getPointsCol(teamCol);
  if (pointsCol === -1) return;

  let rawSum = 0;
  let totalRowIdx = -1;
  for (let i = 2; i < rows.length; i++) {
    if (rows[i][teamCol] === "TOTAL") {
      totalRowIdx = i;
      break;
    }
    if (rows[i][teamCol]) {
      rawSum += parseFloat(rows[i][pointsCol]) || 0;
    }
  }
  if (totalRowIdx !== -1) {
    rows[totalRowIdx][pointsCol] = rawSum;
  }
}

// 1. FIX MAAT MAARO TEAM (Aqib Nabi, Abhishek Porel)
const maatCol = headers.indexOf("Maat maro shota bacha hu");
if (maatCol !== -1) {
  for (let i = 2; i < rows.length; i++) {
    const cell = rows[i][maatCol];
    if (typeof cell === 'string') {
      if ((cell.includes("Aqib Nabi") || cell.includes("Auqib Nabi")) && !cell.includes("(Out)")) {
        rows[i][maatCol] = cell + " (Out)";
        console.log("Marked Aqib/Auqib Nabi as Out");
      }
      if (cell.includes("Abhishek Porel") && !cell.includes("(Out)")) {
        rows[i][maatCol] = cell + " (Out)";
        console.log("Marked Abhishek Porel as Out");
      }
    }
  }
}

// 2. FIX AIZEN MST COST
const aizenCol = headers.indexOf("Aizen");
if (aizenCol !== -1) {
  const pointsCol = getPointsCol(aizenCol);
  let mstCostFound = false;
  let totalRowIdx = -1;
  
  for (let i = 2; i < rows.length; i++) {
    if (rows[i][aizenCol] === "TOTAL") totalRowIdx = i;
    if (rows[i][aizenCol] === "MST Costs") {
      rows[i][pointsCol] = -200;
      mstCostFound = true;
      console.log("Updated Aizen MST Cost to -200");
    }
  }
  
  if (!mstCostFound && totalRowIdx !== -1) {
    const costRow = new Array(headers.length).fill("");
    costRow[aizenCol] = "MST Costs";
    costRow[pointsCol] = -200;
    rows.splice(totalRowIdx, 0, costRow);
    console.log("Inserted Aizen MST Cost -200");
  }
  recalcTotal(aizenCol);
}

// 3. REMOVE HARSHIT RANA (Sumit)
const sumitCol = headers.indexOf("Sumit's Team");
if (sumitCol !== -1) {
  for (let i = 2; i < rows.length; i++) {
    const cell = rows[i][sumitCol];
    if (typeof cell === 'string' && cell.includes("Harshit Rana")) {
      // Clear the player
      rows[i][sumitCol] = "";
      const pointsCol = getPointsCol(sumitCol);
      if (pointsCol !== -1) rows[i][pointsCol] = "";
      
      // Also shift cells up for just this team's columns so there is no blank gap
      // Find end of this team's columns
      let endCol = sumitCol + 1;
      while (endCol < headers.length && !headers[endCol]) endCol++;
      
      // Shift up
      for (let r = i; r < rows.length - 1; r++) {
        if (rows[r][sumitCol] === "TOTAL" || rows[r+1][sumitCol] === "TOTAL") break; // Stop at TOTAL
        for (let c = sumitCol; c < endCol; c++) {
          rows[r][c] = rows[r+1][c];
        }
      }
      // The row right before TOTAL needs to be cleared for this team
      let totIdx = rows.findIndex(row => row[sumitCol] === "TOTAL");
      if (totIdx !== -1 && totIdx > 2) {
         for (let c = sumitCol; c < endCol; c++) {
            rows[totIdx - 1][c] = "";
         }
      }
      
      console.log("Removed Harshit Rana from Sumit's Team");
      break;
    }
  }
  recalcTotal(sumitCol);
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ Corrections applied.");
