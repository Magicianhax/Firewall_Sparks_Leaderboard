
import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import { LeaderboardData, readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";
import { Sparkle, AlertTriangle, FileWarning } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await readLeaderboardData(currentPage);
        if (data) {
          setLeaderboardData(data);
          setError(null);
        } else {
          setError("Failed to load leaderboard data. Please ensure the Excel file is in the correct location.");
          toast({
            title: "Error",
            description: "Failed to load leaderboard data. Please ensure the Excel file is in the correct location.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("An unexpected error occurred. Please try again later.");
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleRetry = () => {
    setError(null);
    setCurrentPage(currentPage); // This will trigger a re-fetch
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
          <Alert variant="destructive" className="mt-4">
            <FileWarning className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription>
              {error}
              <div className="mt-2 text-sm">
                File path: /Firewall Sparks Leaderboard.xlsx
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry} 
                className="mt-2"
              >
                Retry
              </Button>
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
