import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { parseExcelData } from '../src/utils/excelParser.js';

const match71Points = {
  // RCB
  "Rajat Patidar": 199,
  "Krunal Pandya": 179,
  "Jacob Duffy": 126,
  "Rasikh Salam": 106,
  "Bhuvneshwar Kumar": 104,
  "Virat Kohli": 91,
  "Josh Hazlewood": 84,
  "Devdutt Padikkal": 62,
  "Venkatesh Iyer": 41,
  "Jitesh Sharma": 37,
  "Tim David": 16,
  "Romario Shepherd": 8,
  // GT
  "Rahul Tewatia": 140,
  "Kagiso Rabada": 91,
  "Jos Buttler": 81,
  "Jason Holder": 80,
  "Prasidh Krishna": 54,
  "Sai Sudharsan": 38,
  "Rashid Khan": 26,
  "Washington Sundar": 16,
  "Shubman Gill": 14,
  "Nishant Sindhu": 13,
  "Mohammed Siraj": 7
};

const match72Points = {
  // SRH
  "Nitish Kumar Reddy": 132,
  "Praful Hinge": 114,
  "Ishan Kishan": 89,
  "Shivang Kumar": 88,
  "Salil Arora": 67,
  "Eshan Malinga": 60,
  "Heinrich Klaasen": 50,
  "Travis Head": 35,
  "Abhishek Sharma": 30,
  "Sakib Hussain": 21,
  "Ravichandran Smaran": 13,
  "Pat Cummins": 5,
  // RR
  "Vaibhav Sooryavanshi": 221,
  "Jofra Archer": 156,
  "Dhruv Jurel": 116,
  "Ravindra Jadeja": 94,
  "Nandre Burger": 93,
  "Sushant Mishra": 75,
  "Riyan Parag": 62,
  "Yash Raj Punja": 54,
  "Yashasvi Jaiswal": 53,
  "Donovan Ferreira": 28,
  "Dasun Shanaka": 21,
  "Brijesh Sharma": 12
};

const match73Points = {
  // GT
  "Shubman Gill": 218,
  "Sai Sudharsan": 114,
  "Jason Holder": 96,
  "Kagiso Rabada": 92,
  "Prasidh Krishna": 64,
  "Mohammed Siraj": 52,
  "Rahul Tewatia": 35,
  "Washington Sundar": 30,
  "Jos Buttler": 29,
  "Sai Kishore": 4,
  "Nishant Sindhu": 4,
  "Rashid Khan": 0,
  // RR
  "Vaibhav Sooryavanshi": 194,
  "Donovan Ferreira": 94,
  "Ravindra Jadeja": 73,
  "Jofra Archer": 63,
  "Nandre Burger": 48,
  "Brijesh Sharma": 42,
  "Riyan Parag": 25,
  "Dhruv Jurel": 15,
  "Tushar Deshpande": 8,
  "Dasun Shanaka": 7,
  "Yashasvi Jaiswal": 5,
  "Yash Raj Punja": 2
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

function applyMatchPoints(matchPoints, matchName) {
    console.log(`\n--- Applying ${matchName} ---`);
    discoveredTeams.forEach(team => {
        let addedUnmultiplied = 0;
        for (let r = 2; r < rows.length; r++) {
            const row = rows[r];
            const rawName = row[team.playerCol];
            if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
            if (rawName.includes("(Out)")) continue;

            const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
            
            let pts = matchPoints[cleanName] || 0;
            if (pts !== 0) {
                const currentPoints = parseFloat(row[team.pointsCol]) || 0;
                row[team.pointsCol] = currentPoints + pts;
                addedUnmultiplied += pts;
                // console.log(`[${team.name}] Added ${pts} unmultiplied to ${cleanName}`);
            }
        }

        // Update TOTAL row
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

    // Calculate totals using React parser to get multiplied points
    const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
    workbook.Sheets[sheetName] = newWorksheet;
    const outBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    const reactTeams = parseExcelData(outBuffer);
    
    const currentTotals = {};
    reactTeams.forEach(t => {
        currentTotals[t.teamName] = t.totalPoints;
    });
    
    console.log(`Totals after ${matchName}:`, JSON.stringify(currentTotals, null, 2));
}

applyMatchPoints(match71Points, "Match 71 (RCB vs GT)");
applyMatchPoints(match72Points, "Match 72 (SRH vs RR)");
applyMatchPoints(match73Points, "Match 73 (GT vs RR)");

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("\n✅ All matches applied to data.xlsx");
