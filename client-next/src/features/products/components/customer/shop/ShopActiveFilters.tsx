"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import type { Brand, Category } from "@/types/models";

interface ShopActiveFiltersProps {
  brands: Brand[];
  categories: Category[];
  currentBrand: string | null;
  currentCategory: string | null;
  currentMaxPrice: string | null;
  currentMinPrice: string | null;
  currentMinRating: string | null;
  currentSearch: string | null;
  onClearAll: () => void;
  onFilterChange: (key: string, value: string | null) => void;
  onPriceChange: (min: string | null, max: string | null) => void;
}

function findCategoryRecursive(cats: Category[], id: string | null): Category | null {
  if (!id) return null;
  for (const cat of cats) {
    if (String(cat.id) === id) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryRecursive(cat.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function ShopActiveFilters({
  brands,
  categories,
  currentBrand,
  currentCategory,
  currentMaxPrice,
  currentMinPrice,
  currentMinRating,
  currentSearch,
  onClearAll,
  onFilterChange,
  onPriceChange,
}: ShopActiveFiltersProps) {
  const hasActiveFilter =
    currentCategory ||
    currentBrand ||
    currentMinPrice ||
    currentMaxPrice ||
    currentMinRating ||
    currentSearch;

  if (!hasActiveFilter) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-500">
      <span className="text-[10px] font-bold text-brand-taupe uppercase tracking-widest mr-2">
        Đang lọc:
      </span>

      {currentCategory && (
        <FilterChip onClear={() => onFilterChange("categoryId", null)}>
          Danh mục: {findCategoryRecursive(categories, currentCategory)?.name || "Đang tải..."}
        </FilterChip>
      )}

      {currentBrand && (
        <FilterChip onClear={() => onFilterChange("brandId", null)}>
          Hiệu:{" "}
          {brands.find((brand) => String(brand.id) === currentBrand)?.name ||
            "Đang tải..."}
        </FilterChip>
      )}

      {(currentMinPrice || currentMaxPrice) && (
        <FilterChip onClear={() => onPriceChange(null, null)}>
          Giá:{" "}
          {currentMinPrice
            ? `${(Number(currentMinPrice) / 1000).toLocaleString()}k`
            : "0"}{" "}
          -{" "}
          {currentMaxPrice
            ? `${(Number(currentMaxPrice) / 1000).toLocaleString()}k`
            : "∞"}
        </FilterChip>
      )}

      {currentMinRating && (
        <FilterChip onClear={() => onFilterChange("minRating", null)}>
          Đánh giá: {currentMinRating}+
        </FilterChip>
      )}

      {currentSearch && (
        <button
          onClick={() => onFilterChange("search", null)}
          className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-full text-[11px] font-medium shadow-md shadow-primary/10 group"
        >
          Tìm: "{currentSearch}"
          <X size={12} className="text-white/60 group-hover:text-white" />
        </button>
      )}

      <button
        onClick={onClearAll}
        className="text-[11px] font-bold text-brand-bronze hover:underline px-2 transition-all"
      >
        Xóa tất cả
      </button>
    </div>
  );
}

function FilterChip({
  children,
  onClear,
}: {
  children: ReactNode;
  onClear: () => void;
}) {
  return (
    <button
      onClick={onClear}
      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-sand rounded-full text-[11px] font-medium text-primary hover:border-brand-bronze transition-all group"
    >
      {children}
      <X size={12} className="text-brand-taupe/40 group-hover:text-rose-500" />
    </button>
  );
}
