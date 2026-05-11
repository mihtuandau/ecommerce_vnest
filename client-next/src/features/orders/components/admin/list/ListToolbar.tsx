"use client";

import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface OrderListToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function OrderListToolbar({ searchTerm, onSearchChange }: OrderListToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Tìm kiếm đơn hàng..." 
          className="w-full pl-10 pr-4 h-10 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="font-semibold text-slate-500 h-10 px-4 hover:bg-slate-50">
          <Filter className="h-4 w-4 mr-2 text-slate-400" /> Lọc thêm
        </Button>
      </div>
    </div>
  );
}
