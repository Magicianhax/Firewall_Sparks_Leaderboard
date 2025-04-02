// Configuration for file paths
export const EXCEL_FILE_PATH = '/Firewall Sparks Leaderboard.xlsx';

// Function to get the correct file path based on environment
export function getExcelFilePath(): string {
  // Get the current URL path
  const currentPath = window.location.pathname;
  
  // If we're in a subdirectory (e.g., /Firewall_Sparks_Leaderboard/), adjust the path
  if (currentPath.includes('/Firewall_Sparks_Leaderboard/')) {
    return '/Firewall_Sparks_Leaderboard/Firewall Sparks Leaderboard.xlsx';
  }
  
  // Try multiple possible paths
  const possiblePaths = [
    '/Firewall Sparks Leaderboard.xlsx',
    './Firewall Sparks Leaderboard.xlsx',
    'Firewall Sparks Leaderboard.xlsx'
  ];
  
  // Return the first path
  return possiblePaths[0];
} 