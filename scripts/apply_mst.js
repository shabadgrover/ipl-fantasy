import * as XLSX from 'xlsx';
import * as fs from 'fs';

const mstTransfers = [
  { "team": "Guri", "out": "Jitesh Sharma", "in": "Cooper Connolly", "type": "Paid", "points": -200 },
  { "team": "Deepanshu", "out": "Azmatullah Omarzai", "in": "Jamie Overton", "type": "Free", "points": 0 },
  { "team": "Sumit", "out": "Navdeep Saini", "in": "Xavier Bartlett", "type": "Free (Bug Adj)", "points": -10 },
  { "team": "Jenna Morrh", "out": "Rachin Ravindra", "in": "Sarfaraz Khan", "type": "Free", "points": 0 },
  { "team": "Piyush", "out": "Jacob Bethell", "in": "AM Ghazanfar", "type": "Free", "points": 0 },
  { "team": "Ankit", "out": "Mitchell Starc", "in": "Anshul Kamboj", "type": "Free", "points": 0 },
  { "team": "Guri", "out": "Nehal Wadhera", "in": "Naman Dhir", "type": "Low-Perf", "points": -100 },
  { "team": "Harshdeep", "out": "Aqib Nabi", "in": "Mukesh Kumar", "type": "Low-Perf", "points": -100 },
  { "team": "Nitesh", "out": "Prithvi Shaw", "in": "Devdutt Padikkal", "type": "Free", "points": 0 },
  { "team": "Harshdeep", "out": "Abhishek Porel", "in": "Sameer Rizvi", "type": "Free", "points": 0 },
  { "team": "Harshdeep", "out": "Ayush Mhatre", "in": "Romario Shepherd", "type": "Free", "points": 0 },
  { "team": "Harshdeep", "out": "Rahul Tewatia", "in": "Harsh Dubey", "type": "Paid", "points": -200 },
  { "team": "Ankit", "out": "Venkatesh Iyer", "in": "Rasikh Dar Salam", "type": "Low-Perf", "points": -100 },
  { "team": "Harshdeep", "out": "Khaleel Ahmed", "in": "Kartik Tyagi", "type": "Free", "points": 0 },
  { "team": "Bhatti", "out": "Matheesha Pathirana", "in": "Eshan Malinga", "type": "Free", "points": 0 },
  { "team": "Ankit", "out": "Harshal Patel", "in": "Prince Yadav", "type": "Low-Perf", "points": -100 },
  { "team": "Nitesh", "out": "Ishant Sharma", "in": "Pathum Nissanka", "type": "Free", "points": 0 },
  { "team": "Nitesh", "out": "Rahul Chahar", "in": "Suyash Sharma", "type": "Free", "points": 0 },
  { "team": "Shabad", "out": "Prashant Veer", "in": "Akeal Hosein", "type": "Low-Perf", "points": -100 },
  { "team": "Shabad", "out": "MS Dhoni", "in": "Sakib Hussain", "type": "Free", "points": 0 },
  { "team": "Piyush", "out": "Glenn Phillips", "in": "Jason Holder", "type": "Paid", "points": -200 },
  { "team": "Guri", "out": "Finn Allen", "in": "Nitish Rana", "type": "Paid", "points": -200 },
  { "team": "Ankit", "out": "Trent Boult", "in": "Nandre Burger", "type": "Paid", "points": -200 },
  { "team": "Nitesh", "out": "Ashutosh Sharma", "in": "Rovman Powell", "type": "Free", "points": 0 }
];

const teamMapping = {
  "Guri": "GURI XI",
  "Deepanshu": "Deepanshuu's Team",
  "Sumit": "Sumit's Team",
  "Jenna Morrh": "Jenna Morrh Warriors",
  "Piyush": "Piyush dhiman's Team",
  "Ankit": "Ankit's Team",
  "Shabad": "shabad's Team",
  "Harshdeep": "Maat maro shota bacha hu",
  "Nitesh": "Aizen",
  "Bhatti": "Deepanshuu's Team"
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

// 1. Apply Transfers (Replace Names)
mstTransfers.forEach(transfer => {
  const teamHeader = teamMapping[transfer.team];
  let teamCol = headers.indexOf(teamHeader);

  if (teamCol === -1) return;

  for (let i = 2; i < rows.length; i++) {
    const cell = rows[i][teamCol];
    if (cell && typeof cell === 'string' && cell.includes(transfer.out)) {
      const markers = cell.match(/\(C\)|\(VC\)/i);
      const suffix = markers ? ` ${markers[0]}` : "";
      rows[i][teamCol] = transfer.in + suffix;
      break;
    }
  }
});

// 2. Apply Deductions
const teamDeductions = {};
mstTransfers.forEach(t => {
  const teamHeader = teamMapping[t.team];
  teamDeductions[teamHeader] = (teamDeductions[teamHeader] || 0) + t.points;
});

Object.entries(teamDeductions).forEach(([teamHeader, deduction]) => {
  if (deduction === 0) return;

  let teamCol = headers.indexOf(teamHeader);
  let pointsCol = -1;
  for (let k = teamCol; k < labels.length && (k === teamCol || !headers[k]); k++) {
    if (labels[k] === "Points") {
      pointsCol = k;
      break;
    }
  }

  if (teamCol !== -1 && pointsCol !== -1) {
    let totalRowIdx = -1;
    let mstRowIdx = -1;

    for (let i = 2; i < rows.length; i++) {
      if (rows[i][teamCol] === "TOTAL") {
        totalRowIdx = i;
        break;
      }
      if (rows[i][teamCol] === "MST Costs") {
        mstRowIdx = i;
      }
    }

    if (mstRowIdx !== -1) {
      rows[mstRowIdx][pointsCol] = (parseFloat(rows[mstRowIdx][pointsCol]) || 0) + deduction;
    } else if (totalRowIdx !== -1) {
      // If no space, we need to insert a row
      // Let's check if there's an empty row before TOTAL
      let emptyRowIdx = -1;
      for (let i = totalRowIdx - 1; i >= 2; i--) {
        if (!rows[i][teamCol]) {
          emptyRowIdx = i;
          break;
        }
      }

      if (emptyRowIdx !== -1) {
        rows[emptyRowIdx][teamCol] = "MST Costs";
        rows[emptyRowIdx][pointsCol] = deduction;
      } else {
        // Shift EVERYTHING from totalRowIdx down
        rows.splice(totalRowIdx, 0, []);
        rows[totalRowIdx][teamCol] = "MST Costs";
        rows[totalRowIdx][pointsCol] = deduction;
      }
    }
  }
});

// 3. Recalculate TOTAL rows
for (let j = 0; j < headers.length; j++) {
  if (headers[j]) {
    let teamCol = j;
    let pointsCol = -1;
    for (let k = j; k < labels.length && (k === j || !headers[k]); k++) {
      if (labels[k] === "Points") {
        pointsCol = k;
        break;
      }
    }

    if (pointsCol !== -1) {
      let rawSum = 0;
      let totalRowIdx = -1;
      for (let i = 2; i < rows.length; i++) {
        if (rows[i][teamCol] === "TOTAL") {
          totalRowIdx = i;
          break;
        }
        if (rows[i][teamCol]) {
          rawSum += parseFloat(rows[i][pointsCol]) || 0;
        }
      }
      if (totalRowIdx !== -1) {
        rows[totalRowIdx][pointsCol] = rawSum;
      }
    }
  }
}

const newWorksheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[sheetName] = newWorksheet;
XLSX.writeFile(workbook, './public/data.xlsx');
console.log("MST Applied with robust row handling.");
