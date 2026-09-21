import { parseExcelData } from './src/utils/excelParser.js';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
// Convert Node buffer to ArrayBuffer
const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);

const parsedTeams = parseExcelData(arrayBuffer);

console.log("PARSED STANDINGS FROM EXCEL:");
const sorted = [...parsedTeams].sort((a, b) => b.totalPoints - a.totalPoints);
sorted.forEach((team, idx) => {
  console.log(`${idx + 1}. ${team.id}: ${team.totalPoints}`);
});
