
const XLSX = require('xlsx');
const fs = require('fs');

const teamRoles = {
  "Maat maro shota bacha hu": { 
    phase1Captain: "Shreyas Iyer", phase1ViceCaptain: "Marco Jansen",
    phase2Captain: "Shreyas Iyer", phase2ViceCaptain: "Marco Jansen"
  }
};

const phase1Baselines = {
  "Vaibhav Sooryavanshi": 791, "Varun Chakravarthy": 258, "Trent Boult": 69,
  "Sai Sudharsan": 487, "Sanju Samson": 611, "Mitchell Marsh": 418,
  "Dhruv Jurel": 587, "Jasprit Bumrah": 243
};

const match40Points = { "Shreyas Iyer": 56, "Marco Jansen": 14, "Riyan Parag": 71, "Arshdeep Singh": 40 };

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
  if (headers[i] === "Maat maro shota bacha hu" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    
    let calculatedTotal = 0;
    const roles = teamRoles["Maat maro shota bacha hu"];
    
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const rawName = row[i];
      if (!rawName || rawName === "TOTAL") continue;
      
      let basePoints = parseFloat(row[pointsIdx]) || 0;
      const cleanName = rawName.replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "").trim();
      
      if (match40Points[cleanName]) basePoints -= match40Points[cleanName];

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
    console.log(`Maat Match 39 Correct Total: ${calculatedTotal}`);
  }
}
