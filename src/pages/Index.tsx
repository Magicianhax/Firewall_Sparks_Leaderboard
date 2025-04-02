
import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import { LeaderboardData, readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/hooks/use-toast";
import { Sparkle, AlertTriangle, FileWarning, RefreshCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);
  const [customPath, setCustomPath] = useState<string>('');
  const [leaderboardData, setLeaderboardData] = useState({
    overall: { data: [], totalPages: 0 },
    week1: { data: [], totalPages: 0 },
    week2: { data: [], totalPages: 0 },
    week3: { data: [], totalPages: 0 },
    week4: { data: [], totalPages: 0 },
    week5: { data: [], totalPages: 0 },
    week6: { data: [], totalPages: 0 },
    week7: { data: [], totalPages: 0 },
  });

  useEffect(() => {
    // Check for saved path in localStorage
    const savedPath = localStorage.getItem('excelFilePath');
    if (savedPath && !customPath) {
      setCustomPath(savedPath);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Use custom path if provided, otherwise use the saved path from localStorage
        const pathToUse = customPath || savedPath || undefined;
        const data = await readLeaderboardData(currentPage, false, pathToUse);
        
        if (data) {
          setLeaderboardData(data);
          setError(null);
          
          // If we had a custom path that worked, save it to localStorage for future
          if (pathToUse) {
            localStorage.setItem('excelFilePath', pathToUse);
            toast({
              title: "Success",
              description: `Successfully loaded data from path: ${pathToUse}`,
            });
          }
        } else {
          setError("Failed to load leaderboard data. Please ensure the Excel file is accessible.");
          toast({
            title: "Error",
            description: "Failed to load leaderboard data. Please check console for details.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(`Error: ${errorMessage}`);
        toast({
          title: "Error",
          description: "Failed to load data. See details in the error message.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, currentPage, attemptCount, customPath]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleRetry = () => {
    setError(null);
    setAttemptCount(prev => prev + 1); // This will trigger a re-fetch
  };

  const handleCustomPathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptCount(prev => prev + 1); // This will trigger a re-fetch with the new path
  };

  return (
    <div className="min-h-screen p-2 sm:p-6 bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-background">
      <div className="container mx-auto space-y-4 sm:space-y-8">
        <div className="text-center space-y-2 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-yellow-900/90 dark:text-yellow-100/90 flex items-center justify-center gap-2">
            <Sparkle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 animate-bounce" />
            Firewall Sparks Leaderboard
            <Sparkle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 animate-bounce" />
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-[600px] mx-auto">
            Compete with others in the Firewall community
          </p>
        </div>

        <Card className="p-4 bg-yellow-500/10 dark:bg-yellow-500/5 border-yellow-200/50 dark:border-yellow-500/20">
          <a 
            href="https://wn.nr/5h9Zt5X" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-800 dark:text-yellow-200 hover:underline flex items-center gap-2"
          >
            🎉 Week 9 of tasks is now live! Click here to participate
          </a>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex gap-2 items-center">
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
              <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        ) : error ? (
          <Alert variant="warning" className="mt-4">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              <div className="space-y-2">
                <p>{error}</p>
                
                <div className="text-sm font-medium mt-2">Troubleshooting steps:</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Make sure the Excel file is uploaded to the public folder</li>
                  <li>The Excel file should be named "Firewall Sparks Leaderboard.xlsx"</li>
                  <li>Check your server/hosting configuration for file access permissions</li>
                  <li>Try specifying a custom path to the Excel file below</li>
                </ul>

                <form onSubmit={handleCustomPathSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="Custom path to Excel file (e.g., /assets/Firewall Sparks Leaderboard.xlsx)"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Try Custom Path
                  </Button>
                </form>

                <div className="flex gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRetry} 
                    className="flex items-center gap-2"
                  >
                    <RefreshCcw className="h-3 w-3" />
                    Retry Default Path
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <LeaderboardTabs
            overallData={leaderboardData.overall}
            week1Data={leaderboardData.week1}
            week2Data={leaderboardData.week2}
            week3Data={leaderboardData.week3}
            week4Data={leaderboardData.week4}
            week5Data={leaderboardData.week5}
            week6Data={leaderboardData.week6}
            week7Data={leaderboardData.week7}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        <footer className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-8">
          <p className="flex items-center justify-center gap-1">
            Created with ❤️ by{" "}
            <a 
              href="https://twitter.com/magicianafk" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
            >
              @magicianafk
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
