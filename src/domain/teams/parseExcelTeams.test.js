import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';
import { parseTeamsFromExcelRows } from './parseExcelTeams.js';
import { buildLeaderboard } from '../leaderboard/standings.js';
import { BASELINE_PREVIOUS_MATCH } from '../../config/season2026.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const excelPath = path.resolve(__dirname, '../../../public/data.xlsx');

describe('parseTeamsFromExcelRows', () => {
  it('parses real 2026 data.xlsx with 9 teams', () => {
    if (!fs.existsSync(excelPath)) {
      console.warn('Skipping integration test: public/data.xlsx not found');
      return;
    }

    const buffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(buffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const teams = parseTeamsFromExcelRows(rows);

    expect(teams).toHaveLength(9);
    teams.forEach((team) => {
      expect(team.players.length).toBeGreaterThan(0);
      expect(team.totalPoints).toBeGreaterThan(0);
      expect(team.roles).toBeDefined();
    });

    const leaderboard = buildLeaderboard(teams, BASELINE_PREVIOUS_MATCH);
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard.every((t) => typeof t.trend === 'string')).toBe(true);
  });
});
