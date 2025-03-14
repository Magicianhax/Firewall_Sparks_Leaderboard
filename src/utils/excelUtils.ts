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
  // This helps to maintain consistent column names
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: "A" });
  
  // Skip header row and process data
  const dataStartIndex = 1; // Skip header row
  const processedData = rawData.slice(dataStartIndex).map((row: any, index) => {
    // We need to determine column mapping from the header row
    if (index === 0) {
      console.log(`Columns in "${sheetName}" sheet:`, row);
    }
    
    // Extract data from row - handle different possible column formats
    let address = '';
    let sparks = 0;
    let nftCollection = '';
    
    // Process based on column position rather than exact name
    // This is more resilient to different column names
    Object.entries(row).forEach(([col, value]) => {
      // Convert to string for comparison
      const strValue = String(value).toLowerCase();
      
      // Address is typically in column A or column with "address" or "wallet" in header
      if (col === 'A' || (typeof value === 'string' && 
          (strValue.includes('0x') || strValue.length === 42))) {
        address = String(value);
      }
      
      // Sparks is typically a number, often in column B or C
      if (col === 'B' || col === 'C') {
        // Make sure it's a number
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          sparks = numValue;
        }
      }
      
      // NFT Collection might be in columns C, D, or E
      if (includeNFT && (col === 'C' || col === 'D' || col === 'E')) {
        // Only set if it's a string and doesn't look like an address or number
        if (typeof value === 'string' && 
            !strValue.includes('0x') && 
            isNaN(Number(value))) {
          nftCollection = String(value);
        }
      }
    });
    
    // Skip rows with empty address or invalid sparks
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
  }).filter((item): item is LeaderboardData => item !== null); // Remove null items

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: processedData.slice(start, end),
    totalPages: Math.ceil(processedData.length / ITEMS_PER_PAGE),
  };
}
