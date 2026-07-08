import * as XLSX from 'xlsx';
import * as fs from 'fs';

const correctTeamMap = {
  "devdutt padikkal": "Royal Challengers Bengaluru",
  "sarfaraz khan": "Chennai Super Kings",
  "sameer rizvi": "Delhi Capitals",
  "pathum nissanka": "Delhi Capitals",
  "rovman powell": "Kolkata Knight Riders",
  "nitish rana": "Delhi Capitals",
  "cooper connolly": "Punjab Kings",
  "jamie overton": "Chennai Super Kings",
  "romario shepherd": "Royal Challengers Bengaluru",
  "harsh dubey": "Sunrisers Hyderabad",
  "naman dhir": "Mumbai Indians",
  "xavier bartlett": "Punjab Kings",
  "am ghazanfar": "Mumbai Indians",
  "anshul kamboj": "Chennai Super Kings",
  "rasikh dar salam": "Royal Challengers Bengaluru",
  "kartik tyagi": "Kolkata Knight Riders",
  "eshan malinga": "Sunrisers Hyderabad",
  "prince yadav": "Lucknow Super Giants",
  "nandre burger": "Rajasthan Royals",
  "suyash sharma": "Royal Challengers Bengaluru",
  "akeal hosein": "Chennai Super Kings",
  "sakib hussain": "Sunrisers Hyderabad"
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
          const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim().toLowerCase();
          
          if (correctTeamMap[cleanName]) {
             const oldIpl = rows[r][iplIdx];
             rows[r][iplIdx] = correctTeamMap[cleanName];
             if (oldIpl !== correctTeamMap[cleanName]) {
               console.log(`Re-mapped ${cleanName}: ${oldIpl || 'None'} -> ${correctTeamMap[cleanName]}`);
               updatedCount++;
             }
          } else {
             // In case there is someone not on the list
             console.log(`Warning: ${cleanName} not found in user map!`);
          }
        }
      }
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log(`Successfully corrected ${updatedCount} players based on user map.`);
