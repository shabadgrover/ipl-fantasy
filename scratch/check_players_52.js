
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const playersInTeams = new Set();
for (let i = 0; i < headers.length; i++) {
  if (labels[i] === "Player Name") {
    for (let r = 2; r < rows.length; r++) {
      const name = rows[r][i];
      if (name && name !== "TOTAL" && name !== "MST Costs") {
        const cleanName = name.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        playersInTeams.add(cleanName);
      }
    }
  }
}

const match52Players = [
  "Ravindra Jadeja", "Vaibhav Sooryavanshi", "Brijesh Sharma", "Dhruv Jurel", 
  "Yash Raj Punja", "Dasun Shanaka", "Shubham Dubey", "Jofra Archer", 
  "Donovan Ferreira", "Tushar Deshpande", "Yashasvi Jaiswal", "Shimron Hetmyer",
  "Rashid Khan", "Shubman Gill", "Jason Holder", "Sai Sudharsan", 
  "Washington Sundar", "Kagiso Rabada", "Mohammed Siraj", "Jos Buttler", 
  "Rahul Tewatia", "Arshad Khan", "Nishant Sindhu", "Sai Kishore"
];

console.log("--- Player Check for Match 52 ---");
match52Players.forEach(p => {
  if (playersInTeams.has(p)) {
    console.log(`[FOUND] ${p}`);
  } else {
    console.log(`[MISSING] ${p}`);
  }
});
