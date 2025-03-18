
import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy, Heart } from 'lucide-react';
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
      <div className="absolute top-0 right-0 w-24 sm:w-48 h-24 sm:h-48 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-yellow-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Panther Image */}
      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-14 h-14 sm:w-32 sm:h-32 opacity-90">
        <img 
          src="/lovable-uploads/43912fe3-3a94-46b6-9732-3b26b97391dd.png" 
          alt="Black Panther" 
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex flex-col h-full relative">
        <div className="space-y-1 sm:space-y-4 mb-auto">
          <h2 className="text-2xl sm:text-6xl font-serif tracking-tight text-yellow-950 dark:text-yellow-50">Firewall Genesis</h2>
          
          {rank && (
            <div className="flex items-center gap-1 sm:gap-2 text-yellow-600 dark:text-yellow-400">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6" />
              <span className="text-lg sm:text-2xl font-bold">Rank #{rank}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <span className="font-mono text-xs sm:text-sm text-yellow-800/80 dark:text-yellow-200/80">{truncatedAddress}</span>
          </div>
        </div>

        <div className="flex flex-col space-y-2">
          <p className="text-xl sm:text-4xl font-bold">{sparks.toLocaleString()} Sparks 🔥</p>
          <div className="flex items-start text-[10px] sm:text-sm text-yellow-800/70 dark:text-yellow-200/70 font-medium">
            Created with <Heart className="w-3 h-3 sm:w-4 sm:h-4 mx-1 text-red-500 fill-red-500" /> by{" "}
            <a 
              href="https://twitter.com/magicianafk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-yellow-600 dark:hover:text-yellow-300 transition-colors ml-1"
            >
              @magicianafk
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
});

ShareCard.displayName = 'ShareCard';
