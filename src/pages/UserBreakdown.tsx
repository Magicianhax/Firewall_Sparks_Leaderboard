import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";
import { ShareModal } from '@/components/ShareModal';

interface WeeklyBreakdown {
  sparks: number;
  hotSlothVerification?: string;
  nftCollection?: string;
  referralBonus?: string;
}

const UserBreakdown = () => {
  const { address } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showShareModal, setShowShareModal] = useState(false);
  const [breakdown, setBreakdown] = useState<{
    overall: number;
    week1: WeeklyBreakdown;
    week2: WeeklyBreakdown;
    week3: WeeklyBreakdown;
    week4: WeeklyBreakdown;
  } | null>(null);
  const [rank, setRank] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchBreakdown = async () => {
      const data = await readLeaderboardData(1, true);
      if (!data) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
        return;
      }

      const overallData = data.overall.data.find((entry: any) => entry.address === address);
      const week1Data = data.week1.data.find((entry: any) => entry.address === address);
      const week2Data = data.week2.data.find((entry: any) => entry.address === address);
      const week3Data = data.week3.data.find((entry: any) => entry.address === address);
      const week4Data = data.week4.data.find((entry: any) => entry.address === address);

      const userRank = data.overall.data
        .sort((a: any, b: any) => b.sparks - a.sparks)
        .findIndex((entry: any) => entry.address === address) + 1;

      setRank(userRank > 0 ? userRank : undefined);

      const userBreakdown = {
        overall: overallData?.sparks || 0,
        week1: {
          sparks: week1Data?.sparks || 0,
          hotSlothVerification: week1Data?.hotSlothVerification,
        },
        week2: {
          sparks: week2Data?.sparks || 0,
          nftCollection: week2Data?.nftCollection,
        },
        week3: {
          sparks: week3Data?.sparks || 0,
          referralBonus: week3Data?.referralBonus,
        },
        week4: {
          sparks: week4Data?.sparks || 0,
        },
      };

      setBreakdown(userBreakdown);
    };

    fetchBreakdown();
  }, [address, toast]);

  if (!breakdown) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-3 sm:p-6 bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-background">
      <div className="container mx-auto space-y-4 sm:space-y-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="hover:bg-yellow-100/50 w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-yellow-900/90 dark:text-yellow-100/90 flex items-center gap-2">
            User Breakdown
          </h1>
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

        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-4 border-b gap-2">
              <span className="font-mono text-sm sm:text-base break-all">{address}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl">{breakdown.overall}</span>
                <span className="text-yellow-500">🔥</span>
              </div>
            </div>

            {[1, 2, 3, 4].map((week) => {
              const weekData = breakdown[`week${week}` as keyof typeof breakdown] as WeeklyBreakdown;
              return (
                <div key={week} className="p-3 sm:p-4 rounded-lg bg-secondary/50">
                  <h3 className="font-semibold mb-3">Week {week}</h3>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span>Sparks</span>
                      <span className="font-semibold">{weekData.sparks} 🔥</span>
                    </div>
                    {weekData.hotSlothVerification && (
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                        <span>Hot Sloth Verification</span>
                        <span className="break-all">{weekData.hotSlothVerification}</span>
                      </div>
                    )}
                    {weekData.nftCollection && (
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                        <span>NFT Collection</span>
                        <span className="break-all">{weekData.nftCollection}</span>
                      </div>
                    )}
                    {weekData.referralBonus && (
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center text-sm text-muted-foreground gap-1">
                        <span>Referral Bonus</span>
                        <span className="break-all">{weekData.referralBonus}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                Created with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by @magicianafk
              </div>
              <Button onClick={() => setShowShareModal(true)} className="w-full sm:w-auto bg-[#0066FF] hover:bg-[#0052CC] text-white">
                <Share className="w-4 h-4 mr-2" />
                Flex Your Sparks
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ShareModal 
        open={showShareModal}
        onOpenChange={setShowShareModal}
        sparks={breakdown.overall}
        address={address || ''}
        rank={rank}
      />
    </div>
  );
};

export default UserBreakdown;
