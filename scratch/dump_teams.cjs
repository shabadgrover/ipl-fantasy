
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

const teams = {};
for (let i = 0; i < headers.length; i++) {
  const header = headers[i];
  if (header && typeof header === 'string' && header.trim() !== "" && labels[i] === "Player Name") {
    const teamName = header.trim();
    teams[teamName] = [];
    for (let r = 2; r < rows.length; r++) {
      const name = rows[r][i];
      if (name && name !== "TOTAL" && name !== "MST Costs") {
        teams[teamName].push(name);
      }
    }
  }
}

console.log(JSON.stringify(teams, null, 2));
