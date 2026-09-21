
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const teamRoles = {
  "Ankit's Team": { 
    phase1Captain: "Virat Kohli", phase1ViceCaptain: "Trent Boult",
    phase2Captain: "Virat Kohli", phase2ViceCaptain: "Sai Sudharsan",
    captainChangeMatch: 37
  },
  "shabad's Team": { 
    phase1Captain: "Shubman Gill", phase1ViceCaptain: "Yashasvi Jaiswal",
    phase2Captain: "Shubman Gill", phase2ViceCaptain: "Yashasvi Jaiswal"
  },
  "Aizen": { 
    phase1Captain: "Varun Chakravarthy", phase1ViceCaptain: "Ishan Kishan",
    phase2Captain: "Vaibhav Sooryavanshi", phase2ViceCaptain: "Ishan Kishan",
    captainChangeMatch: 37
  },
  "Jenna Morrh Warriors": { 
    phase1Captain: "Ruturaj Gaikwad", phase1ViceCaptain: "Hardik Pandya",
    phase2Captain: "Ruturaj Gaikwad", phase2ViceCaptain: "Hardik Pandya"
  },
  "Piyush dhiman's Team": { 
    phase1Captain: "Suryakumar Yadav", phase1ViceCaptain: "Kagiso Rabada",
    phase2Captain: "Suryakumar Yadav", phase2ViceCaptain: "Kagiso Rabada"
  },
  "Maat maro shota bacha hu": { 
    phase1Captain: "Shreyas Iyer", phase1ViceCaptain: "Marco Jansen",
    phase2Captain: "Shreyas Iyer", phase2ViceCaptain: "Marco Jansen"
  },
  "GURI XI": { 
    phase1Captain: "Dewald Brevis", phase1ViceCaptain: "Jasprit Bumrah",
    phase2Captain: "Dewald Brevis", phase2ViceCaptain: "Dhruv Jurel",
    captainChangeMatch: 37
  },
  "Deepanshuu's Team": { 
    phase1Captain: "Jos Buttler", phase1ViceCaptain: "Mitchell Marsh",
    phase2Captain: "Jos Buttler", phase2ViceCaptain: "Sanju Samson",
    captainChangeMatch: 37
  },
  "Sumit's Team": { 
    phase1Captain: "Rishabh Pant", phase1ViceCaptain: "Abhishek Sharma",
    phase2Captain: "Rishabh Pant", phase2ViceCaptain: "Abhishek Sharma"
  }
};

const phase1Baselines = {
  "Vaibhav Sooryavanshi": 791,
  "Varun Chakravarthy": 258,
  "Trent Boult": 69,
  "Sai Sudharsan": 487,
  "Sanju Samson": 611,
  "Mitchell Marsh": 418,
  "Dhruv Jurel": 587,
  "Jasprit Bumrah": 243
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

const totals = {};

discoveredTeams.forEach(team => {
  let calculatedTotal = 0;
  const roles = teamRoles[team.name] || {};
  
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL") continue;

    const basePoints = parseFloat(row[team.pointsCol]) || 0;

    if (rawName === "MST Costs") {
      calculatedTotal += basePoints;
      continue;
    }

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|Out|New)\s*\)\s*/gi, "").trim();
    const p1Baseline = phase1Baselines[cleanName] || 0;
    
    const p1Cap = roles.phase1Captain;
    const p1VC = roles.phase1ViceCaptain;
    const p2Cap = roles.phase2Captain;
    const p2VC = roles.phase2ViceCaptain;
    
    const isP1Cap = (cleanName === p1Cap);
    const isP1VC = (cleanName === p1VC);
    const isP2Cap = (cleanName === p2Cap);
    const isP2VC = (cleanName === p2VC);
    
    const multP1 = isP1Cap ? 2 : (isP1VC ? 1.5 : 1);
    const multP2 = isP2Cap ? 2 : (isP2VC ? 1.5 : 1);
    
    const pointsP1 = Math.min(basePoints, p1Baseline) * multP1;
    const pointsP2 = Math.max(0, basePoints - p1Baseline) * multP2;
    
    const finalPoints = Math.round(pointsP1 + pointsP2);
    calculatedTotal += finalPoints;
  }
  
  // Mapping to ProgressionGraph keys
  const keyMap = {
    "shabad's Team": "shabad",
    "Piyush dhiman's Team": "piyush",
    "Sumit's Team": "sumit",
    "Ankit's Team": "ankit",
    "Jenna Morrh Warriors": "jenna",
    "Deepanshuu's Team": "deepanshuu",
    "Maat maro shota bacha hu": "maat",
    "GURI XI": "guri",
    "Aizen": "aizen"
  };
  
  totals[keyMap[team.name]] = calculatedTotal;
});

console.log(JSON.stringify(totals, null, 2));
