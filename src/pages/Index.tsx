import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';
import { LeaderboardData, readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";

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
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Firewall Sparks Leaderboard
          </h1>
          <p className="text-muted-foreground max-w-[600px] mx-auto">
            Track your Sparks across different weeks and compete with others in the Firewall community
          </p>
        </div>

        <LeaderboardTabs
          overallData={leaderboardData.overall}
          week1Data={leaderboardData.week1}
          week2Data={leaderboardData.week2}
          week3Data={leaderboardData.week3}
          week4Data={leaderboardData.week4}
        />
      </div>
    </div>
  );
};

export default Index;
