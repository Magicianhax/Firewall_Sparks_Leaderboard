
import * as XLSX from 'xlsx';

export interface LeaderboardData {
  address: string;
  sparks: number;
  nftCollection?: string;
  hotSlothVerification?: string;
  referralBonus?: string;
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

function parseOverallSheet(workbook: XLSX.WorkBook, sheetName: string, page: number): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const data = XLSX.utils.sheet_to_json(sheet, { header: ["address", "sparks"] });
  
  // Remove header row if present
  const formattedData = data
    .slice(1) // Skip header row
    .map((row: any) => ({
      address: String(row.address || ''),
      sparks: Number(row.sparks) || 0
    }))
    .filter(entry => entry.address && !isNaN(entry.sparks));

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek1Sheet(workbook: XLSX.WorkBook, sheetName: string, page: number): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const data = XLSX.utils.sheet_to_json(sheet, { 
    header: ["address", "hotSlothVerification", "sparks"]
  });
  
  const formattedData = data
    .slice(1) // Skip header row
    .map((row: any) => ({
      address: String(row.address || ''),
      hotSlothVerification: String(row.hotSlothVerification || ''),
      sparks: Number(row.sparks) || 0
    }))
    .filter(entry => entry.address && !isNaN(entry.sparks));

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek2Sheet(workbook: XLSX.WorkBook, sheetName: string, page: number): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const data = XLSX.utils.sheet_to_json(sheet, { 
    header: ["address", "nftCollection", "sparks"]
  });
  
  const formattedData = data
    .slice(1) // Skip header row
    .map((row: any) => ({
      address: String(row.address || ''),
      nftCollection: String(row.nftCollection || ''),
      sparks: Number(row.sparks) || 0
    }))
    .filter(entry => entry.address && !isNaN(entry.sparks));

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek3Sheet(workbook: XLSX.WorkBook, sheetName: string, page: number): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const data = XLSX.utils.sheet_to_json(sheet, { 
    header: ["address", "sparks", "referralBonus"]
  });
  
  const formattedData = data
    .slice(1) // Skip header row
    .map((row: any) => ({
      address: String(row.address || ''),
      sparks: Number(row.sparks) || 0,
      referralBonus: String(row.referralBonus || '')
    }))
    .filter(entry => entry.address && !isNaN(entry.sparks));

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}

function parseWeek4Sheet(workbook: XLSX.WorkBook, sheetName: string, page: number): LeaderboardResponse {
  const ITEMS_PER_PAGE = 50;
  const sheet = workbook.Sheets[sheetName];
  
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return { data: [], totalPages: 0 };
  }

  const data = XLSX.utils.sheet_to_json(sheet, { 
    header: ["address", "sparks"]
  });
  
  const formattedData = data
    .slice(1) // Skip header row
    .map((row: any) => ({
      address: String(row.address || ''),
      sparks: Number(row.sparks) || 0
    }))
    .filter(entry => entry.address && !isNaN(entry.sparks));

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  
  return {
    data: formattedData.slice(start, end),
    totalPages: Math.ceil(formattedData.length / ITEMS_PER_PAGE),
  };
}
