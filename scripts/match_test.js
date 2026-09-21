import * as XLSX from 'xlsx';
import * as fs from 'fs';

const screenshotPlayers = [
  "Shashank Singh", "Harpreet Brar", "Cooper Connolly", "Suryansh Shedge", "Marcus Stoinis", 
  "Azmatullah Omarzai", "Arshdeep Singh", "Yuzvendra Chahal", "Shreyas Iyer", "Priyansh Arya", 
  "Prabhsimran Singh", "Lockie Ferguson", 
  "Venkatesh Iyer", "Rasikh Salam", "Virat Kohli", "Devdutt Padikkal", "Bhuvneshwar Kumar", 
  "Tim David", "Josh Hazlewood", "Romario Shepherd", "Suyash Sharma", "Jacob Bethell", 
  "Jitesh Sharma", "Krunal Pandya"
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

console.log("MATCHING RESULTS:");
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
