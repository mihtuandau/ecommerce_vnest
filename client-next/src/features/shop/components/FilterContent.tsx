"use client";

import React from "react";
import { Box, Filter, Zap, Star, Check, Plus, Minus } from "lucide-react";
import { cn } from "@/utils/cn";
import { Category, Brand } from "@/types/models";

interface FilterContentProps {
  currentCategory: string | null;
  currentBrand: string | null;
  currentMinPrice: string | null;
  currentMaxPrice: string | null;
  currentMinRating: string | null;
  categories: Category[];
  brands: Brand[];
  updateFilters: (key: string, value: string | null) => void;
  updatePriceFilter: (min: string | null, max: string | null) => void;
  isMobile?: boolean;
}

function FilterSection({ 
  title, 
  children, 
  defaultOpen = true,
  className 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("border-b border-gray-200 py-6", className)}>
      <h3 className="-my-3 flow-root">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex w-full items-center justify-between bg-white py-2 text-sm text-slate-400 hover:text-primary transition-colors"
        >
          <span className="font-bold text-slate-900 text-base tracking-tight">{title}</span>
          <span className="ml-6 flex items-center">
            {isOpen ? (
              <Minus className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
            )}
          </span>
        </button>
      </h3>
      {isOpen && (
        <div className="pt-4 pb-2">
          <div className="space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function FilterContent({
  currentCategory,
  currentBrand,
  currentMinPrice,
  currentMaxPrice,
  currentMinRating,
  categories,
  brands,
  updateFilters,
  updatePriceFilter,
  isMobile = false
}: FilterContentProps) {
  
  return (
    <form className={cn("space-y-2 h-full overflow-auto", isMobile ? "px-2" : "")}>
      {/* Categories Section */}
      <FilterSection title="Danh mục">
        <ul role="list" className="space-y-2 text-sm font-medium">
          <li>
            <button
              type="button"
              onClick={() => updateFilters('categoryId', null)}
              className={cn(
                "text-left text-[15px] transition-colors",
                !currentCategory ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              Tất cả sản phẩm
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => updateFilters('categoryId', String(cat.id))}
                className={cn(
                  "text-left text-[15px] transition-colors",
                  String(cat.id) === currentCategory ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Brands Section */}
      <FilterSection title="Thương hiệu">
        {brands.map((brand) => (
          <div key={brand.id} className="flex items-center gap-3 group/item">
            <div className="flex h-5 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  type="checkbox"
                  checked={String(brand.id) === currentBrand}
                  onChange={() => updateFilters('brandId', String(brand.id) === currentBrand ? null : String(brand.id))}
                  className="col-start-1 row-start-1 appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
                />
                <Check className={cn(
                  "pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center text-white",
                  String(brand.id) === currentBrand ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFilters('brandId', String(brand.id) === currentBrand ? null : String(brand.id))}
              className={cn(
                "text-[15px] text-left transition-colors",
                String(brand.id) === currentBrand ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {brand.name}
            </button>
          </div>
        ))}
      </FilterSection>

      {/* Price Section */}
      <FilterSection title="Khoảng giá">
        {[
          { label: "Dưới 5 triệu", min: "0", max: "5000000" },
          { label: "5 - 15 triệu", min: "5000000", max: "15000000" },
          { label: "Trên 15 triệu", min: "15000000", max: "999999999" }
        ].map((range) => (
          <div key={range.label} className="flex items-center gap-3 group/item">
            <div className="flex h-5 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  type="checkbox"
                  checked={currentMinPrice === range.min && currentMaxPrice === range.max}
                  onChange={() => updatePriceFilter(
                    (currentMinPrice === range.min && currentMaxPrice === range.max) ? null : range.min,
                    (currentMinPrice === range.min && currentMaxPrice === range.max) ? null : range.max
                  )}
                  className="col-start-1 row-start-1 appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
                />
                <Check className={cn(
                  "pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center text-white",
                  (currentMinPrice === range.min && currentMaxPrice === range.max) ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updatePriceFilter(
                (currentMinPrice === range.min && currentMaxPrice === range.max) ? null : range.min,
                (currentMinPrice === range.min && currentMaxPrice === range.max) ? null : range.max
              )}
              className={cn(
                "text-[15px] text-left transition-colors",
                (currentMinPrice === range.min && currentMaxPrice === range.max) ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {range.label}
            </button>
          </div>
        ))}
      </FilterSection>

      {/* Ratings Section */}
      <FilterSection title="Đánh giá">
        {[5, 4, 3].map((s) => (
          <div key={s} className="flex items-center gap-3 group/item">
            <div className="flex h-5 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  type="checkbox"
                  checked={currentMinRating === String(s)}
                  onChange={() => updateFilters('minRating', currentMinRating === String(s) ? null : String(s))}
                  className="col-start-1 row-start-1 appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
                />
                <Check className={cn(
                  "pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center text-white",
                  currentMinRating === String(s) ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFilters('minRating', currentMinRating === String(s) ? null : String(s))}
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                currentMinRating === String(s) ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5 transition-colors", i < s ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                ))}
              </div>
              <span className="text-[15px]">Từ {s} sao</span>
            </button>
          </div>
        ))}
      </FilterSection>
    </form>
  );
}

