"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface BannerListToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function BannerListToolbar({
  searchTerm,
  onSearchChange,
}: BannerListToolbarProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 gap-4 border-b border-slate-100">
      <div className="relative flex-1 max-w-md group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
        <Input
          placeholder="Tìm theo tiêu đề banner..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 rounded-xl border-slate-200 bg-white focus:bg-white transition-all text-sm font-medium"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-10 rounded-xl border-slate-200 font-bold text-xs uppercase tracking-wider gap-2 bg-white"
        >
          <Filter className="h-4 w-4 text-slate-400" />
          Bộ lọc
        </Button>
      </div>
    </div>
  );
}
