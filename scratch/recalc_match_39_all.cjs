
const XLSX = require('xlsx');
const fs = require('fs');

const teamRoles = {
  "Ankit's Team": { phase1Captain: "Virat Kohli", phase1ViceCaptain: "Trent Boult", phase2Captain: "Virat Kohli", phase2ViceCaptain: "Sai Sudharsan" },
  "shabad's Team": { phase1Captain: "Shubman Gill", phase1ViceCaptain: "Yashasvi Jaiswal", phase2Captain: "Shubman Gill", phase2ViceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { phase1Captain: "Varun Chakravarthy", phase1ViceCaptain: "Ishan Kishan", phase2Captain: "Vaibhav Sooryavanshi", phase2ViceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { phase1Captain: "Ruturaj Gaikwad", phase1ViceCaptain: "Hardik Pandya", phase2Captain: "Ruturaj Gaikwad", phase2ViceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { phase1Captain: "Suryakumar Yadav", phase1ViceCaptain: "Kagiso Rabada", phase2Captain: "Suryakumar Yadav", phase2ViceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { phase1Captain: "Shreyas Iyer", phase1ViceCaptain: "Marco Jansen", phase2Captain: "Shreyas Iyer", phase2ViceCaptain: "Marco Jansen" },
  "GURI XI": { phase1Captain: "Dewald Brevis", phase1ViceCaptain: "Jasprit Bumrah", phase2Captain: "Dewald Brevis", phase2ViceCaptain: "Dhruv Jurel" },
  "Deepanshuu's Team": { phase1Captain: "Jos Buttler", phase1ViceCaptain: "Mitchell Marsh", phase2Captain: "Jos Buttler", phase2ViceCaptain: "Sanju Samson" },
  "Sumit's Team": { phase1Captain: "Rishabh Pant", phase1ViceCaptain: "Abhishek Sharma", phase2Captain: "Rishabh Pant", phase2ViceCaptain: "Abhishek Sharma" }
};

const phase1Baselines = {
  "Vaibhav Sooryavanshi": 791, "Varun Chakravarthy": 258, "Trent Boult": 69,
  "Sai Sudharsan": 487, "Sanju Samson": 611, "Mitchell Marsh": 418,
  "Dhruv Jurel": 587, "Jasprit Bumrah": 243
};

const match40Points = { "Marcus Stoinis": 134, "Yuzvendra Chahal": 116, "Prabhsimran Singh": 103, "Cooper Connolly": 72, "Priyansh Arya": 71, "Shreyas Iyer": 56, "Arshdeep Singh": 40, "Harpreet Brar": 24, "Suryansh Shedge": 23, "Marco Jansen": 14, "Lockie Ferguson": 12, "Nehal Wadhera": 4, "Donovan Ferreira": 122, "Yashasvi Jaiswal": 103, "Vaibhav Sooryavanshi": 101, "Yash Raj Punja": 74, "Shubham Dubey": 71, "Riyan Parag": 71, "Jofra Archer": 52, "Nandre Burger": 44, "Dhruv Jurel": 32, "Brijesh Sharma": 16, "Ravindra Jadeja": 12, "Dasun Shanaka": 4 };

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const results = {};

for (let i = 0; i < headers.length; i++) {
  const teamName = headers[i];
  if (teamName && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    
    let calculatedTotal = 0;
    const roles = teamRoles[teamName] || {};
    
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const rawName = row[i];
      if (!rawName || rawName === "TOTAL") continue;
      
      let basePoints = parseFloat(row[pointsIdx]) || 0;
      const cleanName = rawName.replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "").trim();
      
      if (match40Points[cleanName] && !rawName.includes("(Out)")) {
        basePoints -= match40Points[cleanName];
      }

      if (rawName === "MST Costs") {
        calculatedTotal += basePoints;
        continue;
      }
      
      const p1Baseline = phase1Baselines[cleanName] || 0;
      const multP1 = (cleanName === roles.phase1Captain) ? 2 : ((cleanName === roles.phase1ViceCaptain) ? 1.5 : 1);
      const multP2 = (cleanName === roles.phase2Captain) ? 2 : ((cleanName === roles.phase2ViceCaptain) ? 1.5 : 1);
      
      const pointsP1 = Math.min(basePoints, p1Baseline) * multP1;
      const pointsP2 = Math.max(0, basePoints - p1Baseline) * multP2;
      calculatedTotal += Math.round(pointsP1 + pointsP2);
    }
    results[teamName] = calculatedTotal;
  }
}

console.log("Recalculated Match 39 Totals:");
console.log(JSON.stringify(results, null, 2));
