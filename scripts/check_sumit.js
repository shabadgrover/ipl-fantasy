import fs from 'fs';
const data = JSON.parse(fs.readFileSync('excel-data.json', 'utf8'));
const teamsData = data.Teams;
const sumitPoints = teamsData.map(row => row['_34']);
console.log(sumitPoints);
