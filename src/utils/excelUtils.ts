
import * as XLSX from 'xlsx';
import { GOOGLE_SHEET_ID, getGoogleSheetUrl } from '@/config/fileConfig';

// Define the items per page constant at the file level
const ITEMS_PER_PAGE = 50;

// Google Sheets URL from config
const SHEET_URL = getGoogleSheetUrl();

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

export async function readLeaderboardData(page: number = 1, fullData: boolean = false) {
  try {
    console.log('Fetching data from Google Sheets...');
    
    // Fetch the Excel data from Google Sheets
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    console.log('Successfully fetched sheet data');

    // Parse the Excel data
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
    console.log("Parsed workbook, sheets:", workbook.SheetNames);
    
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
  } catch (error) {
    console.error('Error reading sheet data:', error);
    return null;
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
