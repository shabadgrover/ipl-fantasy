
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match52Points = {
  // RR
  "Ravindra Jadeja": 114,
  "Vaibhav Sooryavanshi": 82,
  "Brijesh Sharma": 81,
  "Dhruv Jurel": 58,
  "Yash Raj Punja": 46,
  "Dasun Shanaka": 30,
  "Shubham Dubey": 29,
  "Jofra Archer": 23,
  "Donovan Ferreira": 22,
  "Tushar Deshpande": 21,
  "Yashasvi Jaiswal": 15,
  "Shimron Hetmyer": 14,
  // GT
  "Rashid Khan": 192,
  "Shubman Gill": 170,
  "Jason Holder": 145,
  "Sai Sudharsan": 107,
  "Washington Sundar": 103,
  "Kagiso Rabada": 80,
  "Mohammed Siraj": 44,
  "Jos Buttler": 37,
  "Rahul Tewatia": 30,
  "Arshad Khan": 12,
  "Nishant Sindhu": 12,
  "Sai Kishore": 6
};

// Map names if needed
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
    
    for (const [key, val] of Object.entries(match52Points)) {
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

// Log players that were in Match 52 but not found in any team
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
for (const [name, pts] of Object.entries(match52Points)) {
    const targetName = nameMapping[name] || name;
    if (!allCleanNamesInTeams.has(targetName)) {
        console.log(`[UNKNOWN] ${name} (${pts} pts)`);
    }
}

console.log("\nMatch 52 Multiplied Additions (for Progression Graph):");
console.log(JSON.stringify(currentMatchMultipliedAddition, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 52 points applied to data.xlsx");
