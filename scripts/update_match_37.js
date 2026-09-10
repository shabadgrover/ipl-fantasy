
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
      const currentPoints = parseFloat(row[team.pointsCol]) || 0;
      row[team.pointsCol] = currentPoints + matchPoints;
      addedPointsCount++;
      console.log(`Added ${matchPoints} to ${cleanName} for ${team.name}`);
    }
  }
  
  // Update TOTAL row in Excel
  let rawSum = 0;
  for (let r = 2; r < rows.length; r++) {
    const row = rows[r];
    if (row[team.playerCol] === "TOTAL") {
       row[team.pointsCol] = rawSum;
       break;
    }
    if (row[team.playerCol] && row[team.playerCol] !== "MST Costs") {
       rawSum += parseFloat(row[team.pointsCol]) || 0;
    } else if (row[team.playerCol] === "MST Costs") {
       rawSum += parseFloat(row[team.pointsCol]) || 0;
    }
  }
});

console.log(`Total point assignments made: ${addedPointsCount}`);

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("✅ Match 37 points applied to data.xlsx");
