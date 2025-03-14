import * as XLSX from 'xlsx';

export interface LeaderboardData {
  address: string;
  sparks: number;
  nftCollection?: string; // Only for week 2
  hotSlothVerification?: string; // Only for week 1
  referralBonus?: string; // Only for week 3
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
      week1: parseWeek1Sheet(workbook, 'week 1', page),
      week2: parseWeek2Sheet(workbook, 'week 2', page),
      week3: parseWeek3Sheet(workbook, 'week 3', page),
      week4: parseWeek4Sheet(workbook, 'week 4', page),
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

// Overall tab: Address, 🔥Sparks
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

  // Convert to raw data with headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip title row and use the second row as headers for overall sheet
  const headers = rawData[1] || {};
  console.log(`Overall sheet headers:`, headers);
  
  // Skip title and header rows for data processing
  const formattedData = rawData.slice(2).map((row: any) => {
    // Find Address column
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    // Find Sparks column
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Week 1 tab: Address, Hot Sloth Verification, 🔥Sparks
function parseWeek1Sheet(
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

  // Convert to raw data with headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Extract the expected column headers
  const headers = rawData[0] || {};
  console.log(`Week 1 sheet headers:`, headers);
  
  // Skip header row and process data
  const formattedData = rawData.slice(1).map((row: any) => {
    // Find Address column
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    // Find Hot Sloth Verification column
    const verificationKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('sloth')
    ) || 'B';
    
    // Find Sparks column
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      hotSlothVerification: row[verificationKey] ? String(row[verificationKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Week 2 tab: Address, NFT collection, ���Sparks
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

  // Convert to raw data with headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Skip title row and use the second row as headers for week 2
  const headers = rawData[1] || {};
  console.log(`Week 2 sheet headers:`, headers);
  
  // Skip title and header rows for data processing
  const formattedData = rawData.slice(2).map((row: any) => {
    // Find Address column
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    // Find NFT collection column
    const nftKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('nft') || 
             String(headers[key]).toLowerCase().includes('collection')
    ) || 'B';
    
    // Find Sparks column
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      nftCollection: row[nftKey] ? String(row[nftKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Week 3 tab: Address, 🔥Sparks, Referral Bonus
function parseWeek3Sheet(
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

  // Convert to raw data with headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Extract the expected column headers
  const headers = rawData[0] || {};
  console.log(`Week 3 sheet headers:`, headers);
  
  // Skip header row and process data
  const formattedData = rawData.slice(1).map((row: any) => {
    // Find Address column
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    // Find Sparks column
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    // Find Referral Bonus column
    const referralKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('referral')
    ) || 'C';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0,
      referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

// Week 4 tab: Address, 🔥Sparks
function parseWeek4Sheet(
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

  // Convert to raw data with headers
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  // Extract the expected column headers
  const headers = rawData[0] || {};
  console.log(`Week 4 sheet headers:`, headers);
  
  // Skip header row and process data
  const formattedData = rawData.slice(1).map((row: any) => {
    // Find Address column
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    // Find Sparks column
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(row[sparksKey]) || 0
    };
  }).filter(item => item.address && !isNaN(item.sparks));
  
  // Paginate the data
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}
