
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
  rank?: number;
}

export const ShareModal = ({ open, onOpenChange, sparks, address, rank }: ShareModalProps) => {
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
      const blob = await fetch(dataUrl).then(res => res.blob());
      const file = new File([blob], 'firewall-sparks.png', { type: 'image/png' });
      
      const tweetText = `🔥 JUST BROKE ${sparks} SPARKS IN @UseFirewall GENESIS! 🔥\n\nSitting on a massive ${sparks} Sparks and climbing! 📈\nThe grind is paying off BIG TIME. 🚀\n\nCheck your own Sparks balance on the dashboard built by @magicianafk\n\nWHO'S WITH ME FOR THE NEXT MILESTONE? 👀\n\n#FirewallGenesis`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          text: tweetText,
          files: [file],
        });
      } else {
        // Open Twitter Web Intent as fallback
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(twitterUrl, '_blank');
        
        // Also trigger download since we can't share the image directly
        const link = document.createElement('a');
        link.download = 'firewall-sparks.png';
        link.href = dataUrl;
        link.click();
        
        toast({
          title: "Image downloaded",
          description: "Since direct sharing isn't supported, we've downloaded the image for you to share manually.",
        });
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
          <ShareCard ref={cardRef} sparks={sparks} address={address} rank={rank} />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleDownload} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Card
            </Button>
            <Button 
              onClick={handleShare} 
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-semibold"
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
