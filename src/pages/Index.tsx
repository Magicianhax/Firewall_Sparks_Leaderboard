import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import { LeaderboardData, readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";
import { Sparkle } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] = useState({
    overall: { data: [], totalPages: 0 },
    week1: { data: [], totalPages: 0 },
    week2: { data: [], totalPages: 0 },
    week3: { data: [], totalPages: 0 },
    week4: { data: [], totalPages: 0 },
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await readLeaderboardData(currentPage);
      if (data) {
        setLeaderboardData(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load leaderboard data. Please ensure the Excel file is in the correct location.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

        <div className="bg-yellow-500/10 dark:bg-yellow-500/5 p-4 rounded-lg border border-yellow-200/50 dark:border-yellow-500/20">
          <a 
            href="https://wn.nr/JmsDZDm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-800 dark:text-yellow-200 hover:underline flex items-center gap-2"
          >
            🎉 Week 5 of tasks is now live! Click here to participate
          </a>
        </div>

        <LeaderboardTabs
          overallData={leaderboardData.overall}
          week1Data={leaderboardData.week1}
          week2Data={leaderboardData.week2}
          week3Data={leaderboardData.week3}
          week4Data={leaderboardData.week4}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

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
