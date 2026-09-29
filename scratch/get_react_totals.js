import * as fs from 'fs';
import { parseExcelData } from '../src/utils/excelParser.js';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const teams = parseExcelData(fileBuffer);

const currentTotals = {};
teams.forEach(t => {
    currentTotals[t.teamName] = t.totalPoints;
});

console.log("Current Totals (Match 70):", JSON.stringify(currentTotals, null, 2));

const match70Additions = {
  "Aizen": 206,
  "Ankit's Team": 127,
  "Deepanshuu's Team": 0,
  "GURI XI": 0,
  "Jenna Morrh Warriors": 60,
  "Maat maro shota bacha hu": 32,
  "Piyush dhiman's Team": 132,
  "shabad's Team": 267,
  "Sumit's Team": 124
};

const previousTotals = {};
for (const key in currentTotals) {
    previousTotals[key] = currentTotals[key] - (match70Additions[key] || 0);
}

console.log("Previous Totals (Match 69):", JSON.stringify(previousTotals, null, 2));
