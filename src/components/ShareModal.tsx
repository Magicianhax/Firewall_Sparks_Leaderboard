
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShareCard } from '@/components/ShareCard';
import { Share } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sparks: number;
  address: string;
  rank?: number;
}

export const ShareModal = ({ open, onOpenChange, sparks, address, rank }: ShareModalProps) => {
  const handleShare = () => {
    const tweetText = `🔥 JUST BROKE ${sparks} SPARKS IN @UseFirewall GENESIS! 🔥\n\nSitting on a massive ${sparks} Sparks and climbing! 📈\nThe grind is paying off BIG TIME. 🚀\n\nCheck your own Sparks balance on the dashboard built by @magicianafk\n\nWHO'S WITH ME FOR THE NEXT MILESTONE? 👀\n\n#FirewallGenesis`;
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[650px] bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-background">
        <DialogHeader>
          <DialogTitle className="text-yellow-900 dark:text-yellow-100">Share Your Sparks 🔥</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <ShareCard ref={null} sparks={sparks} address={address} rank={rank} />
          <Button 
            onClick={handleShare} 
            className="w-full bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold"
          >
            <Share className="mr-2 h-4 w-4" />
            Share on Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
