import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
let rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const sumitCol = headers.indexOf("Sumit's Team");
if (sumitCol !== -1) {
  // Find IPL team and points col for sumit
  let iplCol = -1, pointsCol = -1;
  for (let k = sumitCol; k < labels.length && (k === sumitCol || !headers[k]); k++) {
    if (labels[k] === "IPL Team") iplCol = k;
    if (labels[k] === "Points") pointsCol = k;
  }

  // Find where to insert (before TOTAL and before MST Costs)
  let insertIdx = -1;
  for (let i = 2; i < rows.length; i++) {
    if (rows[i][sumitCol] === "TOTAL" || rows[i][sumitCol] === "MST Costs") {
      insertIdx = i;
      break;
    }
  }

  if (insertIdx !== -1) {
    // We can just shift rows down for Sumit's columns starting from insertIdx
    let endCol = sumitCol + 1;
    while (endCol < headers.length && !headers[endCol]) endCol++;

    // Ensure we have an empty row to use
    if (!rows[rows.length - 1][0]) {
      // Just add a row at the end if needed, though we can just splice a new row
    }

    // Since we only want to shift the columns for ONE team, we must do it manually
    // Add a new row at the bottom if the last row isn't empty enough
    const newRow = new Array(headers.length).fill("");
    rows.push(newRow);

    for (let r = rows.length - 1; r > insertIdx; r--) {
      for (let c = sumitCol; c < endCol; c++) {
        rows[r][c] = rows[r-1][c];
      }
    }

    // Now insert Mohammed Siraj at insertIdx
    for (let c = sumitCol; c < endCol; c++) rows[insertIdx][c] = ""; // clear first
    rows[insertIdx][sumitCol] = "Mohammed Siraj";
    if (iplCol !== -1) rows[insertIdx][iplCol] = "RCB";
    if (pointsCol !== -1) rows[insertIdx][pointsCol] = 410;

    // Recalculate TOTAL
    let rawSum = 0;
    let totalRowIdx = -1;
    for (let i = 2; i < rows.length; i++) {
      if (rows[i][sumitCol] === "TOTAL") {
        totalRowIdx = i;
        break;
      }
      if (rows[i][sumitCol]) {
        rawSum += parseFloat(rows[i][pointsCol]) || 0;
      }
    }
    if (totalRowIdx !== -1) {
      rows[totalRowIdx][pointsCol] = rawSum;
    }

    console.log("Restored Mohammed Siraj (410 pts) to Sumit's Team");
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ Fix applied.");
