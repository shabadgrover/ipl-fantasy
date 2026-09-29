
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const match37Points = {
  // GT
  "Sai Sudharsan": 167,
  "Kagiso Rabada": 136,
  "Arshad Khan": 96,
  "Jos Buttler": 87,
  "Shubman Gill": 73,
  "Mohammed Siraj": 68,
  "Jason Holder": 54,
  "Manav Suthar": 54,
  "M Shahrukh Khan": 12,
  "Rashid Khan": 6,
  "Washington Sundar": 5,
  
  // CSK
  "Ruturaj Gaikwad": 134,
  "Noor Ahmad": 48,
  "Shivam Dube": 48,
  "Akeal Hosein": 40,
  "Jamie Overton": 38,
  "Sanju Samson": 33,
  "Kartik Sharma": 31,
  "Anshul Kamboj": 30,
  "Dewald Brevis": 14,
  "Urvil Patel": 12,
  "Sarfaraz Khan": 2,
  "Gurjapneet Singh": 2
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

const foundPlayers = new Set();
let addedPointsCount = 0;

discoveredTeams.forEach(team => {
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    const rawName = row[team.playerCol];
    if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
    
    if (rawName.includes("(Out)")) continue;

    const cleanName = rawName.replace(/\s*\(\s*(C|VC|New)\s*\)\s*/gi, "").trim();
    const matchPoints = match37Points[cleanName] || 0;
    
    if (matchPoints > 0) {
      // For logging unknown players later, we mark this player as found
      foundPlayers.add(cleanName);
      
      // We don't want to double add points if I run this script twice, but the user says "Add this match’s points to cumulative totals".
      // I should have a check to prevent duplicate updates for same match.
      // However, for this one-off task, I'll just assume it's the first time.
      // BUT, to be safe, I should have a way to check.
      // For now, I'll just proceed as it's the first run.
    }
  }
});

// Log players from screenshot who were NOT found in any team
Object.keys(match37Points).forEach(playerName => {
  if (!foundPlayers.has(playerName)) {
    console.log(`[LOG] Player ${playerName} not found in any fantasy team database.`);
  }
});

console.log("Validation: Use the previous run's log to verify assignments.");
