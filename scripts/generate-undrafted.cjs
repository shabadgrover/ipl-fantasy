const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'MST PLayer List', 'MST_Player_List.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

// Assuming columns are Name, Team, Role
const formattedData = {
  Batsmen: [],
  "All-Rounders": [],
  Bowlers: [],
  Wicketkeepers: []
};

data.forEach(row => {
  const player = {
    name: row['Player Name'],
    team: row['Team'],
    role: row['Role']
  };

  const role = player.role ? player.role.trim().toUpperCase() : '';
  if (role === 'BATSMAN' || role === 'BAT') {
    formattedData.Batsmen.push(player);
  } else if (role === 'ALL-ROUNDER' || role === 'AR' || role === 'ALLROUNDER') {
    formattedData["All-Rounders"].push(player);
  } else if (role === 'BOWLER' || role === 'BOWL') {
    formattedData.Bowlers.push(player);
  } else if (role === 'WICKETKEEPER' || role === 'WK' || role === 'WICKET KEEPER') {
    formattedData.Wicketkeepers.push(player);
  }
});

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'undraftedPlayers.js'), `export const undraftedPlayers = ${JSON.stringify(formattedData, null, 2)};`);
console.log('Undrafted players data generated successfully.');
