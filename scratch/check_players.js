
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const allPlayers = new Set();

for (let i = 0; i < headers.length; i++) {
  if (labels[i] === "Player Name") {
    for (let r = 2; r < rows.length; r++) {
      const name = rows[r][i];
      if (name && name !== "TOTAL" && name !== "MST Costs") {
        const cleanName = name.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        allPlayers.add(cleanName);
      }
    }
  }
}

const match50Players = [
  "Mitchell Marsh", "Prince Yadav", "Rishabh Pant", "Shahbaz Ahmed", "Nicholas Pooran", 
  "Mohammed Shami", "Arshin Kulkarni", "Mayank Yadav", "Digvesh Rathi", "Aiden Markram", 
  "Himmat Singh", "Akshat Raghuwanshi", "Rajat Patidar", "Krunal Pandya", "Tim David", 
  "Devdutt Padikkal", "Romario Shepherd", "Josh Hazlewood", "Rasikh Salam", "Jacob Bethell", 
  "Bhuvneshwar Kumar", "Suyash Sharma", "Jitesh Sharma", "Virat Kohli"
];

console.log("Checking players for Match 50:");
match50Players.forEach(p => {
  if (allPlayers.has(p)) {
    console.log(`[FOUND] ${p}`);
  } else {
    console.log(`[MISSING] ${p}`);
  }
});
