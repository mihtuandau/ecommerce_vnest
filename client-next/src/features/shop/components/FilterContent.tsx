"use client";

import React from "react";
import { Box, Filter, Zap, Star, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface FilterContentProps {
  currentCategory: string | null;
  currentBrand: string | null;
  currentMinPrice: string | null;
  currentMaxPrice: string | null;
  currentMinRating: string | null;
  categories: any[];
  brands: any[];
  updateFilters: (key: string, value: string | null) => void;
  updatePriceFilter: (min: string | null, max: string | null) => void;
  isMobile?: boolean;
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
  
  const headerStyle = "text-sm font-semibold text-slate-900 flex items-center gap-2";
  const itemStyle = "text-[13px] font-medium transition-all px-4 py-2.5 rounded-xl text-left";
  
  return (
    <div className="space-y-8">
      {/* Categories Section */}
      <div className="space-y-4">
        <h3 className={headerStyle}>
          <Box className="h-4 w-4 text-primary" />
          Danh mục
        </h3>
        <div className={cn("flex flex-wrap lg:flex-col gap-2", !isMobile && "flex-col")}>
          <button
            onClick={() => updateFilters('categoryId', null)}
            className={cn(
              itemStyle,
              !currentCategory 
                ? "bg-primary text-white shadow-lg shadow-primary/20 font-semibold" 
                : "text-slate-700 bg-slate-50 lg:bg-transparent hover:text-primary hover:bg-slate-100"
            )}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => updateFilters('categoryId', String(cat.id))}
              className={cn(
                itemStyle,
                String(cat.id) === currentCategory 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 font-semibold" 
                  : "text-slate-700 bg-slate-50 lg:bg-transparent hover:text-primary hover:bg-slate-100"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Section */}
      <div className="space-y-4">
        <h3 className={headerStyle}>
          <Filter className="h-4 w-4 text-primary" />
          Thương hiệu
        </h3>
        <div className={cn("flex flex-wrap lg:flex-col gap-2", !isMobile && "flex-col")}>
          {brands.map((brand: any) => (
            <button
              key={brand.id}
              onClick={() => updateFilters('brandId', String(brand.id))}
              className={cn(
                itemStyle,
                "border flex items-center justify-between",
                String(brand.id) === currentBrand 
                  ? "bg-primary/5 text-primary border-primary/20 font-semibold" 
                  : "bg-white lg:bg-transparent border-transparent text-slate-700 hover:bg-slate-50 hover:text-primary"
              )}
            >
              {brand.name}
              {String(brand.id) === currentBrand && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Price Presets */}
      <div className="space-y-4">
        <h3 className={headerStyle}>
          <Zap className="h-4 w-4 text-[#e85d24]" />
          Khoảng giá
        </h3>
        <div className={cn("grid grid-cols-2 lg:grid-cols-1 gap-2", !isMobile && "grid-cols-1")}>
          {[
            { label: "Tất cả", min: null, max: null },
            { label: "Dưới 5tr", min: "0", max: "5000000" },
            { label: "5tr - 15tr", min: "5000000", max: "15000000" },
            { label: "Trên 15tr", min: "15000000", max: "999999999" }
          ].map((range) => (
            <button 
              key={range.label} 
              onClick={() => updatePriceFilter(range.min, range.max)}
              className={cn(
                itemStyle,
                "border",
                (currentMinPrice === range.min && currentMaxPrice === range.max) 
                  ? "bg-primary/5 text-primary border-primary/20 font-semibold" 
                  : "bg-white lg:bg-transparent border-transparent text-slate-700 hover:bg-slate-50 hover:text-primary"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="space-y-4">
        <h3 className={headerStyle}>
           <Star className="h-4 w-4 text-[#f4c300]" />
           Đánh giá
        </h3>
        <div className={cn("grid grid-cols-2 lg:grid-cols-1 gap-2", !isMobile && "grid-cols-1")}>
          {[null, 5, 4, 3].map((s) => (
            <button 
              key={s ?? 'all'} 
              onClick={() => updateFilters('minRating', s ? String(s) : null)}
              className={cn(
                itemStyle,
                "border flex items-center gap-2",
                (currentMinRating === (s ? String(s) : null)) 
                  ? "bg-primary/5 border-primary/20 font-semibold" 
                  : "bg-white lg:bg-transparent border-transparent hover:bg-slate-50"
              )}
            >
               <div className="flex gap-0.5">
                 {s === null ? (
                   <span className="text-[13px] font-medium text-slate-700">Tất cả</span>
                 ) : (
                   [...Array(5)].map((_, i) => (
                     <Star key={i} className={`h-3 w-3 ${i < s ? "fill-[#f4c300] text-[#f4c300]" : "text-slate-200"}`} />
                   ))
                 )}
               </div>
               {s !== null && <span className={cn("text-[13px] font-medium transition-colors", currentMinRating === String(s) ? 'text-primary' : 'text-slate-700')}>từ {s} sao</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
