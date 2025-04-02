
// Configuration for file paths and URLs

// Google Sheets document ID
export const GOOGLE_SHEET_ID = '1kAOI4il5v9o9nN7tYuyR1JyM7J42KF1iIsMXZLBR0x4';

// Function to get the spreadsheet URL
export function getGoogleSheetUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv`;
}

// Legacy functions kept for compatibility during transition
export function getExcelFilePath(): string {
  return getGoogleSheetUrl();
}

export function getLocalExcelFilePath(): string {
  return getGoogleSheetUrl();
}
