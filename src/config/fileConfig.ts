
// Configuration for file paths

// Function to get the correct file path based on environment
export function getExcelFilePath(): string {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.MODE === 'development';
  
  // Get the base URL from the current window location
  const baseUrl = window.location.pathname.startsWith('/Firewall_Sparks_Leaderboard')
    ? '/Firewall_Sparks_Leaderboard'
    : '';
  
  // If in development, use the direct path
  if (isDevelopment) {
    console.log('Using development Excel path');
    return '/assets/Firewall Sparks Leaderboard.xlsx';
  }
  
  // If in production with the subdirectory
  console.log(`Using production Excel path with base: ${baseUrl}`);
  return `${baseUrl}/assets/Firewall Sparks Leaderboard.xlsx`;
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
