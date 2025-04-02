// Configuration for file paths
export const EXCEL_FILE_PATH = '/Firewall Sparks Leaderboard.xlsx';

// Function to get the correct file path based on environment
export function getExcelFilePath(): string {
  // In development, try multiple paths
  if (process.env.NODE_ENV === 'development') {
    const possiblePaths = [
      '/Firewall Sparks Leaderboard.xlsx',
      './Firewall Sparks Leaderboard.xlsx',
      'Firewall Sparks Leaderboard.xlsx',
      '/assets/Firewall Sparks Leaderboard.xlsx'
    ];
    
    // Return the first path that exists
    return possiblePaths[0];
  }
  
  // In production, use the standard path
  return EXCEL_FILE_PATH;
} 