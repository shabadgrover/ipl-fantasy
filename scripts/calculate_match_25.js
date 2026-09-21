import fs from 'fs';

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
const teamsData = data.Teams;

const mapping = [
    { name: "Aizen", player: "Aizen", points: "_2" },
    { name: "Ankit's Team", player: "Ankit's Team", points: "_6" },
    { name: "Deepanshuu's Team", player: "Deepanshuu's Team", points: "_10" },
    { name: "GURI XI", player: "GURI XI", points: "_14" },
    { name: "Jenna Morrh Warriors", player: "Jenna Morrh Warriors", points: "_18" },
    { name: "Maat maro shota bacha hu", player: "Maat maro shota bacha hu", points: "_22" },
    { name: "Piyush dhiman's Team", player: "Piyush dhiman's Team", points: "_26" },
    { name: "shabad's Team", player: "shabad's Team", points: "_30" },
    { name: "Sumit's Team", player: "Sumit's Team", points: "_34" }
];

const match24 = {
  "shabad's Team": 3232,
  "Sumit's Team": 3296.5,
  "Deepanshuu's Team": 3122.5,
  "Maat maro shota bacha hu": 2713.5,
  "Piyush dhiman's Team": 2646.5,
  "Ankit's Team": 2606.5,
  "Jenna Morrh Warriors": 2306.5,
  "GURI XI": 2244.5,
  "Aizen": 1656.5
};

const results = [];
const teamPlayerPoints = {};

mapping.forEach(base => {
    let total = 0;
    const roles = teamRoles[base.name];
    teamPlayerPoints[base.name] = [];
    
    for (let i = 1; i < teamsData.length; i++) {
        const row = teamsData[i];
        const rawName = row[base.player];
        if (!rawName || rawName === "TOTAL") continue;
        
        const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
        const isCaptain = rawName.includes("(C)") || cleanName === roles.captain;
        const isVC = rawName.includes("(VC)") || cleanName === roles.viceCaptain;
        
        const multiplier = isCaptain ? 2 : (isVC ? 1.5 : 1);
        const pointsKey = base.points;
        const pointsValue = row[pointsKey];
        const points = parseFloat(pointsValue) || 0;
        const weightedPoints = points * multiplier;
        total += weightedPoints;

        teamPlayerPoints[base.name].push({
            name: cleanName + (isCaptain ? " (C)" : (isVC ? " (VC)" : "")),
            points: weightedPoints
        });
    }
    
    results.push({
        id: base.name,
        totalPoints: total,
        previousPoints: match24[base.name],
        diff: total - match24[base.name]
    });
});

results.sort((a,b) => b.totalPoints - a.totalPoints);

const prevRanks = Object.keys(match24).sort((a,b) => match24[b] - match24[a]);

results.forEach((r, i) => {
    r.rank = i + 1;
    r.prevRank = prevRanks.indexOf(r.id) + 1;
    r.rankDiff = r.prevRank - r.rank;
});

fs.writeFileSync('ranks_match_25.json', JSON.stringify({ results, teamPlayerPoints }, null, 2));
