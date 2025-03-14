
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from './LeaderboardSection';

interface LeaderboardData {
  address: string;
  sparks: number;
}

interface LeaderboardTabsProps {
  overallData: LeaderboardData[];
  week1Data: LeaderboardData[];
  week2Data: LeaderboardData[];
  week3Data: LeaderboardData[];
  week4Data: LeaderboardData[];
}

const LeaderboardTabs = ({ overallData, week1Data, week2Data, week3Data, week4Data }: LeaderboardTabsProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <Tabs defaultValue="overall" className="w-full max-w-4xl mx-auto space-y-6">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overall">Overall</TabsTrigger>
        <TabsTrigger value="week1">Week 1</TabsTrigger>
        <TabsTrigger value="week2">Week 2</TabsTrigger>
        <TabsTrigger value="week3">Week 3</TabsTrigger>
        <TabsTrigger value="week4">Week 4</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overall" className="space-y-4">
        <LeaderboardSection
          title="Firewall Sparks Leaderboard"
          data={overallData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week1">
        <LeaderboardSection
          title="Week 1 Leaderboard"
          data={week1Data}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week2">
        <LeaderboardSection
          title="Week 2 Leaderboard"
          data={week2Data}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week3">
        <LeaderboardSection
          title="Week 3 Leaderboard"
          data={week3Data}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week4">
        <LeaderboardSection
          title="Week 4 Leaderboard"
          data={week4Data}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardTabs;
