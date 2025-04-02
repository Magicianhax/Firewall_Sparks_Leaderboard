
// Configuration for file paths
export const EXCEL_FILE_PATH = '/assets/Firewall Sparks Leaderboard.xlsx';

// Function to get the correct file path based on environment
export function getExcelFilePath(): string {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // If in development, use the direct path
  if (isDevelopment) {
    return '/assets/Firewall Sparks Leaderboard.xlsx';
  }
  
  // If in production with the subdirectory
  return '/Firewall_Sparks_Leaderboard/assets/Firewall Sparks Leaderboard.xlsx';
}

// Get file path for local development file testing
export function getLocalExcelFilePath(): string {
  // Try multiple possible paths
  const possiblePaths = [
    '/assets/Firewall Sparks Leaderboard.xlsx',
    './assets/Firewall Sparks Leaderboard.xlsx',
    'assets/Firewall Sparks Leaderboard.xlsx',
    'public/Firewall Sparks Leaderboard.xlsx',
    '/Firewall Sparks Leaderboard.xlsx'
  ];
  
  return possiblePaths[0];
}
