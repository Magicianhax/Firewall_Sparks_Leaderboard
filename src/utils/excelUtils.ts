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
    
    return {
      overall: parseOverallSheet(workbook, 'Firewall_Sparks_Leaderboard', page),
      week1: parseSheet(workbook, 'week 1', page, false),
      week2: parseWeek2Sheet(workbook, 'week 2', page),
      week3: parseSheet(workbook, 'week 3', page, false),
      week4: parseSheet(workbook, 'week 4', page, false),
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

// Regular parser for week 1, 3, and 4
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

  // Convert to JSON with the most simple approach
  const allData = XLSX.utils.sheet_to_json(sheet);
  
  // Map the data to our expected format
  const formattedData = allData.map((row: any) => {
    // Get address and sparks from the first two properties
    const keys = Object.keys(row);
    const address = keys.length > 0 ? row[keys[0]] : '';
    const sparks = keys.length > 1 ? Number(row[keys[1]]) : 0;
    
    return {
      address: String(address || ''),
      sparks: isNaN(sparks) ? 0 : sparks
    };
  });
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Special parser for the overall sheet which has a header row
function parseOverallSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number
): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  // Convert to JSON but skip the header row
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
  // Skip the first row if it contains "Address" - it's a header
  let dataToProcess = rawData;
  if (rawData.length > 0 && 
      Array.isArray(rawData[0]) && 
      rawData[0][0] === "Address") {
    dataToProcess = rawData.slice(1);
  }
  
  // Map the data to our expected format
  const formattedData = dataToProcess.map((row: any) => {
    // Skip rows that don't have at least 2 elements
    if (!Array.isArray(row) || row.length < 2) {
      return null;
    }
    
    return {
      address: String(row[0] || ''),
      sparks: Number(row[1]) || 0
    };
  }).filter(Boolean) as LeaderboardData[];
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Special parser for week 2 which has NFT collection
function parseWeek2Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number
): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  // Convert to JSON 
  const allData = XLSX.utils.sheet_to_json(sheet);
  
  // Map the data to our expected format, handling the NFT column
  const formattedData = allData.map((row: any) => {
    const keys = Object.keys(row);
    
    // Skip if we don't have enough keys
    if (keys.length < 2) return null;
    
    // Get address and sparks
    const address = row[keys[0]];
    const sparks = Number(row[keys[1]]);
    
    // Get NFT collection from third column if it exists
    // But skip if it contains "NFT: 🔥Sparks" 
    let nftCollection = '';
    if (keys.length > 2) {
      const nftValue = row[keys[2]];
      if (nftValue !== "NFT: 🔥Sparks" && nftValue) {
        nftCollection = String(nftValue);
      }
    }
    
    return {
      address: String(address || ''),
      sparks: isNaN(sparks) ? 0 : sparks,
      ...(nftCollection ? { nftCollection } : {})
    };
  }).filter(Boolean) as LeaderboardData[];
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}
