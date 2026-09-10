import * as XLSX from 'xlsx';
import { parseTeamsFromExcelRows } from '../domain/teams/parseExcelTeams.js';

export { IPL_TEAM_MAP, iplTeamMap } from '../domain/teams/iplTeams.js';

export const parseExcelData = (arrayBuffer) => {
  const data = new Uint8Array(arrayBuffer);
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  return parseTeamsFromExcelRows(rows);
};
