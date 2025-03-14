import * as XLSX from 'xlsx';

export interface LeaderboardData {
  address: string;
  sparks: number;
  nftCollection?: string; // Only for week 2
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
    
    // Process all sheets exactly the same way
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

  // Convert to JSON with the most simple approach - use raw values only
  const allData = XLSX.utils.sheet_to_json(sheet);
  
  // Map the data to our expected format
  const formattedData = allData.map((row: any) => {
    // Get address - assuming first property regardless of name
    const addressKey = Object.keys(row)[0];
    const address = row[addressKey] || '';
    
    // Get sparks - assuming second property regardless of name
    const sparksKey = Object.keys(row)[1];
    const sparks = Number(row[sparksKey]) || 0;
    
    // Create basic data structure
    const baseData: LeaderboardData = {
      address: String(address),
      sparks: sparks
    };
    
    // For week 2, add NFT collection if needed and available
    if (includeNFT) {
      const nftKey = Object.keys(row)[2];
      if (nftKey && row[nftKey]) {
        baseData.nftCollection = String(row[nftKey]);
      }
    }
    
    return baseData;
  });
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}
