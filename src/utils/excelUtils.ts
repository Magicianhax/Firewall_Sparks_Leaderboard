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
    
    // Debug: Log actual sheet names
    console.log("Available sheets:", workbook.SheetNames);
    
    // More resilient approach - find sheets that match our expected names approximately
    const findSheet = (targetName: string): string => {
      // Try exact match first
      if (workbook.SheetNames.includes(targetName)) return targetName;
      
      // Try case-insensitive match
      const lowerTarget = targetName.toLowerCase();
      const match = workbook.SheetNames.find(name => name.toLowerCase() === lowerTarget);
      if (match) return match;
      
      // Try match with trimmed spaces
      const trimmedTarget = targetName.trim();
      const trimMatch = workbook.SheetNames.find(name => name.trim() === trimmedTarget);
      if (trimMatch) return trimMatch;
      
      // Return the default if no matches
      return targetName;
    };
    
    return {
      overall: parseSheet(workbook, findSheet('Firewall_Sparks_Leaderboard'), page, false),
      week1: parseSheet(workbook, findSheet('week 1'), page, false),
      week2: parseSheet(workbook, findSheet('week 2'), page, true),
      week3: parseSheet(workbook, findSheet('week 3'), page, false),
      week4: parseSheet(workbook, findSheet('week 4'), page, false),
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

  // Convert sheet data to JSON with header row option
  const rawData = XLSX.utils.sheet_to_json(sheet);
  
  // Process data, skipping the header row
  const processedData = rawData.map((row: any) => {
    let address = '';
    let sparks = 0;
    let nftCollection = '';
    
    // For overall sheet (Firewall_Sparks_Leaderboard)
    if ('Address' in row && '🔥Sparks' in row) {
      address = row['Address'];
      sparks = Number(row['🔥Sparks']);
    }
    
    // For week 2 sheet
    if ('Address' in row && 'NFT collection' in row && '🔥Sparks' in row) {
      address = row['Address'];
      sparks = Number(row['🔥Sparks']);
      nftCollection = row['NFT collection'];
    }

    // Skip invalid entries
    if (!address || isNaN(sparks)) {
      return null;
    }

    const baseData = {
      address,
      sparks,
    };

    if (includeNFT && nftCollection) {
      return {
        ...baseData,
        nftCollection,
      };
    }

    return baseData;
  }).filter((item): item is LeaderboardData => item !== null);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: processedData.slice(start, end),
    totalPages: Math.ceil(processedData.length / ITEMS_PER_PAGE),
  };
}
