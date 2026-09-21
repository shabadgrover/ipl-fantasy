import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { matches } from './src/data/matches.js';

// Verify if already completed
const match61 = matches.find(m => m.id === 61);
if (match61 && match61.isCompleted) {
  console.log("⚠️ Match 61 is already marked as completed in matches.js. Exiting to prevent duplicate updates.");
  process.exit(0);
}

const match61Points = {
  // PBKS
  "Shashank Singh": 118,
  "Harpreet Brar": 105,
  "Cooper Connolly": 79,
  "Suryansh Shedge": 67,
  "Marcus Stoinis": 67,
  "Azmatullah Omarzai": 46,
  "Arshdeep Singh": 40,
  "Yuzvendra Chahal": 36,
  "Shreyas Iyer": 13,
  "Priyansh Arya": 10,
  "Prabhsimran Singh": 6,
  "Lockie Ferguson": 6,
  // RCB
  "Venkatesh Iyer": 147,
  "Rasikh Salam": 126,
  "Virat Kohli": 124,
  "Devdutt Padikkal": 101,
  "Bhuvneshwar Kumar": 84,
  "Tim David": 72,
  "Josh Hazlewood": 62,
  "Romario Shepherd": 46,
  "Suyash Sharma": 34,
  "Jacob Bethell": 31,
  "Jitesh Sharma": 12,
  "Krunal Pandya": 6
};

const ignoredPlayers = [
  "Harpreet Brar",
  "Suryansh Shedge",
  "Lockie Ferguson"
];

const nameMapping = {
  "Rasikh Salam": "Rasikh Dar Salam"
};

const teamRoles = {
  "Ankit's Team": { captain: "Virat Kohli", viceCaptain: "Sai Sudharsan" },
  "shabad's Team": { captain: "Shubman Gill", viceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { captain: "Vaibhav Sooryavanshi", viceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { captain: "Ruturaj Gaikwad", viceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { captain: "Suryakumar Yadav", viceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { captain: "Shreyas Iyer", viceCaptain: "Marco Jansen" },
  "GURI XI": { captain: "Dewald Brevis", viceCaptain: "Dhruv Jurel" },
  "Deepanshuu's Team": { captain: "Jos Buttler", viceCaptain: "Sanju Samson" },
  "Sumit's Team": { captain: "Rishabh Pant", viceCaptain: "Abhishek Sharma" }
};

console.log("\n--- Ignored Players (Not in Database) ---");
ignoredPlayers.forEach(p => console.log(`- Ignored: ${p}`));

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const discoveredTeams = [];
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    if (pointsIdx !== -1) {
      discoveredTeams.push({
        name: header.trim(),
        playerCol: i,
        pointsCol: pointsIdx
      });
    }
  }
}

const currentMatchMultipliedAddition = {};

console.log("\n--- Applying Match 61 (PBKS vs RCB) ---");

discoveredTeams.forEach(team => {
    let multipliedAddition = 0;
    const roles = teamRoles[team.name] || {};
    
    for (let r = 2; r < rows.length; r++) {
        const row = rows[r];
        const rawName = row[team.playerCol];
        if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
        
        if (rawName.includes("(Out)")) continue;

        const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        
        let pts = 0;
        let found = false;
        
        for (const [key, val] of Object.entries(match61Points)) {
            const mappedKey = nameMapping[key] || key;
            if (mappedKey === cleanName) {
                pts = val;
                found = true;
                break;
            }
        }
        
        if (found && pts !== 0) {
            const currentPoints = parseFloat(row[team.pointsCol]) || 0;
            row[team.pointsCol] = currentPoints + pts;
            
            const isCaptain = cleanName === roles.captain;
            const isVC = cleanName === roles.viceCaptain;
            const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
            multipliedAddition += pts * multiplier;
            
            console.log(`[${team.name}] Added ${pts} to ${cleanName} (Mult: ${multiplier})`);
        }
    }
    currentMatchMultipliedAddition[team.name] = multipliedAddition;

    // Update TOTAL row in Excel
    let rawPlayerSum = 0;
    let mstCosts = 0;
    let totalRowIdx = -1;

    for (let r = 2; r < rows.length; r++) {
        const row = rows[r];
        const name = row[team.playerCol];
        if (!name) continue;
        
        if (name === "TOTAL") {
            totalRowIdx = r;
        } else if (name === "MST Costs") {
            mstCosts = parseFloat(row[team.pointsCol]) || 0;
        } else {
            rawPlayerSum += parseFloat(row[team.pointsCol]) || 0;
        }
    }
    
    if (totalRowIdx !== -1) {
        rows[totalRowIdx][team.pointsCol] = rawPlayerSum + mstCosts;
    }
});

console.log("\nMatch 61 Multiplied Additions (for Progression Graph):");
console.log(JSON.stringify(currentMatchMultipliedAddition, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 61 points applied to data.xlsx");
