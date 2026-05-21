"use client";

import React from "react";
import { LayoutGrid as GridIcon, List as ListIcon, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

interface WishlistToolbarProps {
  filteredCount: number;
  discountFilter: boolean;
  currentColl: string;
  sortBy: "recent" | "price-asc" | "price-desc" | "discount";
  viewMode: "grid" | "list";
  onResetDiscountFilter: () => void;
  onResetCollFilter: () => void;
  onSortChange: (val: "recent" | "price-asc" | "price-desc" | "discount") => void;
  onViewModeChange: (val: "grid" | "list") => void;
}

export function WishlistToolbar({
  filteredCount,
  discountFilter,
  currentColl,
  sortBy,
  viewMode,
  onResetDiscountFilter,
  onResetCollFilter,
  onSortChange,
  onViewModeChange,
}: WishlistToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-medium text-brand-taupe">
          Hiển thị <strong className="text-brand-espresso font-bold">{filteredCount}</strong> sản phẩm
        </span>
        {discountFilter && (
          <button
            onClick={onResetDiscountFilter}
            className="text-[11px] font-bold bg-brand-cream border border-brand-sand text-brand-bronze px-2.5 py-1 rounded-full hover:bg-brand-ivory transition-all flex items-center gap-1.5"
          >
            Đang giảm giá <X className="w-3 h-3" />
          </button>
        )}
        {currentColl !== "all" && !discountFilter && (
          <button
            onClick={onResetCollFilter}
            className="text-[11px] font-bold bg-brand-cream border border-brand-sand text-brand-espresso px-2.5 py-1 rounded-full hover:bg-brand-ivory transition-all flex items-center gap-1.5"
          >
            {currentColl} <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3.5">
        <div className="relative">
          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as any)}
          >
            <SelectTrigger className="w-[180px] border border-brand-sand bg-brand-cream">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Mới thêm nhất</SelectItem>
              <SelectItem value="price-asc">Giá thấp nhất</SelectItem>
              <SelectItem value="price-desc">Giá cao nhất</SelectItem>
              <SelectItem value="discount">Giảm nhiều nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center border border-brand-sand rounded-xl bg-white p-1 shadow-sm">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              viewMode === "grid"
                ? "bg-brand-espresso text-white shadow-sm"
                : "text-brand-taupe hover:text-brand-espresso"
            )}
            title="Dạng lưới"
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              viewMode === "list"
                ? "bg-brand-espresso text-white shadow-sm"
                : "text-brand-taupe hover:text-brand-espresso"
            )}
            title="Dạng danh sách"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
