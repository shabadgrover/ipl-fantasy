import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Load MST Player List for lookup
const mstWorkbook = XLSX.read(fs.readFileSync('./MST PLayer List/MST_Player_List.xlsx'));
const mstSheet = mstWorkbook.Sheets[mstWorkbook.SheetNames[0]];
const mstRows = XLSX.utils.sheet_to_json(mstSheet, { header: 1 });
const teamMap = {};
mstRows.forEach(r => {
  if (r[0] && r[1]) teamMap[r[0].trim().toLowerCase()] = r[1].trim();
});

// For any players not explicitly in the list or slight naming variations:
teamMap["jamie overton"] = "Chennai Super Kings";
teamMap["rasikh dar salam"] = "Delhi Capitals";
teamMap["prince yadav"] = "Delhi Capitals";
teamMap["kartik tyagi"] = "Kolkata Knight Riders";
teamMap["sakib hussain"] = "Mumbai Indians";
teamMap["am ghazanfar"] = "Mumbai Indians";

// Load main data
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
    let iplIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "IPL Team") {
        iplIdx = j;
        break;
      }
    }

    if (iplIdx !== -1) {
      for (let r = 2; r < rows.length; r++) {
        const rawName = rows[r][i];
        if (typeof rawName === 'string' && rawName.includes("(New)")) {
          const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim();
          const iplTeam = teamMap[cleanName.toLowerCase()];
          
          if (iplTeam) {
             rows[r][iplIdx] = iplTeam;
             console.log(`Assigned ${iplTeam} to ${cleanName}`);
             updatedCount++;
          } else {
             // Fallback logic
             if (cleanName === "Xavier Bartlett") rows[r][iplIdx] = "Delhi Capitals";
             if (cleanName === "Sarfaraz Khan") rows[r][iplIdx] = "Chennai Super Kings";
             if (cleanName === "Anshul Kamboj") rows[r][iplIdx] = "Chennai Super Kings";
             if (cleanName === "Pathum Nissanka") rows[r][iplIdx] = "Delhi Capitals";
             if (cleanName === "Akeal Hosein") rows[r][iplIdx] = "Chennai Super Kings";
             if (cleanName === "Jason Holder") rows[r][iplIdx] = "Gujarat Titans";
             console.log(`Needs fallback for ${cleanName}`);
             updatedCount++;
          }
        }
      }
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log(`Fixed IPL Teams for ${updatedCount} new players.`);
