
import React from 'react';
import { Card } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  address: string;
  sparks: number;
}

interface LeaderboardSectionProps {
  title: string;
  data: LeaderboardEntry[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const LeaderboardSection = ({ title, data, searchTerm, onSearchChange }: LeaderboardSectionProps) => {
  const filteredData = data.filter(entry =>
    entry.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="p-6 glass-card">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
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
              key={entry.address}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg leaderboard-transition",
                index < 3 ? "bg-primary/5" : "bg-secondary/50",
                "hover:scale-[1.02]"
              )}
            >
              <div className="flex items-center gap-4">
                <span className={cn(
                  "font-semibold",
                  index === 0 && "text-yellow-500",
                  index === 1 && "text-gray-400",
                  index === 2 && "text-amber-600"
                )}>
                  #{index + 1}
                </span>
                <span className="font-mono">{entry.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{entry.sparks}</span>
                <span className="text-primary">🔥</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default LeaderboardSection;
