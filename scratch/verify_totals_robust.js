
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
    const header = headers[i];
    if (header && header.includes("Ankit")) {
        console.log(`Found team: ${header} at col ${i}`);
        // Find points col
        let pointsCol = -1;
        for (let j = i; j < labels.length; j++) {
            if (labels[j] === "Points") {
                pointsCol = j;
                break;
            }
            if (headers[j] && headers[j] !== header) break;
        }
        
        if (pointsCol !== -1) {
            console.log(`Points col for ${header} is ${pointsCol}`);
            for (let r = 2; r < rows.length; r++) {
                if (rows[r][i] === "TOTAL") {
                    console.log(`TOTAL Points for ${header}: ${rows[r][pointsCol]}`);
                }
            }
        }
    }
}
