"use client";

import React from "react";
import { Search, Filter, ArrowDownUp } from "lucide-react";

interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  discountStatus: string;
  onDiscountStatusChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  categories: any[];
}

export function Toolbar({
  searchTerm,
  onSearchChange,
  categoryId,
  onCategoryChange,
  discountStatus,
  onDiscountStatusChange,
  sortBy,
  onSortChange,
  categories,
}: ToolbarProps) {
  return (
    <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] w-full md:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          placeholder="Tìm theo tên, slug, danh mục..."
          className="w-full pl-9 pr-4 h-[36px] rounded-lg border border-slate-200 bg-white text-[13px] focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
        <div className="relative flex-1 md:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full pl-9 pr-8 h-[36px] border border-slate-200 rounded-lg text-[13px] bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] transition-all"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 md:w-40">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full pl-9 pr-8 h-[36px] border border-slate-200 rounded-lg text-[13px] bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] transition-all"
            value={discountStatus}
            onChange={(e) => onDiscountStatusChange(e.target.value)}
          >
            <option value="ALL">Khuyến mãi: Tất cả</option>
            <option value="DISCOUNTED">Đang giảm giá</option>
            <option value="NO_DISCOUNT">Không giảm giá</option>
          </select>
        </div>

        <div className="relative flex-1 md:w-40">
          <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <select
            className="w-full pl-9 pr-8 h-[36px] border border-slate-200 rounded-lg text-[13px] bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800 shadow-sm cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] transition-all"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="sold_desc">Bán chạy nhất</option>
            <option value="name_asc">Tên A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
