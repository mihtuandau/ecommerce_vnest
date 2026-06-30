"use client";

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

const controlClass =
  "h-10 w-full rounded-lg border border-slate-200 bg-white text-sm text-slate-700 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100";

const selectClass = `${controlClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010l5%205%205-5H7z%22%20fill%3D%22%2394a3b8%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_4px_center] pl-9 pr-8`;

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
    <div className="flex flex-col items-center gap-3 border-b border-slate-100 bg-slate-50/30 p-4 md:flex-row">
      <div className="relative w-full min-w-[200px] flex-1 md:w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Tìm theo tên, slug, danh mục..."
          className={`${controlClass} pl-9 pr-4`}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
        <div className="relative flex-1 md:w-48">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            className={selectClass}
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

        <div className="relative flex-1 md:w-44">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            className={selectClass}
            value={discountStatus}
            onChange={(e) => onDiscountStatusChange(e.target.value)}
          >
            <option value="ALL">Khuyến mãi: tất cả</option>
            <option value="DISCOUNTED">Đang giảm giá</option>
            <option value="NO_DISCOUNT">Không giảm giá</option>
          </select>
        </div>

        <div className="relative flex-1 md:w-44">
          <ArrowDownUp className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            className={selectClass}
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
