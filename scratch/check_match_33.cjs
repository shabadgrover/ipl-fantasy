const XLSX = require('xlsx');
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

const match33Points = {
    "Tilak Varma": 73,
    "Jasprit Bumrah": 66,
    "Suryakumar Yadav": 64,
    "Quinton de Kock": 15,
    "Hardik Pandya": 7,
    "Sherfane Rutherford": 2,
    "Sanju Samson": 219,
    "Noor Ahmad": 86,
    "Dewald Brevis": 57,
    "Ruturaj Gaikwad": 48,
    "Shivam Dube": 9
};

const workbook = XLSX.readFile('public/data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const discoveredTeams = [];
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    discoveredTeams.push({ name: header.trim(), playerCol: i });
  }
}

discoveredTeams.forEach(team => {
    let teamMatchTotal = 0;
    const roles = teamRoles[team.name] || {};
    console.log(`\nTeam: ${team.name}`);
    
    for (let i = 2; i < rows.length; i++) {
        const rawName = rows[i][team.playerCol];
        if (!rawName || rawName === "TOTAL") continue;
        
        const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
        if (match33Points[cleanName] !== undefined) {
            const isCaptain = rawName.includes("(C)") || cleanName === roles.captain;
            const isVC = rawName.includes("(VC)") || cleanName === roles.viceCaptain;
            const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
            const points = match33Points[cleanName] * multiplier;
            teamMatchTotal += points;
            console.log(`  - ${cleanName}${isCaptain?' (C)':(isVC?' (VC)':'')}: ${match33Points[cleanName]} x ${multiplier} = ${points}`);
        }
    }
    console.log(`  Match Total: ${teamMatchTotal}`);
});
