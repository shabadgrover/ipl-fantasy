import { parseExcelData } from './src/utils/excelParser.js';
import * as fs from 'fs';

const arrayBuffer = fs.readFileSync('./public/data.xlsx').buffer;
const teams = parseExcelData(arrayBuffer);

const result = teams.map(t => ({ name: t.teamName, points: t.totalPoints }))
  .sort((a,b) => b.points - a.points);

fs.writeFileSync('ranks_result.json', JSON.stringify(result, null, 2));
console.log("Written to ranks_result.json");
