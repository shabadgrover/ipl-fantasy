
import { parseExcelData } from '../src/utils/excelParser.js';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
const teams = parseExcelData(arrayBuffer);

const sumit = teams.find(t => t.teamName === "Sumit's Team");
console.log(sumit.totalPoints);
