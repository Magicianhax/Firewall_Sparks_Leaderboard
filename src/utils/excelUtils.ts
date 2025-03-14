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

export async function readLeaderboardData(page: number = 1, fullData: boolean = false) {
  try {
    const response = await fetch('/Firewall_Sparks_Leaderboard.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    
    return {
      overall: parseOverallSheet(workbook, 'Firewall_Sparks_Leaderboard', page, fullData),
      week1: parseWeek1Sheet(workbook, 'week 1', page, fullData),
      week2: parseWeek2Sheet(workbook, 'week 2', page, fullData),
      week3: parseWeek3Sheet(workbook, 'week 3', page, fullData),
      week4: parseWeek4Sheet(workbook, 'week 4', page, fullData),
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return null;
  }
}

function parseOverallSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
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
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  const headers = rawData[0] || {};
  console.log(`Week 1 sheet headers:`, headers);
  
  const formattedData = rawData.slice(1).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const verificationKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase().includes('sloth')
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
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
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
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  const headers = rawData[0] || {};
  console.log(`Week 3 sheet headers:`, headers);
  
  const formattedData = rawData.slice(1).map((row: any) => {
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
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  
  const headers = rawData[0] || {};
  console.log(`Week 4 sheet headers:`, headers);
  
  const formattedData = rawData.slice(1).map((row: any) => {
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
