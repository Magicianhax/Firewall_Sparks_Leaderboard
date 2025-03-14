
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from './LeaderboardSection';

interface LeaderboardData {
  address: string;
  sparks: number;
}

interface TabData {
  data: LeaderboardData[];
  totalPages: number;
}

interface LeaderboardTabsProps {
  overallData: TabData;
  week1Data: TabData;
  week2Data: TabData;
  week3Data: TabData;
  week4Data: TabData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const LeaderboardTabs = ({
  overallData,
  week1Data,
  week2Data,
  week3Data,
  week4Data,
  currentPage,
  onPageChange
}: LeaderboardTabsProps) => {
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
      
      <TabsContent value="overall">
        <LeaderboardSection
          title="Firewall Sparks Leaderboard"
          data={overallData.data}
          totalPages={overallData.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week1">
        <LeaderboardSection
          title="Week 1 Leaderboard"
          data={week1Data.data}
          totalPages={week1Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week2">
        <LeaderboardSection
          title="Week 2 Leaderboard"
          data={week2Data.data}
          totalPages={week2Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week3">
        <LeaderboardSection
          title="Week 3 Leaderboard"
          data={week3Data.data}
          totalPages={week3Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week4">
        <LeaderboardSection
          title="Week 4 Leaderboard"
          data={week4Data.data}
          totalPages={week4Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardTabs;
