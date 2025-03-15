
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareCardProps {
  sparks: number;
  address: string;
  rank?: number;
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(({ sparks, address, rank }, ref) => {
  const isMobile = useIsMobile();
  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  
  const cardSize = isMobile ? {
    width: '320px',
    height: '168px',
    fontSize: '0.875rem'
  } : {
    width: '600px',
    height: '315px',
    fontSize: '1rem'
  };

  return (
    <Card 
      ref={ref} 
      className="p-4 sm:p-8 bg-gradient-to-br from-yellow-50/90 to-yellow-500/20 dark:from-yellow-900/20 dark:to-yellow-500/10 
        text-yellow-950 dark:text-yellow-50 shadow-xl border border-yellow-200/50 dark:border-yellow-500/20 
        relative overflow-hidden"
      style={{
        width: cardSize.width,
        height: cardSize.height
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 sm:w-48 h-24 sm:h-48 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="space-y-4 sm:space-y-8 relative">
        <h2 className="text-2xl sm:text-6xl font-serif tracking-tight text-yellow-950 dark:text-yellow-50">Firewall Genesis</h2>
        
        <div className="space-y-3 sm:space-y-6">
          {rank && (
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-4 h-4 sm:w-7 sm:h-7" />
              <span className="text-lg sm:text-2xl font-bold">Rank #{rank}</span>
            </div>
          )}
          
          <div className="space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-2xl sm:text-5xl">🔥</span>
              <p className="text-xl sm:text-4xl font-bold">{sparks.toLocaleString()} Sparks</p>
            </div>
            <p className="text-xs sm:text-base opacity-80 font-mono text-yellow-800 dark:text-yellow-200">{truncatedAddress}</p>
          </div>
        </div>
      </div>

      <div className="text-xs sm:text-base opacity-90 flex items-center gap-2 text-yellow-800 dark:text-yellow-200 absolute bottom-2 sm:bottom-4 left-4 sm:left-8">
        Created with ❤️ by @magicianafk
      </div>
    </Card>
  );
});

ShareCard.displayName = 'ShareCard';
