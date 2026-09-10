
import { parseExcelData } from '../src/utils/excelParser.js';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const arrayBuffer = fileBuffer.buffer.slice(fileBuffer.byteOffset, fileBuffer.byteOffset + fileBuffer.byteLength);
const teams = parseExcelData(arrayBuffer);

const jenna = teams.find(t => t.teamName === "Jenna Morrh Warriors");
console.log(JSON.stringify(jenna, null, 2));
