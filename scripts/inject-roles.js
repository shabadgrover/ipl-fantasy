import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
  const fileBuffer = fs.readFileSync('public/data.xlsx');
  const workbook = XLSX.read(fileBuffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Modify some cells to add (C) and (VC) for testing
  // Based on excel-data.json analysis:
  // Ankit's Team: Virat Kohli is at row 39, column 4 (index 4 in 2D array if headers included)
  // Let's use a more robust search and replace.
  
  const range = XLSX.utils.decode_range(sheet['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = { c: C, r: R };
      const cell_ref = XLSX.utils.encode_cell(cell_address);
      const cell = sheet[cell_ref];
      if (cell && cell.v === "Virat Kohli") {
        cell.v = "Virat Kohli (C)";
      }
      if (cell && cell.v === "Shubman Gill") {
        cell.v = "Shubman Gill (VC)";
      }
      if (cell && cell.v === "Ishan Kishan") {
        cell.v = "Ishan Kishan (C)";
      }
      if (cell && cell.v === "KL Rahul") {
        cell.v = "KL Rahul (VC)";
      }
    }
  }
  
  XLSX.writeFile(workbook, 'public/data.xlsx');
  console.log("Successfully updated excel with test markers.");
} catch (error) {
  console.error("Error updating excel:", error.message);
}
