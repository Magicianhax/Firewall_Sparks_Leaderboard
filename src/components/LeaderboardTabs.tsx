
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeaderboardSection from './LeaderboardSection';
import { useIsMobile } from '@/hooks/use-mobile';
import { readLeaderboardData } from '@/utils/excelUtils';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

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
  
  // State to hold full data for searching
  const [fullData, setFullData] = useState<{
    overall: LeaderboardData[];
    week1: LeaderboardData[];
    week2: LeaderboardData[];
    week3: LeaderboardData[];
    week4: LeaderboardData[];
    week5: LeaderboardData[];
  }>({
    overall: [],
    week1: [],
    week2: [],
    week3: [],
    week4: [],
    week5: []
  });
  
  // State to track available weeks
  const [availableWeeks, setAvailableWeeks] = useState<number[]>([1, 2, 3, 4]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useIsMobile();

  // Load full data for searching
  useEffect(() => {
    const loadFullData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await readLeaderboardData(1, true);
        if (data) {
          // Check which weeks have data
          const weeks = [];
          if (data.week1.data.length > 0) weeks.push(1);
          if (data.week2.data.length > 0) weeks.push(2);
          if (data.week3.data.length > 0) weeks.push(3);
          if (data.week4.data.length > 0) weeks.push(4);
          if (data.week5.data.length > 0) weeks.push(5);
          
          console.log("Available weeks:", weeks);
          console.log("Week 5 data length:", data.week5.data.length);
          
          setAvailableWeeks(weeks);
          
          setFullData({
            overall: data.overall.data,
            week1: data.week1.data,
            week2: data.week2.data,
            week3: data.week3.data,
            week4: data.week4.data,
            week5: data.week5.data,
          });
        } else {
          setError("Failed to load leaderboard data");
        }
      } catch (err) {
        console.error("Error in loadFullData:", err);
        setError("An error occurred while loading the leaderboard data");
      } finally {
        setLoading(false);
      }
    };
    
    loadFullData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="w-8 h-8 text-yellow-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

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
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger value="week3" className="text-sm sm:text-base">W3</TabsTrigger>
          <TabsTrigger value="week4" className="text-sm sm:text-base">W4</TabsTrigger>
          {availableWeeks.includes(5) && (
            <TabsTrigger value="week5" className="text-sm sm:text-base">W5</TabsTrigger>
          )}
        </TabsList>
      )}
      
      {!isMobile && availableWeeks.includes(5) && (
        <TabsList className="grid w-full grid-cols-1 gap-1">
          <TabsTrigger value="week5" className="text-sm sm:text-base">Week 5</TabsTrigger>
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
      
      {availableWeeks.includes(5) && (
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
      )}
    </Tabs>
  );
};

export default LeaderboardTabs;
