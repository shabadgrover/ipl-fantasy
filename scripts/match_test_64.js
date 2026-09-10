import * as XLSX from 'xlsx';
import * as fs from 'fs';

const screenshotPlayers = [
  // RR
  "Vaibhav Sooryavanshi", "Yashasvi Jaiswal", "Dhruv Jurel", "Yash Raj Punja",
  "Jofra Archer", "Donovan Ferreira", "Sushant Mishra", "Brijesh Sharma",
  "Lhuan-dre Pretorius", "Dasun Shanaka", "Shubham Dubey", "Sandeep Sharma",
  // LSG
  "Mitchell Marsh", "Josh Inglis", "Rishabh Pant", "Mohsin Khan",
  "Akash Singh", "Nicholas Pooran", "Prince Yadav", "Mayank Yadav",
  "Digvesh Rathi", "Ayush Badoni", "Abdul Samad", "Shahbaz Ahmed"
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

console.log("MATCHING RESULTS FOR MATCH 64:");
const dbPlayers = Array.from(playerNames);
screenshotPlayers.forEach(p => {
  if (playerNames.has(p)) {
    console.log(`✅ FOUND EXACT: ${p}`);
  } else {
    const close = dbPlayers.filter(dbP => dbP.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(dbP.toLowerCase()));
    console.log(`❌ NOT FOUND EXACT: ${p}. Close matches in DB:`, close);
  }
});
