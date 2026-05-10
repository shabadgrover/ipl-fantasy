
import * as XLSX from 'xlsx';
import * as fs from 'fs';

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

const match52Totals = {};
discoveredTeams.forEach(team => {
    let totalRowIdx = -1;
    for (let r = 2; r < rows.length; r++) {
        if (rows[r][team.playerCol] === "TOTAL") {
            totalRowIdx = r;
            break;
        }
    }
    if (totalRowIdx !== -1) {
        match52Totals[team.name] = rows[totalRowIdx][team.pointsCol];
    }
});

console.log("Match 52 Standings (Baseline for Match 53/54):");
console.log(JSON.stringify(match52Totals, null, 2));
