import * as XLSX from 'xlsx';
import * as fs from 'fs';

const iplTeamMap = {
  "Sunrisers Hyderabad": "SRH",
  "Mumbai Indians": "MI",
  "Chennai Super Kings": "CSK",
  "Punjab Kings": "PBKS",
  "Gujarat Titans": "GT",
  "Delhi Capitals": "DC",
  "Kolkata Knight Riders": "KKR",
  "Rajasthan Royals": "RR",
  "Lucknow Super Giants": "LSG",
  "Royal Challengers Bengaluru": "RCB"
};

const normalizeTeamName = (name) => {
  if (!name) return "";
  const n = name.trim().toLowerCase();
  if (n === "rcb" || n.includes("royal challengers") || n.includes("bangluru") || n.includes("bangalore")) {
    return "Royal Challengers Bengaluru";
  }
  return name.trim();
};

const teamRoles = {
  "Ankit's Team": { captain: "Virat Kohli", viceCaptain: "Trent Boult" },
  "shabad's Team": { captain: "Shubman Gill", viceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { captain: "Varun Chakravarthy", viceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { captain: "Ruturaj Gaikwad", viceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { captain: "Suryakumar Yadav", viceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { captain: "Shreyas Iyer", viceCaptain: "Marco Jansen" },
  "GURI XI": { captain: "Dewald Brevis", viceCaptain: "Jasprit Bumrah" },
  "Deepanshuu's Team": { captain: "Jos Buttler", viceCaptain: "Mitchell Marsh" },
  "Sumit's Team": { captain: "Rishabh Pant", viceCaptain: "Abhishek Sharma" }
};

const parseExcelData = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  if (rows.length < 2) return [];

  const headers = rows[0];
  const labels = rows[1];
  
  const discoveredTeams = [];
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
      let iplIdx = -1;
      let pointsIdx = -1;
      for (let j = i; j < labels.length && (j === i || !headers[j]); j++) {
        if (labels[j] === "IPL Team") iplIdx = j;
        if (labels[j] === "Points") pointsIdx = j;
      }
      if (pointsIdx !== -1) {
        discoveredTeams.push({
          name: header.trim(),
          playerCol: i,
          iplCol: iplIdx,
          pointsCol: pointsIdx
        });
      }
    }
  }

  const teams = [];
  discoveredTeams.forEach(base => {
    let calculatedTotal = 0;
    const roles = teamRoles[base.name] || {};
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      const rawName = row[base.playerCol];
      if (!rawName || rawName === "TOTAL") continue; 
      const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
      const isCaptain = rawName.includes("(C)");
      const isVC = rawName.includes("(VC)");
      const finalIsCaptain = isCaptain || (cleanName === roles.captain);
      const finalIsVC = isVC || (cleanName === roles.viceCaptain);
      const multiplier = finalIsCaptain ? 2 : (finalIsVC ? 1.5 : 1);
      const basePoints = parseFloat(row[base.pointsCol]) || 0;
      calculatedTotal += basePoints * multiplier;
    }
    teams.push({
      id: base.name,
      totalPoints: calculatedTotal
    });
  });
  return teams;
};

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const parsed = parseExcelData(fileBuffer);
console.log(JSON.stringify(parsed, null, 2));
