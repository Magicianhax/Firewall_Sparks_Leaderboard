
import React from 'react';
import { Card } from '@/components/ui/card';

interface ShareCardProps {
  sparks: number;
  address: string;
}

export const ShareCard = React.forwardRef<HTMLDivElement, ShareCardProps>(({ sparks, address }, ref) => {
  return (
    <Card ref={ref} className="p-6 bg-gradient-to-br from-yellow-50/90 to-yellow-500/20 dark:from-yellow-900/20 dark:to-yellow-500/10 text-yellow-950 dark:text-yellow-50 shadow-xl w-[600px] h-[315px] flex flex-col justify-between border border-yellow-200/50 dark:border-yellow-500/20">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold tracking-tight">Firewall Genesis</h2>
        <div className="space-y-2">
          <p className="text-2xl font-semibold">🔥 {sparks} Sparks</p>
          <p className="text-sm opacity-90 break-all">{address}</p>
        </div>
      </div>
      <div className="text-sm opacity-90">
        Created with ❤️ by @magicianafk
      </div>
    </Card>
  );
});

ShareCard.displayName = 'ShareCard';
