"use client";

import React from "react";
import { Search } from "lucide-react";

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function Toolbar({ searchTerm, onSearchChange }: ToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 flex items-center gap-4">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Tìm theo tên, slug, danh mục..."
          className="w-full pl-10 pr-4 h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
