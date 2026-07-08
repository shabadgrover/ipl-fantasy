import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
  const fileBuffer = fs.readFileSync('./public/data.xlsx');
  const workbook = XLSX.read(fileBuffer);
  
  const result = {};
  workbook.SheetNames.forEach(sheetName => {
    const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    if (roa.length) result[sheetName] = roa;
  });
  
  // Teams sheet contains the cumulative points
  const teamsData = result['Teams'];
  if (!teamsData) {
      console.error("Teams sheet not found");
      process.exit(1);
  }

  const extracted = teamsData.map(team => {
      // The columns are likely _1, _2 ... _35 or similar.
      // Match 23 is likely in a specific column.
      // Usually the total is in the last column or calculated.
      // Looking at analyze-excel.js and ranks_match_22.json, I should see how totalPoints is derived.
      return team;
  });

  fs.writeFileSync('match_23_dump.json', JSON.stringify(extracted, null, 2));
  console.log("Successfully dumped Teams data to match_23_dump.json");
} catch (error) {
  console.error("Error reading excel file:", error.message);
}
