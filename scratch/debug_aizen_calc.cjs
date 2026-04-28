
const XLSX = require('xlsx');
const fs = require('fs');

const iplTeamMap = {
  "Sunrisers Hyderabad": "SRH", "Mumbai Indians": "MI", "Chennai Super Kings": "CSK",
  "Punjab Kings": "PBKS", "Gujarat Titans": "GT", "Delhi Capitals": "DC",
  "Kolkata Knight Riders": "KKR", "Rajasthan Royals": "RR", "Lucknow Super Giants": "LSG",
  "Royal Challengers Bengaluru": "RCB"
};

const teamRoles = {
  "Aizen": { 
    phase1Captain: "Varun Chakravarthy", phase1ViceCaptain: "Ishan Kishan",
    phase2Captain: "Vaibhav Sooryavanshi", phase2ViceCaptain: "Ishan Kishan",
    captainChangeMatch: 37
  }
};

const phase1Baselines = {
  "Vaibhav Sooryavanshi": 791, "Varun Chakravarthy": 258, "Trent Boult": 69,
  "Sai Sudharsan": 487, "Sanju Samson": 611, "Mitchell Marsh": 418,
  "Dhruv Jurel": 587, "Jasprit Bumrah": 243
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
  if (headers[i] === "Aizen" && labels[i] === "Player Name") {
    let pointsIdx = -1;
    for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
      if (labels[j] === "Points") pointsIdx = j;
    }
    
    console.log(`Calculating for Aizen:`);
    let calculatedTotal = 0;
    const roles = teamRoles["Aizen"];
    
    for (let r = 2; r < rows.length; r++) {
      const row = rows[r];
      const rawName = row[i];
      if (!rawName || rawName === "TOTAL") continue;
      
      const basePoints = parseFloat(row[pointsIdx]) || 0;
      if (rawName === "MST Costs") {
        calculatedTotal += basePoints;
        console.log(`  MST Costs: ${basePoints}`);
        continue;
      }
      
      const cleanName = rawName.replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "").trim();
      const p1Baseline = phase1Baselines[cleanName] || 0;
      
      const isP1Cap = cleanName === roles.phase1Captain;
      const isP1VC = cleanName === roles.phase1ViceCaptain;
      const isP2Cap = cleanName === roles.phase2Captain;
      const isP2VC = cleanName === roles.phase2ViceCaptain;
      
      const multP1 = isP1Cap ? 2 : (isP1VC ? 1.5 : 1);
      const multP2 = isP2Cap ? 2 : (isP2VC ? 1.5 : 1);
      
      const pointsP1 = Math.min(basePoints, p1Baseline) * multP1;
      const pointsP2 = Math.max(0, basePoints - p1Baseline) * multP2;
      const finalPoints = Math.round(pointsP1 + pointsP2);
      
      calculatedTotal += finalPoints;
      console.log(`  ${cleanName}: raw=${basePoints}, p1=${pointsP1}, p2=${pointsP2}, final=${finalPoints}`);
    }
    console.log(`  Calculated Total: ${calculatedTotal}`);
  }
}
