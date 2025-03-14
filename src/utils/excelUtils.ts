
import * as XLSX from 'xlsx';

export interface LeaderboardData {
  address: string;
  sparks: number;
}

export async function readLeaderboardData() {
  try {
    const response = await fetch('/Firewall_Sparks_Leaderboard.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);

    return {
      overall: parseSheet(workbook, 'Firewall_Sparks_Leaderboard'),
      week1: parseSheet(workbook, 'week 1'),
      week2: parseSheet(workbook, 'week 2'),
      week3: parseSheet(workbook, 'week 3'),
      week4: parseSheet(workbook, 'week 4'),
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

function parseSheet(workbook: XLSX.WorkBook, sheetName: string): LeaderboardData[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet);
  return data.map((row: any) => ({
    address: row['Address'] || '',
    sparks: Number(row['🔥Sparks']) || 0,
  }));
}
