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
    
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    
    const sheetNames = workbook.SheetNames;
    console.log("Available sheets in Excel file:", sheetNames);
    
    const week5SheetName = sheetNames.find(name => 
      name.toLowerCase() === 'week 5' || 
      name.toLowerCase() === 'week5'
    );
    
    console.log("Week 5 sheet found:", week5SheetName);
    
    return {
      overall: parseOverallSheet(workbook, 'Firewall_Sparks_Leaderboard', page, fullData),
      week1: parseWeek1Sheet(workbook, 'week 1', page, fullData),
      week2: parseWeek2Sheet(workbook, 'week 2', page, fullData),
      week3: parseWeek3Sheet(workbook, 'week 3', page, fullData),
      week4: parseWeek4Sheet(workbook, 'week 4', page, fullData),
      week5: week5SheetName ? 
        parseWeek5Sheet(workbook, week5SheetName, page, fullData) : 
        { data: [], totalPages: 0 }, // Return empty data if week 5 sheet doesn't exist
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    
    if (import.meta.env.DEV) {
      console.log("Using mock data for development");
      return generateMockData(page, fullData);
    }
    
    return null;
  }
}

function generateMockData(page: number, fullData: boolean) {
  const ITEMS_PER_PAGE = 50;
  const generateEntries = (count: number, prefix: string) => {
    return Array(count).fill(0).map((_, i) => ({
      address: `0x${Math.random().toString(16).substring(2, 12)}${i}`,
      sparks: Math.floor(Math.random() * 2000000),
      ...(prefix === 'week1' ? { hotSlothVerification: Math.random() > 0.5 ? 'Yes' : 'No' } : {}),
      ...(prefix === 'week2' ? { nftCollection: `Collection ${i % 5}` } : {}),
      ...(prefix === 'week3' ? { referralBonus: `${Math.floor(Math.random() * 100)}%` } : {})
    }));
  };
  
  const mockOverall = generateEntries(200, 'overall');
  const mockWeek1 = generateEntries(150, 'week1');
  const mockWeek2 = generateEntries(180, 'week2');
  const mockWeek3 = generateEntries(120, 'week3');
  const mockWeek4 = generateEntries(100, 'week4');
  const mockWeek5 = generateEntries(90, 'week5');
  
  const getPagedData = (data: LeaderboardData[]) => {
    if (fullData) {
      return {
        data,
        totalPages: Math.ceil(data.length / ITEMS_PER_PAGE)
      };
    }
    
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    return {
      data: data.slice(start, end),
      totalPages: Math.ceil(data.length / ITEMS_PER_PAGE)
    };
  };
  
  return {
    overall: getPagedData(mockOverall),
    week1: getPagedData(mockWeek1),
    week2: getPagedData(mockWeek2),
    week3: getPagedData(mockWeek3),
    week4: getPagedData(mockWeek4),
    week5: getPagedData(mockWeek5)
  };
}

function parseOverallSheet(
  workbook: XLSX.WorkBook, 
  sheetName: string, 
  page: number,
  fullData: boolean = false
): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  
  let sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    const possibleNames = workbook.SheetNames.filter(name => 
      name.toLowerCase().includes('overall') || 
      name.toLowerCase().includes('firewall') ||
      name.toLowerCase().includes('sparks')
    );
    
    if (possibleNames.length > 0) {
      sheet = workbook.Sheets[possibleNames[0]];
      console.log(`Using sheet "${possibleNames[0]}" instead of "${sheetName}"`);
    }
  }
  
  if (!sheet) {
    console.error(`Sheet for overall data not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  console.log("Raw overall data (first few rows):", rawData.slice(0, 3));
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).toLowerCase().includes('time period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Overall sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(String(row[sparksKey] || '0').replace(/,/g, '')) || 0
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
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 1 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
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
      sparks: Number(String(row[sparksKey]).replace(/,/g, '')) || 0,
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
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 2 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
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
      sparks: Number(String(row[sparksKey]).replace(/,/g, '')) || 0,
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
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 3 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
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
      sparks: Number(String(row[sparksKey]).replace(/,/g, '')) || 0,
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
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 4 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(String(row[sparksKey]).replace(/,/g, '')) || 0
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
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 'A' });
  console.log("Week 5 raw data (first few rows):", rawData.slice(0, 3));
  
  const skipRows = rawData.length > 0 && 
                   Object.values(rawData[0]).some(val => 
                     String(val).toLowerCase().includes('time period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 5 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1).map((row: any) => {
    const addressKey = Object.keys(headers).find(
      key => String(headers[key]).toLowerCase() === 'address'
    ) || 'A';
    
    const sparksKey = Object.keys(headers).find(
      key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
    ) || 'B';
    
    return {
      address: String(row[addressKey] || ''),
      sparks: Number(String(row[sparksKey] || '0').replace(/,/g, '')) || 0
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
