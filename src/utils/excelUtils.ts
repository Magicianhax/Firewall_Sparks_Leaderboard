
import * as XLSX from 'xlsx';

export interface LeaderboardData {
  address: string;
  sparks: number;
  nftCollection?: string; // Added for week 2
}

export interface LeaderboardResponse {
  data: LeaderboardData[];
  totalPages: number;
}

export async function readLeaderboardData(page: number = 1) {
  try {
    const response = await fetch('/Firewall_Sparks_Leaderboard.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);

    return {
      overall: parseSheet(workbook, 'Firewall_Sparks_Leaderboard', page, false),
      week1: parseSheet(workbook, 'week 1', page, false),
      week2: parseSheet(workbook, 'week 2', page, true),
      week3: parseSheet(workbook, 'week 3', page, false),
      week4: parseSheet(workbook, 'week 4', page, false),
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

function parseSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  includeNFT: boolean
): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const allData = XLSX.utils.sheet_to_json(sheet).map((row: any) => {
    const baseData = {
      address: row['Address'] || '',
      sparks: Number(row['🔥Sparks']) || 0,
    };

    if (includeNFT) {
      return {
        ...baseData,
        nftCollection: row['NFT collection'] || '',
      };
    }

    return baseData;
  });

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: allData.slice(start, end),
    totalPages: Math.ceil(allData.length / ITEMS_PER_PAGE),
  };
}
