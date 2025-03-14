
import { useEffect, useState } from 'react';
import LeaderboardTabs from '@/components/LeaderboardTabs';

interface LeaderboardData {
  address: string;
  sparks: number;
}

const Index = () => {
  // Temporary mock data - replace with your Excel data fetching logic
  const [leaderboardData, setLeaderboardData] = useState<{
    overall: LeaderboardData[];
    week1: LeaderboardData[];
    week2: LeaderboardData[];
    week3: LeaderboardData[];
    week4: LeaderboardData[];
  }>({
    overall: [
      { address: "0x1234...5678", sparks: 1000 },
      { address: "0x8765...4321", sparks: 850 },
      { address: "0x9876...5432", sparks: 750 },
    ],
    week1: [
      { address: "0x1234...5678", sparks: 250 },
      { address: "0x8765...4321", sparks: 200 },
      { address: "0x9876...5432", sparks: 150 },
    ],
    week2: [
      { address: "0x8765...4321", sparks: 300 },
      { address: "0x1234...5678", sparks: 250 },
      { address: "0x9876...5432", sparks: 200 },
    ],
    week3: [
      { address: "0x9876...5432", sparks: 200 },
      { address: "0x1234...5678", sparks: 250 },
      { address: "0x8765...4321", sparks: 150 },
    ],
    week4: [
      { address: "0x1234...5678", sparks: 250 },
      { address: "0x9876...5432", sparks: 200 },
      { address: "0x8765...4321", sparks: 200 },
    ],
  });

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
