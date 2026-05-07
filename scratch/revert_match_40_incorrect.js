
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match40Points = {
  "Marcus Stoinis": 134,
  "Yuzvendra Chahal": 116,
  "Prabhsimran Singh": 103,
  "Cooper Connolly": 72,
  "Priyansh Arya": 71,
  "Shreyas Iyer": 56,
  "Arshdeep Singh": 40,
  "Harpreet Brar": 24,
  "Suryansh Shedge": 23,
  "Marco Jansen": 14,
  "Lockie Ferguson": 12,
  "Nehal Wadhera": 4,
  "Donovan Ferreira": 122,
  "Yashasvi Jaiswal": 103,
  "Vaibhav Sooryavanshi": 101,
  "Yash Raj Punja": 74,
  "Shubham Dubey": 71,
  "Riyan Parag": 71,
  "Jofra Archer": 52,
  "Nandre Burger": 44,
  "Dhruv Jurel": 32,
  "Brijesh Sharma": 16,
  "Ravindra Jadeja": 12,
  "Dasun Shanaka": 4
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

discoveredTeams.forEach(team => {
  const roles = teamRoles[team.name] || {};
  
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    if (rawName.includes("(Out)")) continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim();
    const matchPoints = match40Points[cleanName] || 0;
    
    if (matchPoints !== 0) {
      const isCaptain = cleanName === roles.captain;
      const isVC = cleanName === roles.viceCaptain;
      const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
      const pointsAddedIncorrectly = matchPoints * multiplier;
      
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints - pointsAddedIncorrectly;
      console.log(`[${team.name}] Reverted ${pointsAddedIncorrectly} from ${cleanName}`);
    }
  }
});

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ Incorrect Match 40 points reverted from data.xlsx");
