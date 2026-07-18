"use client";

import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";

interface CartPageHeaderProps {
  itemCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onRemoveSelected: () => void;
}

export function CartPageHeader({
  itemCount,
  isAllSelected,
  onToggleSelectAll,
  onRemoveSelected,
}: CartPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-brand-sand">
      <h1 className="text-2xl md:text-3xl font-bold text-brand-espresso font-serif leading-none tracking-tight">
        Giỏ hàng{" "}
        <em className="italic text-brand-bronze font-medium font-serif">
          của bạn
        </em>
        <span className="text-[14px] font-medium text-brand-taupe ml-2">
          ({itemCount} sản phẩm)
        </span>
      </h1>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={isAllSelected}
            onCheckedChange={onToggleSelectAll}
          />
          <label
            htmlFor="select-all"
            className="text-[13px] font-bold text-brand-espresso cursor-pointer select-none"
          >
            Chọn tất cả
          </label>
        </div>
        <div className="w-[1px] h-3.5 bg-brand-sand" />
        <button
          className="text-[13px] font-bold text-brand-taupe hover:text-red-500 transition-colors flex items-center gap-1.5"
          onClick={onRemoveSelected}
        >
          <Trash2 size={16} /> Xoá đã chọn
        </button>
      </div>
    </div>
  );
}
