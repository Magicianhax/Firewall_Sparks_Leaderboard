
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, Share, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";
import { ShareModal } from '@/components/ShareModal';
import { Skeleton } from '@/components/ui/skeleton';

interface WeeklyBreakdown {
  sparks: number;
  hotSlothVerification?: string;
  nftCollection?: string;
  referralBonus?: string;
  rank?: number;
}

const UserBreakdown = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [breakdown, setBreakdown] = useState<{
    overall: number;
    overallRank?: number;
    week1: WeeklyBreakdown;
    week2: WeeklyBreakdown;
    week3: WeeklyBreakdown;
    week4: WeeklyBreakdown;
    week5: WeeklyBreakdown;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBreakdown = async () => {
      setLoading(true);
      try {
        const data = await readLeaderboardData(1, true);
        if (!data) {
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const overallData = data.overall.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );
        const week1Data = data.week1.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );
        const week2Data = data.week2.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );
        const week3Data = data.week3.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );
        const week4Data = data.week4.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );
        const week5Data = data.week5.data.find((entry: any) => 
          entry.address.toLowerCase() === address?.toLowerCase()
        );

        console.log("User data for each week:", {
          overallData,
          week1Data,
          week2Data,
          week3Data,
          week4Data,
          week5Data
        });

        const calculateRank = (data: any[], userAddress: string | undefined) => {
          if (!userAddress) return undefined;
          const userAddressLower = userAddress.toLowerCase();
          const sortedData = [...data].sort((a, b) => b.sparks - a.sparks);
          const index = sortedData.findIndex(entry => entry.address.toLowerCase() === userAddressLower);
          return index >= 0 ? index + 1 : undefined;
        };

        const overallRank = calculateRank(data.overall.data, address);
        const week1Rank = calculateRank(data.week1.data, address);
        const week2Rank = calculateRank(data.week2.data, address);
        const week3Rank = calculateRank(data.week3.data, address);
        const week4Rank = calculateRank(data.week4.data, address);
        const week5Rank = calculateRank(data.week5.data, address);

        const userBreakdown = {
          overall: overallData?.sparks || 0,
          overallRank,
          week1: {
            sparks: week1Data?.sparks || 0,
            hotSlothVerification: week1Data?.hotSlothVerification,
            rank: week1Rank,
          },
          week2: {
            sparks: week2Data?.sparks || 0,
            nftCollection: week2Data?.nftCollection,
            rank: week2Rank,
          },
          week3: {
            sparks: week3Data?.sparks || 0,
            referralBonus: week3Data?.referralBonus,
            rank: week3Rank,
          },
          week4: {
            sparks: week4Data?.sparks || 0,
            rank: week4Rank,
          },
          week5: {
            sparks: week5Data?.sparks || 0,
            rank: week5Rank,
          },
        };

        console.log("User breakdown:", userBreakdown);
        setBreakdown(userBreakdown);
      } catch (error) {
        console.error("Error fetching user breakdown:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchBreakdown();
    }
  }, [address, toast]);

  if (loading || !breakdown) {
    return (
      <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-background">
        <div className="container mx-auto space-y-4 sm:space-y-6 max-w-4xl">
          <div className="h-10 w-32">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderRank = (rank?: number) => {
    if (!rank) return "Not ranked";
    
    let rankClass = "";
    if (rank === 1) rankClass = "text-yellow-500 font-bold";
    else if (rank === 2) rankClass = "text-gray-400 font-bold";
    else if (rank === 3) rankClass = "text-amber-600 font-bold";
    
    return (
      <span className={rankClass}>#{rank}</span>
    );
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-background">
      <div className="container mx-auto space-y-4 sm:space-y-6 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="hover:bg-yellow-100/50 w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-yellow-900/90 dark:text-yellow-100/90">
            User Breakdown
          </h1>
        </div>

        <Card className="p-4 bg-yellow-500/10 dark:bg-yellow-500/5 border-yellow-200/50 dark:border-yellow-500/20">
          <a 
            href="https://wn.nr/m47HKzS" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-800 dark:text-yellow-200 hover:underline flex items-center gap-2"
          >
            🎉 Week 7 of tasks is now live! Click here to participate
          </a>
        </Card>

        <Card className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b gap-2">
            <span className="font-mono text-sm sm:text-base break-all">{address}</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center">
                <span className="font-bold text-lg sm:text-xl">{breakdown.overall}</span>
                <span className="text-yellow-500 ml-1">🔥</span>
              </div>
              {breakdown.overallRank && (
                <div className="flex items-center text-sm">
                  <Trophy className="h-4 w-4 mr-1 text-yellow-600" />
                  <span>Overall Rank: {renderRank(breakdown.overallRank)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold mb-3 flex justify-between items-center">
                <span>Week 1</span>
                {breakdown.week1.rank && (
                  <span className="text-sm flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    Rank: {renderRank(breakdown.week1.rank)}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span>Sparks</span>
                  <span className="font-semibold">{breakdown.week1.sparks} 🔥</span>
                </div>
                {breakdown.week1.hotSlothVerification && (
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                    <span>Hot Sloth Verification</span>
                    <span className="break-all">{breakdown.week1.hotSlothVerification}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold mb-3 flex justify-between items-center">
                <span>Week 2</span>
                {breakdown.week2.rank && (
                  <span className="text-sm flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    Rank: {renderRank(breakdown.week2.rank)}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span>Sparks</span>
                  <span className="font-semibold">{breakdown.week2.sparks} 🔥</span>
                </div>
                {breakdown.week2.nftCollection && (
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                    <span>NFT Collection</span>
                    <span className="break-all">{breakdown.week2.nftCollection}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold mb-3 flex justify-between items-center">
                <span>Week 3</span>
                {breakdown.week3.rank && (
                  <span className="text-sm flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    Rank: {renderRank(breakdown.week3.rank)}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span>Sparks</span>
                  <span className="font-semibold">{breakdown.week3.sparks} 🔥</span>
                </div>
                {breakdown.week3.referralBonus && (
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                    <span>Referral Bonus</span>
                    <span className="break-all">{breakdown.week3.referralBonus}</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold mb-3 flex justify-between items-center">
                <span>Week 4</span>
                {breakdown.week4.rank && (
                  <span className="text-sm flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    Rank: {renderRank(breakdown.week4.rank)}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span>Sparks</span>
                  <span className="font-semibold">{breakdown.week4.sparks} 🔥</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-secondary/50">
              <h3 className="font-semibold mb-3 flex justify-between items-center">
                <span>Week 5</span>
                {breakdown.week5.rank && (
                  <span className="text-sm flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-600" />
                    Rank: {renderRank(breakdown.week5.rank)}
                  </span>
                )}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span>Sparks</span>
                  <span className="font-semibold">{breakdown.week5.sparks} 🔥</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              Created with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by{" "}
              <a 
                href="https://twitter.com/magicianafk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                @magicianafk
              </a>
            </div>
            <Button onClick={() => setShowShareModal(true)} className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold">
              <Share className="w-4 h-4 mr-2" />
              Flex Your Sparks
            </Button>
          </div>
        </Card>
      </div>

      <ShareModal 
        open={showShareModal}
        onOpenChange={setShowShareModal}
        sparks={breakdown.overall || 0}
        address={address || ''}
        rank={breakdown.overallRank}
      />
    </div>
  );
};

export default UserBreakdown;
