const XLSX = require('xlsx');
const fs = require('fs');

const match33Points = {
    "AM Ghazanfar": 90,
    "Ashwani Kumar": 81,
    "Tilak Varma": 73,
    "Jasprit Bumrah": 66,
    "Mitchell Santner": 64,
    "Suryakumar Yadav": 64,
    "Quinton de Kock": 15,
    "Naman Dhir": 10,
    "Hardik Pandya": 7,
    "Shardul Thakur": 4,
    "Sherfane Rutherford": 2,
    "Danish Malewar": 2,
    "Sanju Samson": 219,
    "Akeal Hosein": 202,
    "Noor Ahmad": 86,
    "Jamie Overton": 77,
    "Mukesh Choudhary": 74,
    "Anshul Kamboj": 74,
    "Gurjapneet Singh": 62,
    "Dewald Brevis": 57,
    "Ruturaj Gaikwad": 48,
    "Sarfaraz Khan": 38,
    "Kartik Sharma": 32,
    "Shivam Dube": 9
};

const workbook = XLSX.readFile('public/data.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const headers = rows[0];
const labels = rows[1];

// Find all points columns
const pointsColumns = [];
for (let i = 0; i < labels.length; i++) {
    if (labels[i] === "Points") {
        // Find the player name column associated with this points column
        let playerCol = -1;
        for (let j = i; j >= 0; j--) {
            if (labels[j] === "Player Name") {
                playerCol = j;
                break;
            }
        }
        if (playerCol !== -1) {
            pointsColumns.push({ playerCol, pointsCol: i });
        }
    }
}

let updatedCount = 0;
const missingPlayers = new Set();

for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    pointsColumns.forEach(({ playerCol, pointsCol }) => {
        const rawName = row[playerCol];
        if (rawName && rawName !== "TOTAL") {
            const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
            if (match33Points[cleanName] !== undefined) {
                const currentPoints = parseFloat(row[pointsCol]) || 0;
                row[pointsCol] = currentPoints + match33Points[cleanName];
                updatedCount++;
            } else {
                // Check if this player is from MI or CSK but missing from our points map
                // We don't have team info here easily without parsing IPL Team column
            }
        }
    });
}

// Log missing players from the match33Points map that weren't found in the sheet
const foundPlayers = new Set();
for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    pointsColumns.forEach(({ playerCol }) => {
        const rawName = row[playerCol];
        if (rawName && rawName !== "TOTAL") {
            const cleanName = rawName.replace(/\s*\(\s*(C|VC)\s*\)\s*/i, "").trim();
            if (match33Points[cleanName] !== undefined) {
                foundPlayers.add(cleanName);
            }
        }
    });
}

Object.keys(match33Points).forEach(p => {
    if (!foundPlayers.has(p)) {
        missingPlayers.add(p);
    }
});

console.log(`Updated ${updatedCount} player entries.`);
if (missingPlayers.size > 0) {
    console.log("Missing players from Excel sheet:", Array.from(missingPlayers));
}

// Update TOTAL rows if they exist
for (let i = 2; i < rows.length; i++) {
    const row = rows[i];
    pointsColumns.forEach(({ playerCol, pointsCol }) => {
        if (row[playerCol] === "TOTAL") {
            let sum = 0;
            for (let j = 2; j < i; j++) {
                sum += parseFloat(rows[j][pointsCol]) || 0;
            }
            row[pointsCol] = sum;
        }
    });
}

// Write back to Excel
const newSheet = XLSX.utils.aoa_to_sheet(rows);
workbook.Sheets[workbook.SheetNames[0]] = newSheet;
XLSX.writeFile(workbook, 'public/data.xlsx');

console.log("public/data.xlsx updated successfully.");
