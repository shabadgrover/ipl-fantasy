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

const match21 = {
  "shabad's Team": 3132,
  "Sumit's Team": 2933.5,
  "Deepanshuu's Team": 2872.5,
  "Piyush dhiman's Team": 2380.5,
  "Ankit's Team": 2263.5,
  "Maat maro shota bacha hu": 2237.5,
  "Jenna Morrh Warriors": 2215.5,
  "GURI XI": 2036.5,
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
        previousPoints: match21[base.name],
        diff: total - match21[base.name]
    });
});

results.sort((a,b) => b.totalPoints - a.totalPoints);

const prevRanks = Object.keys(match21).sort((a,b) => match21[b] - match21[a]);

results.forEach((r, i) => {
    r.rank = i + 1;
    r.prevRank = prevRanks.indexOf(r.id) + 1;
    r.rankDiff = r.prevRank - r.rank;
});

fs.writeFileSync('ranks_match_22.json', JSON.stringify({ results, teamPlayerPoints }, null, 2));
