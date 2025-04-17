
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from './LeaderboardSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { readLeaderboardData } from '@/utils/excelUtils';

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
  week5Data: TabData;
  week6Data: TabData;
  week7Data: TabData;
  week8Data: TabData;
  week9Data: TabData;
  week10Data: TabData;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const LeaderboardTabs = ({
  overallData,
  week1Data,
  week2Data,
  week3Data,
  week4Data,
  week5Data,
  week6Data,
  week7Data,
  week8Data,
  week9Data,
  week10Data,
  currentPage,
  onPageChange
}: LeaderboardTabsProps) => {
  // Use separate search terms for each tab
  const [overallSearchTerm, setOverallSearchTerm] = React.useState("");
  const [week1SearchTerm, setWeek1SearchTerm] = React.useState("");
  const [week2SearchTerm, setWeek2SearchTerm] = React.useState("");
  const [week3SearchTerm, setWeek3SearchTerm] = React.useState("");
  const [week4SearchTerm, setWeek4SearchTerm] = React.useState("");
  const [week5SearchTerm, setWeek5SearchTerm] = React.useState("");
  const [week6SearchTerm, setWeek6SearchTerm] = React.useState("");
  const [week7SearchTerm, setWeek7SearchTerm] = React.useState("");
  const [week8SearchTerm, setWeek8SearchTerm] = React.useState("");
  const [week9SearchTerm, setWeek9SearchTerm] = React.useState("");
  const [week10SearchTerm, setWeek10SearchTerm] = React.useState("");
  
  // State to hold full data for searching
  const [fullData, setFullData] = useState<{
    overall: LeaderboardData[];
    week1: LeaderboardData[];
    week2: LeaderboardData[];
    week3: LeaderboardData[];
    week4: LeaderboardData[];
    week5: LeaderboardData[];
    week6: LeaderboardData[];
    week7: LeaderboardData[];
    week8: LeaderboardData[];
    week9: LeaderboardData[];
    week10: LeaderboardData[];
  }>({
    overall: [],
    week1: [],
    week2: [],
    week3: [],
    week4: [],
    week5: [],
    week6: [],
    week7: [],
    week8: [],
    week9: [],
    week10: []
  });
  
  const isMobile = useIsMobile();

  // Load full data for searching
  useEffect(() => {
    const loadFullData = async () => {
      // Fix: Pass true as the second parameter for fullData
      const data = await readLeaderboardData(1, true);
      if (data) {
        setFullData({
          overall: data.overall.data,
          week1: data.week1.data,
          week2: data.week2.data,
          week3: data.week3.data,
          week4: data.week4.data,
          week5: data.week5.data,
          week6: data.week6.data,
          week7: data.week7.data,
          week8: data.week8.data,
          week9: data.week9.data,
          week10: data.week10.data,
        });
      }
    };
    
    loadFullData();
  }, []);

  // Determine which weeks to show on first tab row based on mobile
  const firstRowWeeks = isMobile ? 4 : 8;

  return (
    <Tabs defaultValue="overall" className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 gap-1">
        <TabsTrigger value="overall" className="text-xs sm:text-base">
          {isMobile ? "All" : "Overall"}
        </TabsTrigger>
        {Array.from({ length: Math.min(firstRowWeeks - 1, 10) }, (_, i) => (
          <TabsTrigger 
            key={`week${i+1}`} 
            value={`week${i+1}`} 
            className="text-xs sm:text-base"
          >
            {isMobile ? `W${i+1}` : `Week ${i+1}`}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {isMobile && (
        <TabsList className="grid w-full grid-cols-4 gap-1">
          {Array.from({ length: Math.min(6, 10 - firstRowWeeks + 1) }, (_, i) => (
            <TabsTrigger 
              key={`week${i+firstRowWeeks}`} 
              value={`week${i+firstRowWeeks}`} 
              className="text-xs sm:text-base"
            >
              {`W${i+firstRowWeeks}`}
            </TabsTrigger>
          ))}
        </TabsList>
      )}
      
      {!isMobile && 10 > firstRowWeeks && (
        <TabsList className="grid w-full grid-cols-3 gap-1">
          {Array.from({ length: 10 - firstRowWeeks + 1 }, (_, i) => (
            <TabsTrigger 
              key={`week${i+firstRowWeeks}`} 
              value={`week${i+firstRowWeeks}`} 
              className="text-xs sm:text-base"
            >
              {`Week ${i+firstRowWeeks}`}
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      <TabsContent value="overall">
        <LeaderboardSection
          title="Firewall Sparks Leaderboard"
          data={overallData.data}
          fullData={fullData.overall}
          totalPages={overallData.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={overallSearchTerm}
          onSearchChange={setOverallSearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week1">
        <LeaderboardSection
          title="Week 1 Leaderboard"
          data={week1Data.data}
          fullData={fullData.week1}
          totalPages={week1Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week1SearchTerm}
          onSearchChange={setWeek1SearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week2">
        <LeaderboardSection
          title="Week 2 Leaderboard"
          data={week2Data.data}
          fullData={fullData.week2}
          totalPages={week2Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week2SearchTerm}
          onSearchChange={setWeek2SearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week3">
        <LeaderboardSection
          title="Week 3 Leaderboard"
          data={week3Data.data}
          fullData={fullData.week3}
          totalPages={week3Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week3SearchTerm}
          onSearchChange={setWeek3SearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week4">
        <LeaderboardSection
          title="Week 4 Leaderboard"
          data={week4Data.data}
          fullData={fullData.week4}
          totalPages={week4Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week4SearchTerm}
          onSearchChange={setWeek4SearchTerm}
        />
      </TabsContent>
      
      <TabsContent value="week5">
        <LeaderboardSection
          title="Week 5 Leaderboard"
          data={week5Data.data}
          fullData={fullData.week5}
          totalPages={week5Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week5SearchTerm}
          onSearchChange={setWeek5SearchTerm}
        />
      </TabsContent>

      <TabsContent value="week6">
        <LeaderboardSection
          title="Week 6 Leaderboard"
          data={week6Data.data}
          fullData={fullData.week6}
          totalPages={week6Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week6SearchTerm}
          onSearchChange={setWeek6SearchTerm}
        />
      </TabsContent>

      <TabsContent value="week7">
        <LeaderboardSection
          title="Week 7 Leaderboard"
          data={week7Data.data}
          fullData={fullData.week7}
          totalPages={week7Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week7SearchTerm}
          onSearchChange={setWeek7SearchTerm}
        />
      </TabsContent>

      <TabsContent value="week8">
        <LeaderboardSection
          title="Week 8 Leaderboard"
          data={week8Data.data}
          fullData={fullData.week8}
          totalPages={week8Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week8SearchTerm}
          onSearchChange={setWeek8SearchTerm}
        />
      </TabsContent>

      <TabsContent value="week9">
        <LeaderboardSection
          title="Week 9 Leaderboard"
          data={week9Data.data}
          fullData={fullData.week9}
          totalPages={week9Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week9SearchTerm}
          onSearchChange={setWeek9SearchTerm}
        />
      </TabsContent>

      <TabsContent value="week10">
        <LeaderboardSection
          title="Week 10 Leaderboard"
          data={week10Data.data}
          fullData={fullData.week10}
          totalPages={week10Data.totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
          searchTerm={week10SearchTerm}
          onSearchChange={setWeek10SearchTerm}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LeaderboardTabs;
