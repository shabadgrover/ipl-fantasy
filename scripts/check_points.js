import fs from 'fs';
const data = JSON.parse(fs.readFileSync('excel-data.json', 'utf8'));
const teamsData = data.Teams;
const shabadPoints = teamsData.map(row => row['_30']);
console.log(shabadPoints);
