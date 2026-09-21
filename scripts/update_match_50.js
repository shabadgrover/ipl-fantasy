
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match50Points = {
  // LSG
  "Mitchell Marsh": 229,
  "Prince Yadav": 142,
  "Rishabh Pant": 84,
  "Shahbaz Ahmed": 78,
  "Nicholas Pooran": 72,
  "Mohammed Shami": 60,
  "Arshin Kulkarni": 23,
  "Mayank Yadav": 14,
  "Digvesh Rathi": 14,
  "Aiden Markram": 13,
  "Himmat Singh": 4,
  "Akshat Raghuwanshi": 4,
  // RCB
  "Rajat Patidar": 137,
  "Krunal Pandya": 126,
  "Tim David": 90,
  "Devdutt Padikkal": 62,
  "Romario Shepherd": 53,
  "Josh Hazlewood": 46,
  "Rasikh Salam": 38,
  "Jacob Bethell": 20,
  "Bhuvneshwar Kumar": 20,
  "Suyash Sharma": 6,
  "Jitesh Sharma": 5,
  "Virat Kohli": 2
};

// Map Rasikh Salam to Rasikh Dar Salam as per user instructions
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
const unknownPlayers = new Set();

discoveredTeams.forEach(team => {
  let multipliedAddition = 0;
  const roles = teamRoles[team.name] || {};
  
  console.log(`\n--- Processing ${team.name} ---`);
  
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    if (rawName.includes("(Out)")) continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
    
    // Check for mapping
    let matchPoints = 0;
    let foundMatch = false;
    
    for (const [key, val] of Object.entries(match50Points)) {
        if (key === cleanName || nameMapping[key] === cleanName) {
            matchPoints = val;
            foundMatch = true;
            break;
        }
    }
    
    if (foundMatch && matchPoints !== 0) {
      // Update Excel with RAW points
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints + matchPoints;
      
      // Calculate MULTIPLIED points for our logs/progression
      const isCaptain = cleanName === roles.captain;
      const isVC = cleanName === roles.viceCaptain;
      const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
      multipliedAddition += matchPoints * multiplier;
      
      console.log(`Added ${matchPoints} raw points to ${cleanName} (Multiplied: ${matchPoints * multiplier})`);
    }
  }
  
  currentMatchMultipliedAddition[team.name] = multipliedAddition;

  // Update TOTAL row in Excel (Sum of raw points + MST Costs)
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

// Log players that were in Match 50 but not found in any team
const allCleanNamesInTeams = new Set();
discoveredTeams.forEach(team => {
    for (let r = 2; r < rows.length; r++) {
        const rawName = rows[r][team.playerCol];
        if (rawName && rawName !== "TOTAL" && rawName !== "MST Costs") {
            const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
            allCleanNamesInTeams.add(cleanName);
        }
    }
});

console.log("\n--- Unknown Players (In Match but not in any team) ---");
for (const [name, pts] of Object.entries(match50Points)) {
    const targetName = nameMapping[name] || name;
    if (!allCleanNamesInTeams.has(targetName)) {
        console.log(`[UNKNOWN] ${name} (${pts} pts)`);
    }
}

console.log("\nMatch 50 Multiplied Additions (for Progression Graph):");
console.log(JSON.stringify(currentMatchMultipliedAddition, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 50 points applied to data.xlsx");
