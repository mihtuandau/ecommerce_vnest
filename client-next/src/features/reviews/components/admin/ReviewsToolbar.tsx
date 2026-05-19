"use client";

import React from "react";
import { Search, Star, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface ReviewsToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  ratingFilter: number | null;
  setRatingFilter: (val: number | null) => void;
}

export function ReviewsToolbar({
  searchQuery,
  setSearchQuery,
  ratingFilter,
  setRatingFilter,
}: ReviewsToolbarProps) {
  const handleReset = () => {
    setSearchQuery("");
    setRatingFilter(null);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
      
      <div className="relative w-full md:w-[360px]">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
        <Input
          type="text"
          placeholder="Tìm sản phẩm, đánh giá hoặc người dùng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs text-slate-650 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-450 focus:bg-white transition-all placeholder:text-slate-400 h-10"
        />
      </div>

      
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">
        <Select
          value={ratingFilter === null ? "ALL" : String(ratingFilter)}
          onValueChange={(val) => {
            setRatingFilter(val === "ALL" ? null : Number(val));
          }}
        >
          <SelectTrigger className="w-[180px] h-10 text-xs rounded-xl border-slate-200 bg-white">
            <Star className="h-3.5 w-3.5 mr-2 fill-amber-400 text-amber-405" />
            <SelectValue placeholder="Lọc theo sao" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200">
            <SelectItem value="ALL">Tất cả sao</SelectItem>
            <SelectItem value="5">5 sao (★★★★★)</SelectItem>
            <SelectItem value="4">4 sao (★★★★☆)</SelectItem>
            <SelectItem value="3">3 sao (★★★☆☆)</SelectItem>
            <SelectItem value="2">2 sao (★★☆☆☆)</SelectItem>
            <SelectItem value="1">1 sao (★☆☆☆☆)</SelectItem>
          </SelectContent>
        </Select>

        
        {(searchQuery || ratingFilter !== null) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-10 px-3 rounded-xl text-slate-550 hover:text-slate-900 gap-1 text-xs border border-dashed border-slate-200 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Khởi tạo lại
          </Button>
        )}
      </div>
    </div>
  );
}
