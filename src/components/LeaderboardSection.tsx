
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Search, Sparkle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useNavigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LeaderboardEntry {
  address: string;
  sparks: number;
  nftCollection?: string;
  hotSlothVerification?: string;
  referralBonus?: string;
  rank?: number;
}

interface LeaderboardSectionProps {
  title: string;
  data: LeaderboardEntry[];
  fullData: LeaderboardEntry[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const LeaderboardSection = ({ 
  title, 
  data, 
  fullData = [],
  searchTerm, 
  onSearchChange,
  totalPages,
  currentPage,
  onPageChange 
}: LeaderboardSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LeaderboardEntry[]>([]);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const searchAddresses = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        setNoResults(false);
        return;
      }

      setIsSearching(true);
      setNoResults(false);

      try {
        const searchTermLower = searchTerm.toLowerCase();
        let results: LeaderboardEntry[] = [];

        const dataToSearch = fullData.length > 0 ? fullData : data;
        
        results = dataToSearch
          .filter(entry => entry.address.toLowerCase().includes(searchTermLower))
          .map((entry, index) => ({
            ...entry,
            rank: dataToSearch.findIndex(e => e.address === entry.address) + 1
          }));

        setSearchResults(results);
        setNoResults(results.length === 0);
      } catch (error) {
        console.error('Search error:', error);
        setNoResults(true);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(searchAddresses, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, data, fullData]);

  const displayData = searchTerm ? searchResults : data;

  // Function to truncate address for better display
  const formatAddress = (address: string): string => {
    if (!address) return '';
    if (address.length <= 12) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const renderPagination = () => {
    if (searchTerm || totalPages <= 1) return null;

    const maxVisiblePages = isMobile ? 3 : 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <Pagination>
        <PaginationContent className="flex-wrap gap-2">
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(currentPage - 1)}
              className={cn(
                "cursor-pointer",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
              </PaginationItem>
              {startPage > 2 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
            </>
          )}

          {pages.map((page) => (
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

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <span className="px-2">...</span>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink onClick={() => onPageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(currentPage + 1)}
              className={cn(
                "cursor-pointer",
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderContent = () => {
    if (isSearching) {
      return Array(5).fill(0).map((_, index) => (
        <div key={index} className="p-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ));
    }

    if (noResults) {
      return (
        <div className="p-8 text-center text-muted-foreground">
          No addresses found matching "{searchTerm}"
        </div>
      );
    }

    return displayData.map((entry, index) => (
      <div
        key={`${entry.address}-${index}`}
        className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg leaderboard-transition hover:bg-yellow-50 dark:hover:bg-yellow-900/10 cursor-pointer gap-4",
          entry.rank && entry.rank <= 3 ? "bg-yellow-100/50 dark:bg-yellow-900/20" : "bg-secondary/50"
        )}
        onClick={() => navigate(`/user/${entry.address}`)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
          <span className={cn(
            "font-semibold",
            entry.rank === 1 && "text-yellow-500",
            entry.rank === 2 && "text-gray-400",
            entry.rank === 3 && "text-amber-600"
          )}>
            #{entry.rank || index + 1 + ((currentPage - 1) * 50)}
          </span>
          <div className="flex flex-col">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono hover:text-yellow-600 transition-colors">
                  {formatAddress(entry.address)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">{entry.address}</p>
              </TooltipContent>
            </Tooltip>
            
            {entry.nftCollection && (
              <span className="text-sm text-muted-foreground">
                NFT Collection: {entry.nftCollection}
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
        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="font-semibold">{entry.sparks.toLocaleString()}</span>
          <span className="text-yellow-500">🔥</span>
        </div>
      </div>
    ));
  };

  return (
    <Card className="p-4 sm:p-6 glass-card">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2 justify-center sm:justify-start">
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
          {renderContent()}
        </div>

        {renderPagination()}
      </div>
    </Card>
  );
};

export default LeaderboardSection;
