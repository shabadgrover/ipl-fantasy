import fs from 'fs';

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

const data = JSON.parse(fs.readFileSync('excel-data.json', 'utf8'));
const rows = data.Teams;

// The first row in excel-data.json is the header/labels object
// Actually, excel-data.json structure is an array of objects where keys are "Aizen", "_1", etc.
// The first object (index 0) has values like "Player Name", "IPL Team", "Points"

const headerRow = rows[0];
const discoveredTeams = [];

Object.keys(headerRow).forEach(key => {
    if (headerRow[key] === "Player Name") {
        const teamName = key;
        let pointsKey = null;
        
        // Find the points key for this team
        // It's usually a few keys after the teamName key
        const keys = Object.keys(headerRow);
        const startIndex = keys.indexOf(key);
        for (let i = startIndex; i < keys.length; i++) {
            if (headerRow[keys[i]] === "Points") {
                pointsKey = keys[i];
                break;
            }
            // Stop if we hit another team (starts with a non-blank, non-underscore key that isn't the current team)
            if (i > startIndex && keys[i] !== "" && !keys[i].startsWith('_')) break;
        }
        
        if (pointsKey) {
            discoveredTeams.push({ name: teamName, playerKey: key, pointsKey });
        }
    }
});

const results = {};

discoveredTeams.forEach(team => {
    let totalPoints = 0;
    const roles = teamRoles[team.name] || {};
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rawName = row[team.playerKey];
        if (!rawName || rawName === "TOTAL") continue;
        
        const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
        const isCaptain = rawName.includes("(C)") || cleanName === roles.captain;
        const isVC = rawName.includes("(VC)") || cleanName === roles.viceCaptain;
        
        const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
        const basePoints = parseInt(row[team.pointsKey]) || 0;
        totalPoints += basePoints * multiplier;
    }
    results[team.name] = totalPoints;
});

console.log(JSON.stringify(results, null, 2));
