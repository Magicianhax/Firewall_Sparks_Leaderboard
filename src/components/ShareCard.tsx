
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ShareCardProps {
  sparks: number;
  address: string;
  rank?: number;
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(({ sparks, address, rank }, ref) => {
  // Only show first 6 and last 4 characters of address
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <Card 
      ref={ref} 
      className="p-8 bg-gradient-to-br from-yellow-50/90 to-yellow-500/20 dark:from-yellow-900/20 dark:to-yellow-500/10 
        text-yellow-950 dark:text-yellow-50 shadow-xl w-[600px] h-[315px] flex flex-col justify-between 
        border border-yellow-200/50 dark:border-yellow-500/20 relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-6 relative">
        <h2 className="text-5xl font-bold font-serif tracking-tight">Firewall Genesis</h2>
        
        <div className="space-y-4">
          {rank && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-6 h-6" />
              <span className="text-xl font-bold">Rank #{rank}</span>
            </div>
          )}
          
          <div className="space-y-3">
            <p className="text-4xl font-bold flex items-center gap-3">
              <span className="text-5xl">🔥</span>
              <span>{sparks.toLocaleString()} Sparks</span>
            </p>
            <p className="text-sm opacity-80 font-mono">{truncatedAddress}</p>
          </div>
        </div>
      </div>

      <div className="text-sm opacity-90 flex items-center gap-1.5">
        Created with ❤️ by @magicianafk
      </div>
    </Card>
  );
});

ShareCard.displayName = 'ShareCard';
