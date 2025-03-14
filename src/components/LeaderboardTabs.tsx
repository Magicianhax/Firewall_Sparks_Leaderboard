import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from './LeaderboardSection';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <Tabs defaultValue="overall" className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-1">
        <TabsTrigger value="overall" className="text-sm sm:text-base">
          {isMobile ? "All" : "Overall"}
        </TabsTrigger>
        <TabsTrigger value="week1" className="text-sm sm:text-base">W1</TabsTrigger>
        <TabsTrigger value="week2" className="text-sm sm:text-base">W2</TabsTrigger>
        {!isMobile && (
          <>
            <TabsTrigger value="week3" className="text-sm sm:text-base">Week 3</TabsTrigger>
            <TabsTrigger value="week4" className="text-sm sm:text-base">Week 4</TabsTrigger>
          </>
        )}
      </TabsList>
      
      {isMobile && (
        <TabsList className="grid w-full grid-cols-2 gap-1">
          <TabsTrigger value="week3" className="text-sm sm:text-base">W3</TabsTrigger>
          <TabsTrigger value="week4" className="text-sm sm:text-base">W4</TabsTrigger>
        </TabsList>
      )}
      
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
