
import * as XLSX from 'xlsx';

// Define the items per page constant at the file level
const ITEMS_PER_PAGE = 50;

export interface LeaderboardData {
  address: string;
  sparks: number;
  nftCollection?: string; // Only for week 2
  hotSlothVerification?: string; // Only for week 1
  referralBonus?: string; // Only for week 3, 4, 5
}

export interface LeaderboardResponse {
  data: LeaderboardData[];
  totalPages: number;
}

export async function readLeaderboardData(page: number = 1, fullData: boolean = false, customPath?: string) {
  try {
    let possiblePaths = [];
    
    // If a custom path is provided, try it first
    if (customPath) {
      possiblePaths.push(customPath);
    }
    
    // Add all the default paths
    possiblePaths = [
      ...possiblePaths,
      // Absolute paths 
      '/Firewall Sparks Leaderboard.xlsx',
      // Path relative to document base
      './Firewall Sparks Leaderboard.xlsx',
      // Check in public folder
      '/public/Firewall Sparks Leaderboard.xlsx',
      // Check in root
      'Firewall Sparks Leaderboard.xlsx',
      // Check in assets folder
      '/assets/Firewall Sparks Leaderboard.xlsx',
      // Try with URL encoded spaces
      '/Firewall%20Sparks%20Leaderboard.xlsx',
      // Try with special characters fixed
      '/FirewallSparksLeaderboard.xlsx',
      // Try with domain name
      window.location.origin + '/Firewall Sparks Leaderboard.xlsx',
      // Full URL with protocol
      window.location.protocol + '//' + window.location.host + '/Firewall Sparks Leaderboard.xlsx'
    ];
    
    let response = null;
    let successfulPath = '';
    let errorDetails = [];
    
    // Try each path until one works
    for (const path of possiblePaths) {
      try {
        console.log(`Attempting to fetch Excel file from: ${path}`);
        const attemptResponse = await fetch(path, {
          cache: 'no-store', // Completely prevent caching
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (attemptResponse.ok) {
          response = attemptResponse;
          successfulPath = path;
          console.log(`Successfully fetched Excel file from: ${path}`);
          break;
        } else {
          errorDetails.push(`Path ${path}: ${attemptResponse.status} ${attemptResponse.statusText}`);
        }
      } catch (pathError) {
        console.log(`Failed to fetch from ${path}:`, pathError);
        errorDetails.push(`Path ${path}: ${pathError instanceof Error ? pathError.message : String(pathError)}`);
      }
    }
    
    if (!response || !response.ok) {
      console.error('All file paths failed. Could not load Excel file.');
      console.error('Error details:', errorDetails);
      throw new Error(`Could not find the Excel file. Tried paths: ${possiblePaths.join(', ')}. Error details: ${errorDetails.join('; ')}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log(`Successfully fetched Excel file from ${successfulPath}, size:`, arrayBuffer.byteLength);
    
    if (arrayBuffer.byteLength === 0) {
      throw new Error('Excel file is empty (0 bytes)');
    }
    
    try {
      // Use the correct options for parsing Excel files
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
      console.log("Parsed workbook, sheets:", workbook.SheetNames);
      
      if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('Excel file has no sheets');
      }
      
      // Find the sheet names
      const overallSheet = findSheet(workbook, ['Leaderboard', 'overall', 'firewall', 'sparks']);
      const week1Sheet = findSheet(workbook, ['week 1', 'week1']);
      const week2Sheet = findSheet(workbook, ['week 2', 'week2']);
      const week3Sheet = findSheet(workbook, ['week 3', 'week3']);
      const week4Sheet = findSheet(workbook, ['week 4', 'week4']);
      const week5Sheet = findSheet(workbook, ['week 5', 'week5']);
      const week6Sheet = findSheet(workbook, ['week 6', 'week6']);
      const week7Sheet = findSheet(workbook, ['week 7', 'week7']);
      
      return {
        overall: parseOverallSheet(workbook, overallSheet || 'Leaderboard', page, fullData),
        week1: parseWeek1Sheet(workbook, week1Sheet || 'week 1', page, fullData),
        week2: parseWeek2Sheet(workbook, week2Sheet || 'week 2', page, fullData),
        week3: parseWeek3Sheet(workbook, week3Sheet || 'week 3', page, fullData),
        week4: parseWeek4Sheet(workbook, week4Sheet || 'week 4', page, fullData),
        week5: parseWeek5Sheet(workbook, week5Sheet || 'week 5', page, fullData),
        week6: parseWeekSheet(workbook, week6Sheet || 'week 6', page, fullData),
        week7: parseWeekSheet(workbook, week7Sheet || 'week 7', page, fullData),
      };
    } catch (parseError) {
      console.error('Excel parsing error:', parseError);
      throw new Error(`Failed to parse Excel file: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error; // Re-throw to show detailed error to user
  }
}

// Helper function to find a sheet by name or keywords
function findSheet(workbook: XLSX.WorkBook, keywords: string[]): string | null {
  const sheetNames = workbook.SheetNames;
  
  // Try exact match first
  for (const keyword of keywords) {
    if (sheetNames.includes(keyword)) {
      return keyword;
    }
  }
  
  // Try to find a sheet that contains the keyword
  for (const sheetName of sheetNames) {
    for (const keyword of keywords) {
      if (sheetName.toLowerCase().includes(keyword.toLowerCase())) {
        return sheetName;
      }
    }
  }
  
  return null;
}

function parseOverallSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Overall sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek1Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Week 1 sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const verificationKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('sloth') || 
             String(headers[key]).toLowerCase().includes('verification')
    ) || 'B';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      hotSlothVerification: row[verificationKey] ? String(row[verificationKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek2Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Week 2 sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const nftKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('nft') || 
             String(headers[key]).toLowerCase().includes('collection')
    ) || 'B';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      nftCollection: row[nftKey] ? String(row[nftKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek3Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Week 3 sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    const referralKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('referral')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek4Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Week 4 sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    const referralKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('referral')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek5Sheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`Week 5 sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    const referralKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('referral')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Generic parser function for Week 6 and Week 7
function parseWeekSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip the first row (time period) and use the second row (index 1) as headers
  const headers = rawData[1] || {};
  console.log(`${sheetName} sheet headers:`, headers);
  
  const formattedData = rawData.slice(2).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    const referralKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('referral')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  if (fullData) {
    return {
      data: formattedData,
      totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
    };
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}
