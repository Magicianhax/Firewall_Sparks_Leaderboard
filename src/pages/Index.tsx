
import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import { LeaderboardData, readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";
import { Sparkle } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [leaderboardData, setLeaderboardData] = useState<{
    overall: LeaderboardData[];
    week1: LeaderboardData[];
    week2: LeaderboardData[];
    week3: LeaderboardData[];
    week4: LeaderboardData[];
  }>({
    overall: [],
    week1: [],
    week2: [],
    week3: [],
    week4: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await readLeaderboardData();
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
  }, [toast]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-background">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl text-yellow-900/90 dark:text-yellow-100/90 flex items-center justify-center gap-2">
            <Sparkle className="w-8 h-8 text-yellow-500 animate-bounce" />
            Firewall Sparks Leaderboard
            <Sparkle className="w-8 h-8 text-yellow-500 animate-bounce" />
          </h1>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Compete with others in the Firewall community
          </p>
        </div>

        <LeaderboardTabs
          overallData={leaderboardData.overall}
          week1Data={leaderboardData.week1}
          week2Data={leaderboardData.week2}
          week3Data={leaderboardData.week3}
          week4Data={leaderboardData.week4}
        />

        <footer className="text-center text-sm text-muted-foreground mt-8">
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
