
// Configuration for file paths and URLs

// Google Sheets document ID
export const GOOGLE_SHEET_ID = '1PRTzQknox_fw4WwjIHtKGCLYeQTeDo5UjHoLF9rNX20';

// Function to get the spreadsheet URL for CSV export
export function getGoogleSheetUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=xlsx`;
}

// Function to get the spreadsheet URL for direct editing
export function getGoogleSheetEditUrl(): string {
  return `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/edit?usp=sharing`;
}

// Legacy functions kept for compatibility during transition
export function getExcelFilePath(): string {
  return getGoogleSheetUrl();
}

export function getLocalExcelFilePath(): string {
  return getGoogleSheetUrl();
}
