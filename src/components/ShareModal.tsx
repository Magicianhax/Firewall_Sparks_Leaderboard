import React, { useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShareCard } from '@/components/ShareCard';
import { Download, Share } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sparks: number;
  address: string;
}

export const ShareModal = ({ open, onOpenChange, sparks, address }: ShareModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = 'firewall-sparks.png';
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Success!",
        description: "Card downloaded successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download card",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current);
      const tweetText = `🔥 JUST BROKE ${sparks} SPARKS IN @UseFirewall GENESIS! 🔥\n\nSitting on a massive ${sparks} Sparks and climbing! 📈\nThe grind is paying off BIG TIME. 🚀\n\nCheck your own Sparks balance on the dashboard built by @magicianafk\n\nWHO'S WITH ME FOR THE NEXT MILESTONE? 👀\n\n#FirewallGenesis`;
      
      // Create a Blob from the dataUrl
      const blob = await (await fetch(dataUrl)).blob();
      
      // Check if Web Share API supports sharing files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'firewall-sparks.png', { type: 'image/png' })] })) {
        try {
          await navigator.share({
            text: tweetText,
            files: [new File([blob], 'firewall-sparks.png', { type: 'image/png' })],
          });
        } catch (err) {
          // Fallback to Twitter Web Intent if share fails
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
        }
      } else {
        // Fallback to Twitter Web Intent
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`, '_blank');
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to share card",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[650px] bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900/10 dark:to-background">
        <DialogHeader>
          <DialogTitle className="text-yellow-900 dark:text-yellow-100">Share Your Sparks 🔥</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <ShareCard ref={cardRef} sparks={sparks} address={address} />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownload} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Card
            </Button>
            <Button 
              onClick={handleShare} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white"
            >
              <Share className="mr-2 h-4 w-4" />
              Share on Twitter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
