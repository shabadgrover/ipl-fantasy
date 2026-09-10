
import * as XLSX from 'xlsx';
import * as fs from 'fs';

const fileBuffer = fs.readFileSync('./public/data.xlsx');
const workbook = XLSX.read(fileBuffer);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

for (let i = 0; i < headers.length; i++) {
    if (headers[i] === "Ankit's Team" && labels[i] === "Points") {
        for (let r = 2; r < rows.length; r++) {
            if (rows[r][i-1] === "TOTAL") {
                console.log(`Ankit's Team TOTAL Points: ${rows[r][i]}`);
            }
        }
    }
}
