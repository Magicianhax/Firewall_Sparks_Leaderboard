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
    
    if (!response.ok) {
      console.error('Failed to fetch Excel file:', response.status, response.statusText);
      throw new Error(`Failed to fetch Excel file: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType || contentType.includes('text/html')) {
      console.error('Received invalid content type:', contentType);
      throw new Error('Received invalid content type for Excel file');
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    if (arrayBuffer.byteLength === 0) {
      console.error('Received empty file');
      throw new Error('Received empty Excel file');
    }
    
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
        { data: [], totalPages: 0 },
    };
  } catch (error) {
    console.error('Error reading Excel file:', error);
    
    console.log("Using mock data for development");
    return generateBetterMockData(page, fullData);
  }
}

function generateBetterMockData(page: number, fullData: boolean) {
  const ITEMS_PER_PAGE = 50;
  const totalItems = 200;
  
  const mockAddresses = [
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    "0xD8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    "0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1",
    "0x1c0A5Ba639975D10902A5ca3875C87bB8E7c2009",
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  ];
  
  const generateAddresses = (count: number) => {
    const addresses = [...mockAddresses];
    
    while (addresses.length < count) {
      const baseAddress = mockAddresses[Math.floor(Math.random() * mockAddresses.length)];
      const randomChar = "0123456789abcdef"[Math.floor(Math.random() * 16)];
      const randomPosition = Math.floor(Math.random() * (baseAddress.length - 2)) + 2;
      
      let newAddress = baseAddress.split('');
      newAddress[randomPosition] = randomChar;
      addresses.push(newAddress.join(''));
    }
    
    return addresses;
  };
  
  const generateEntries = (count: number, prefix: string) => {
    const addresses = generateAddresses(count);
    
    return addresses.map((address, i) => {
      const sparkBase = 2000000 - (i * 10000);
      const sparks = Math.max(10000, sparkBase + Math.floor(Math.random() * 50000));
      
      return {
        address,
        sparks,
        ...(prefix === 'week1' ? { hotSlothVerification: Math.random() > 0.5 ? 'Yes' : 'No' } : {}),
        ...(prefix === 'week2' ? { nftCollection: `Collection ${i % 5}` } : {}),
        ...(prefix === 'week3' ? { referralBonus: `${Math.floor(Math.random() * 100)}%` } : {})
      };
    }).sort((a, b) => b.sparks - a.sparks);
  };
  
  const mockOverall = generateEntries(totalItems, 'overall');
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
                   typeof rawData[0] === 'object' && 
                   Object.values(rawData[0]).some(val => 
                     String(val).toLowerCase().includes('time period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Overall sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
      const addressKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase() === 'address'
      ) || 'A';
      
      const sparksKey = Object.keys(headers).find(
        key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
      ) || 'B';
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return { address, sparks };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
                   typeof rawData[0] === 'object' &&
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 1 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
      const addressKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase() === 'address'
      ) || 'A';
      
      const verificationKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase().includes('sloth')
      ) || 'B';
      
      const sparksKey = Object.keys(headers).find(
        key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
      ) || 'C';
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return {
        address,
        sparks,
        hotSlothVerification: row[verificationKey] ? String(row[verificationKey]) : undefined
      };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
                   typeof rawData[0] === 'object' &&
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 2 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
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
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return {
        address,
        sparks,
        nftCollection: row[nftKey] ? String(row[nftKey]) : undefined
      };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
                   typeof rawData[0] === 'object' &&
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 3 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
      const addressKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase() === 'address'
      ) || 'A';
      
      const sparksKey = Object.keys(headers).find(
        key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
      ) || 'B';
      
      const referralKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase().includes('referral')
      ) || 'C';
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return {
        address,
        sparks,
        referralBonus: row[referralKey] ? String(row[referralKey]) : undefined
      };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
                   typeof rawData[0] === 'object' &&
                   Object.values(rawData[0]).some(val => 
                     String(val).includes('Time Period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 4 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
      const addressKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase() === 'address'
      ) || 'A';
      
      const sparksKey = Object.keys(headers).find(
        key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
      ) || 'B';
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return {
        address,
        sparks
      };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
                   typeof rawData[0] === 'object' &&
                   Object.values(rawData[0]).some(val => 
                     String(val).toLowerCase().includes('time period')) ? 1 : 0;
  
  const headers = rawData[skipRows] || {};
  console.log(`Week 5 sheet headers:`, headers);
  
  const formattedData = rawData.slice(skipRows + 1)
    .filter(row => row && typeof row === 'object')
    .map((row: any) => {
      const addressKey = Object.keys(headers).find(
        key => String(headers[key]).toLowerCase() === 'address'
      ) || 'A';
      
      const sparksKey = Object.keys(headers).find(
        key => String(headers[key]).includes('Sparks') || String(headers[key]).includes('🔥')
      ) || 'B';
      
      const address = row[addressKey] ? String(row[addressKey]).trim() : '';
      const sparksRaw = String(row[sparksKey] || '0').replace(/,/g, '');
      const sparks = parseFloat(sparksRaw) || 0;
      
      return {
        address,
        sparks
      };
    })
    .filter(item => item.address && !isNaN(item.sparks));
  
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
