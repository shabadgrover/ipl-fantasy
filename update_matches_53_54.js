
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match53Points = {
  // CSK
  "Urvil Patel": 149,
  "Jamie Overton": 132,
  "Anshul Kamboj": 89,
  "Sanju Samson": 81,
  "Ruturaj Gaikwad": 76,
  "Noor Ahmad": 58,
  "Prashant Veer": 36,
  "Dewald Brevis": 34,
  "Shivam Dube": 31,
  "Kartik Sharma": 28,
  "Mukesh Choudhary": 18,
  "Akeal Hosein": 6,
  // LSG
  "Josh Inglis": 185,
  "Shahbaz Ahmed": 159,
  "Digvesh Rathi": 90,
  "Avesh Khan": 54,
  "Akshat Raghuwanshi": 34,
  "Himmat Singh": 33,
  "Rishabh Pant": 27,
  "Prince Yadav": 24,
  "Mitchell Marsh": 20,
  "Mohammed Shami": 14,
  "Aiden Markram": 10,
  "Nicholas Pooran": 5
};

const match54Points = {
  // RCB
  "Bhuvneshwar Kumar": 187,
  "Krunal Pandya": 137,
  "Josh Hazlewood": 58,
  "Rasikh Salam": 55,
  "Jacob Bethell": 51,
  "Romario Shepherd": 50,
  "Jitesh Sharma": 48,
  "Rajat Patidar": 32,
  "Devdutt Padikkal": 26,
  "Virat Kohli": 10,
  "Suyash Sharma": 4,
  "Tim David": 2,
  // MI
  "Corbin Bosch": 185,
  "Tilak Varma": 123,
  "Naman Dhir": 97,
  "Deepak Chahar": 85,
  "Raj Bawa": 64,
  "Rohit Sharma": 54,
  "AM Ghazanfar": 40,
  "Ryan Rickelton": 34,
  "Jasprit Bumrah": 30,
  "Will Jacks": 28,
  "Raghu Sharma": 4,
  "Suryakumar Yadav": 2
};

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

const matchAdditions = { 53: {}, 54: {} };

const applyMatchPoints = (matchPoints, matchId) => {
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
            
            for (const [key, val] of Object.entries(matchPoints)) {
                if (key === cleanName || nameMapping[key] === cleanName) {
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
            }
        }
        matchAdditions[matchId][team.name] = multipliedAddition;
    });
};

console.log("\n--- Applying Match 53 ---");
applyMatchPoints(match53Points, 53);

console.log("--- Applying Match 54 ---");
applyMatchPoints(match54Points, 54);

// Update TOTAL rows
discoveredTeams.forEach(team => {
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

console.log("\nMatch Additions (Multiplied):");
console.log(JSON.stringify(matchAdditions, null, 2));

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Match 53 & 54 points applied to data.xlsx");
