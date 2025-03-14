import React from 'react';
import { Card } from "@/components/ui/card";
import { Search, Sparkle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface LeaderboardEntry {
  address: string;
  sparks: number;
  nftCollection?: string;
  hotSlothVerification?: string;
  referralBonus?: string;
}

interface LeaderboardSectionProps {
  title: string;
  data: LeaderboardEntry[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const LeaderboardSection = ({ 
  title, 
  data, 
  searchTerm, 
  onSearchChange,
  totalPages,
  currentPage,
  onPageChange 
}: LeaderboardSectionProps) => {
  const filteredData = data.filter(entry =>
    entry.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6 glass-card">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {title}
            <Sparkle className="w-5 h-5 text-yellow-500 animate-pulse" />
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by address..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          {filteredData.map((entry, index) => (
            <div
              key={`${entry.address}-${index}`}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg leaderboard-transition hover:bg-yellow-50 dark:hover:bg-yellow-900/10",
                index < 3 ? "bg-yellow-100/50 dark:bg-yellow-900/20" : "bg-secondary/50"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-semibold",
                  index === 0 && "text-yellow-500",
                  index === 1 && "text-gray-400",
                  index === 2 && "text-amber-600"
                )}>
                  #{index + 1 + ((currentPage - 1) * 50)}
                </span>
                <div className="flex flex-col">
                  <span className="font-mono">{entry.address}</span>
                  {entry.nftCollection && (
                    <span className="text-sm text-muted-foreground">
                      NFT: {entry.nftCollection}
                    </span>
                  )}
                  {entry.hotSlothVerification && (
                    <span className="text-sm text-muted-foreground">
                      Hot Sloth: {entry.hotSlothVerification}
                    </span>
                  )}
                  {entry.referralBonus && (
                    <span className="text-sm text-muted-foreground">
                      Referral: {entry.referralBonus}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{entry.sparks}</span>
                <span className="text-yellow-500">🔥</span>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(currentPage - 1)}
                  className={cn("cursor-pointer", currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(currentPage + 1)}
                  className={cn("cursor-pointer", currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Card>
  );
};

export default LeaderboardSection;
