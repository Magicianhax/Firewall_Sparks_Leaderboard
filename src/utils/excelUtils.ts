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
    
    // Read the Excel file with more detailed options
    const workbook = XLSX.read(arrayBuffer, {
      cellDates: true,  // Correctly parse dates
      cellStyles: true, // Preserve styling information
      cellNF: true,     // Preserve number formats
      sheetStubs: true  // Create stub cells for empty cells
    });
    
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

  // Convert sheet data to JSON without headers
  // We'll parse based on column position instead
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
  
  // Skip header row and process data
  const dataStartIndex = 1; // Skip header row
  const processedData = rawData.slice(dataStartIndex).map((row: any, index) => {
    // Log the structure of first row for debugging
    if (index === 0) {
      console.log(`First data row in "${sheetName}" sheet:`, row);
    }
    
    // Extract data from row - handle different possible column formats
    let address = '';
    let sparks = 0;
    let nftCollection = '';
    
    // Process based on array positions directly
    // This is more resilient to column header variations
    
    // Check if row is an array
    if (Array.isArray(row)) {
      // Assume first column (index 0) is the address
      if (row[0] && typeof row[0] === 'string') {
        address = row[0].toString().trim();
      }
      
      // Assume second column (index 1) is the sparks count
      if (row[1] !== undefined && row[1] !== '') {
        const numValue = Number(row[1]);
        if (!isNaN(numValue)) {
          sparks = numValue;
        }
      }
      
      // If NFT collection is included, check third column (index 2)
      if (includeNFT && row[2] !== undefined && row[2] !== '') {
        nftCollection = row[2].toString().trim();
      }
    } else {
      // Fallback for non-array format (should not happen with header:1 option)
      console.warn('Unexpected row format:', row);
    }
    
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
