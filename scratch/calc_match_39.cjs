
const fs = require('fs');

const match39Points = {
  "Kyle Jamieson": 60,
  "Abishek Porel": 48,
  "David Miller": 35,
  "T Natarajan": 14,
  "Dushmantha Chameera": 14,
  "Tristan Stubbs": 13,
  "Nitish Rana": 5,
  "KL Rahul": 5,
  "Axar Patel": 4,
  "Sameer Rizvi": 2,
  "Sahil Parakh": 2,
  "Kuldeep Yadav": -1,
  "Josh Hazlewood": 182,
  "Bhuvneshwar Kumar": 148,
  "Suyash Sharma": 102,
  "Devdutt Padikkal": 96,
  "Krunal Pandya": 58,
  "Virat Kohli": 47,
  "Jacob Bethell": 46,
  "Jitesh Sharma": 40,
  "Rasikh Salam": 38,
  "Romario Shepherd": 8,
  "Rajat Patidar": 4,
  "Tim David": 4
};

const teamRoles = {
  "Ankit's Team": { captain: "Virat Kohli", viceCaptain: "Sai Sudharsan" },
  "shabad's Team": { captain: "Shubman Gill", viceCaptain: "Yashasvi Jaiswal" },
  "Aizen": { captain: "Vaibhav Sooryavanshi", viceCaptain: "Ishan Kishan" },
  "Jenna Morrh Warriors": { captain: "Ruturaj Gaikwad", viceCaptain: "Hardik Pandya" },
  "Piyush dhiman's Team": { captain: "Suryakumar Yadav", viceCaptain: "Kagiso Rabada" },
  "Maat maro shota bacha hu": { captain: "Shreyas Iyer", viceCaptain: "Marco Jansen" },
  "GURI XI": { captain: "Dewald Brevis", viceCaptain: "Dhruv Jurel" },
  "Deepanshuu's Team": { captain: "Jos Buttler", viceCaptain: "Sanju Samson" },
  "Sumit's Team": { captain: "Rishabh Pant", viceCaptain: "Abhishek Sharma" }
};

const data = JSON.parse(fs.readFileSync('excel-data.json', 'utf8'));
const rows = data.Teams;

const headerRow = rows[0];
const discoveredTeams = [];

Object.keys(headerRow).forEach(key => {
    if (headerRow[key] === "Player Name") {
        const teamName = key;
        let pointsKey = null;
        const keys = Object.keys(headerRow);
        const startIndex = keys.indexOf(key);
        for (let i = startIndex; i < keys.length; i++) {
            if (headerRow[keys[i]] === "Points") {
                pointsKey = keys[i];
                break;
            }
            if (i > startIndex && keys[i] !== "" && !keys[i].startsWith('_')) break;
        }
        if (pointsKey) {
            discoveredTeams.push({ name: teamName, playerKey: key, pointsKey });
        }
    }
});

const currentMatchAddition = {};

discoveredTeams.forEach(team => {
    let addition = 0;
    const roles = teamRoles[team.name] || {};
    
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const rawName = row[team.playerKey];
        if (!rawName || rawName === "TOTAL" || rawName === "MST Costs") continue;
        
        const cleanName = rawName.replace(/\s*\(\s*(C|VC|New|Out)\s*\)\s*/gi, "").trim();
        const matchPoints = match39Points[cleanName] || 0;
        
        if (matchPoints !== 0) {
            const isCaptain = cleanName === roles.captain;
            const isVC = cleanName === roles.viceCaptain;
            const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
            const pointsToAdd = matchPoints * multiplier;
            addition += pointsToAdd;
            console.log(`[${team.name}] ${cleanName}: ${matchPoints} x ${multiplier} = ${pointsToAdd}`);
        }
    }
    currentMatchAddition[team.name] = addition;
});

console.log("\nMatch 39 Additions:");
console.log(JSON.stringify(currentMatchAddition, null, 2));
