import * as XLSX from 'xlsx';
import * as fs from 'fs';

const screenshotPlayers = [
  // SRH
  "Ishan Kishan", "Abhishek Sharma", "Heinrich Klaasen", "Travis Head",
  "Eshan Malinga", "Nitish Kumar Reddy", "Sakib Hussain", "Ravichandran Smaran",
  "Harshal Patel", "Pat Cummins", "Salil Arora", "Shivang Kumar",
  // RCB
  "Venkatesh Iyer", "Krunal Pandya", "Rajat Patidar", "Rasikh Salam",
  "Devdutt Padikkal", "Suyash Sharma", "Virat Kohli", "Tim David",
  "Jordan Cox", "Josh Hazlewood", "Bhuvneshwar Kumar", "Jitesh Sharma",
  "Romario Shepherd"
];

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const labels = rows[1];
const playerNames = new Set();

for (let r = 2; r < rows.length; r++) {
  const row = rows[r];
  for (let c = 0; c < row.length; c++) {
    if (labels[c] === "Player Name") {
      const val = row[c];
      if (val && val !== "TOTAL" && val !== "MST Costs") {
        const cleanName = val.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        playerNames.add(cleanName);
      }
    }
  }
}

console.log("MATCHING RESULTS FOR MATCH 67:");
const dbPlayers = Array.from(playerNames);
screenshotPlayers.forEach(p => {
  if (playerNames.has(p)) {
    console.log(`✅ FOUND EXACT: ${p}`);
  } else {
    const close = dbPlayers.filter(dbP => dbP.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(dbP.toLowerCase()));
    console.log(`❌ NOT FOUND EXACT: ${p}. Close matches in DB:`, close);
  }
});
