import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { matches } from './src/data/matches.js';

// Verify if already completed
const match74 = matches.find(m => m.id === 74);
if (match74 && match74.isCompleted) {
  console.log("⚠️ Match 74 is already marked as completed in matches.js. Exiting to prevent duplicate updates.");
  process.exit(0);
}

const match74Points = {
  // RCB
  "Virat Kohli": 151,
  "Rasikh Salam": 130,
  "Bhuvneshwar Kumar": 88,
  "Josh Hazlewood": 86,
  "Venkatesh Iyer": 76,
  "Krunal Pandya": 55,
  "Tim David": 48,
  "Rajat Patidar": 45,
  "Jitesh Sharma": 37,
  "Jacob Duffy": 16,
  "Devdutt Padikkal": 13,
  "Romario Shepherd": 12,
  // GT
  "Rashid Khan": 107,
  "Arshad Khan": 89,
  "Washington Sundar": 84,
  "Kagiso Rabada": 61,
  "Mohammed Siraj": 54,
  "Nishant Sindhu": 36,
  "Jos Buttler": 33,
  "Jason Holder": 27,
  "Sai Sudharsan": 24,
  "Shubman Gill": 22,
  "Rahul Tewatia": 15,
  "Prasidh Krishna": 10
};

const ignoredPlayers = [
  "Josh Inglis",
  "Arjun Tendulkar",
  "Mohsin Khan",
  "Mukul Choudhary",
  "Arshin Kulkarni",
  "Suryansh Shedge",
  "Vijaykumar Vyshak",
  "Praveen Dubey"
];

const nameMapping = {};

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

console.log("\n--- Ignored Players (Not in Database / Undrafted) ---");
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

console.log("\n--- Applying Match 74 (RCB vs GT) ---");

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
        
        for (const [key, val] of Object.entries(match74Points)) {
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

console.log("\nMatch 74 Multiplied Additions:");
console.log(JSON.stringify(currentMatchMultipliedAddition, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 74 points applied to data.xlsx");
