import * as XLSX from 'xlsx';
import * as fs from 'fs';

const screenshotPlayers = [
  "Mukesh Choudhary", "Dewald Brevis", "Sanju Samson", "Kartik Sharma", "Akeal Hosein", 
  "Shivam Dube", "Noor Ahmad", "Urvil Patel", "Anshul Kamboj", "Spencer Johnson", 
  "Prashant Veer", "Ruturaj Gaikwad",
  "Ishan Kishan", "Pat Cummins", "Sakib Hussain", "Heinrich Klaasen", "Eshan Malinga", 
  "Praful Hinge", "Abhishek Sharma", "Nitish Kumar Reddy", "Salil Arora", "Shivang Kumar", 
  "Travis Head", "Ravichandran Smaran"
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

console.log("MATCHING RESULTS FOR MATCH 63:");
const dbPlayers = Array.from(playerNames);
screenshotPlayers.forEach(p => {
  if (playerNames.has(p)) {
    console.log(`✅ FOUND EXACT: ${p}`);
  } else {
    // Look for partial matches
    const close = dbPlayers.filter(dbP => dbP.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(dbP.toLowerCase()));
    console.log(`❌ NOT FOUND EXACT: ${p}. Close matches in DB:`, close);
  }
});
