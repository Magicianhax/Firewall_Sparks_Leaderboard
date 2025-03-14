import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readLeaderboardData } from '@/utils/excelUtils';
import { useToast } from "@/components/ui/use-toast";

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
  const [breakdown, setBreakdown] = useState<{
    overall: number;
    week1: WeeklyBreakdown;
    week2: WeeklyBreakdown;
    week3: WeeklyBreakdown;
    week4: WeeklyBreakdown;
  } | null>(null);

  useEffect(() => {
    const fetchBreakdown = async () => {
      const data = await readLeaderboardData(1);
      if (!data) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
        return;
      }

      const findUserInData = (weekData: any) => 
        weekData.data.find((entry: any) => entry.address === address);

      const overallData = findUserInData(data.overall);
      const week1Data = findUserInData(data.week1);
      const week2Data = findUserInData(data.week2);
      const week3Data = findUserInData(data.week3);
      const week4Data = findUserInData(data.week4);

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
    <div className="min-h-screen p-6 bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-background">
      <div className="container mx-auto space-y-8 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-yellow-100/50">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tighter text-yellow-900/90 dark:text-yellow-100/90 flex items-center gap-2">
            <Sparkle className="w-6 h-6 text-yellow-500" />
            User Breakdown
          </h1>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-mono">{address}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl">{breakdown.overall}</span>
                <span className="text-yellow-500">🔥</span>
              </div>
            </div>

            {[1, 2, 3, 4].map((week) => {
              const weekData = breakdown[`week${week}` as keyof typeof breakdown] as WeeklyBreakdown;
              return (
                <div key={week} className="p-4 rounded-lg bg-secondary/50">
                  <h3 className="font-semibold mb-2">Week {week}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Sparks</span>
                      <span className="font-semibold">{weekData.sparks} 🔥</span>
                    </div>
                    {weekData.hotSlothVerification && (
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Hot Sloth Verification</span>
                        <span>{weekData.hotSlothVerification}</span>
                      </div>
                    )}
                    {weekData.nftCollection && (
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>NFT Collection</span>
                        <span>{weekData.nftCollection}</span>
                      </div>
                    )}
                    {weekData.referralBonus && (
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Referral Bonus</span>
                        <span>{weekData.referralBonus}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserBreakdown;
