import { parseExcelData } from './src/utils/excelParser.js';
import * as fs from 'fs';

try {
  const fileBuffer = fs.readFileSync('./public/data.xlsx');
  const teams = parseExcelData(fileBuffer);
  
  const sorted = teams.sort((a, b) => b.totalPoints - a.totalPoints);
  
  console.log("Team Rankings after Match 6:");
  sorted.forEach((t, i) => {
    console.log(`${i + 1}. ${t.teamName}: ${t.totalPoints}`);
  });

  const BASELINE_MATCH5 = {
    "Piyush dhiman's Team": 713,
    "Jenna Morrh Warriors": 694,
    "Ankit's Team": 671,
    "shabad's Team": 657,
    "Deepanshuu's Team": 490.5,
    "Aizen": 437,
    "Maat maro shota bacha hu": 426.5,
    "Sumit's Team": 406.5,
    "GURI XI": 288
  };

  const INITIAL_RANKS = Object.keys(BASELINE_MATCH5)
    .sort((a, b) => BASELINE_MATCH5[b] - BASELINE_MATCH5[a])
    .map((id, index) => ({ id, rank: index + 1 }));

  console.log("\nTrends vs Match 5:");
  sorted.forEach((team, index) => {
    const currentRank = index + 1;
    const prevEntry = INITIAL_RANKS.find(p => p.id === team.teamName);
    let trend = 'same';
    if (prevEntry) {
      if (currentRank < prevEntry.rank) trend = 'up ↑';
      else if (currentRank > prevEntry.rank) trend = 'down ↓';
    }
    console.log(`${team.teamName}: Rank ${currentRank} (${trend})`);
  });

} catch (err) {
  console.error(err);
}
