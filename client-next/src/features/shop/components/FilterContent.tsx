"use client";

import React from "react";
import { Star, Check, ChevronRight, ChevronDown } from "lucide-react";
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
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-[#F3EFE8] last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-3.5 text-sm transition-all"
      >
        <span className="font-bold text-[#3D2B1A] text-[10.5px] uppercase tracking-[0.15em] flex items-center gap-2">
          {title}
        </span>
        <ChevronDown 
          className={cn(
            "h-3.5 w-3.5 text-[#C4B49A] transition-transform duration-300",
            !isOpen && "-rotate-90"
          )} 
        />
      </button>
      {isOpen && (
        <div className="pb-6 animate-in fade-in slide-in-from-top-1 duration-300">
          {children}
        </div>
      )}
    </div>
  );
}

export const FilterContent = React.memo(function FilterContent({
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
  const [expandedCategories, setExpandedCategories] = React.useState<Set<number>>(new Set());
  const [customMinPrice, setCustomMinPrice] = React.useState(currentMinPrice || "");
  const [customMaxPrice, setCustomMaxPrice] = React.useState(currentMaxPrice || "");

  const toggleExpand = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCustomPriceApply = () => {
    updatePriceFilter(customMinPrice || null, customMaxPrice || null);
  };

  const renderCategory = (cat: Category, level = 0) => {
    const isSelected = String(cat.id) === currentCategory;
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedCategories.has(cat.id);
    
    return (
      <React.Fragment key={cat.id}>
        <div className="flex items-center gap-1 group/item py-1.5" style={{ marginLeft: `${level * 0.75}rem` }}>
          {hasChildren && (
            <button type="button" onClick={(e) => toggleExpand(cat.id, e)} className="text-[#C4B49A] hover:text-[#3D2B1A] transition-colors">
              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}
          <button type="button" onClick={() => updateFilters('categoryId', isSelected ? null : String(cat.id))} className={cn("flex-1 text-left transition-colors text-[13px] font-medium", isSelected ? "text-[#C4783A]" : "text-[#8A7966] hover:text-[#3D2B1A]", !hasChildren && "ml-4")}>
            {cat.name}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <div className="mt-0.5 animate-in fade-in slide-in-from-top-1 duration-300">
            {cat.children!.map(sub => renderCategory(sub, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const priceRanges = [
    { label: "Dưới 500K", min: "0", max: "500000" },
    { label: "500K — 2 triệu", min: "500000", max: "2000000" },
    { label: "2 — 5 triệu", min: "2000000", max: "5000000" },
    { label: "Trên 5 triệu", min: "5000000", max: "999999999" }
  ];

  return (
    <form className={cn("h-full overflow-auto scrollbar-hide", isMobile ? "px-6" : "")}>
      <FilterSection title="Danh mục">
        <div className="space-y-0.5">
          <button type="button" onClick={() => updateFilters('categoryId', null)} className={cn("w-full text-left py-1.5 text-[13px] font-medium transition-colors ml-4", !currentCategory ? "text-[#C4783A]" : "text-[#8A7966] hover:text-[#3D2B1A]")}>Tất cả sản phẩm</button>
          {categories.map((cat) => renderCategory(cat))}
        </div>
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Thương hiệu">
          <div className="space-y-2 ml-1">
            {brands.map((brand) => {
              const isSelected = String(brand.id) === currentBrand;
              return (
                <button key={brand.id} type="button" onClick={() => updateFilters('brandId', isSelected ? null : String(brand.id))} className={cn("flex items-center gap-3 w-full text-left py-1 group", isSelected ? "text-[#3D2B1A]" : "text-[#8A7966] hover:text-[#3D2B1A]")}>
                  <div className={cn("h-3.5 w-3.5 rounded border flex items-center justify-center transition-all shrink-0", isSelected ? "bg-[#3D2B1A] border-[#3D2B1A]" : "border-[#DDD6C8] bg-white group-hover:border-[#C4783A]")}>{isSelected && <Check className="h-2 w-2 text-white" strokeWidth={4} />}</div>
                  <span className="text-[13px] font-medium">{brand.name}</span>
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Khoảng giá">
        <div className="space-y-2 ml-1">
          {priceRanges.map((range) => {
            const isSelected = currentMinPrice === range.min && currentMaxPrice === range.max;
            return (
              <button key={range.label} type="button" onClick={() => updatePriceFilter(isSelected ? null : range.min, isSelected ? null : range.max)} className={cn("flex items-center gap-3 w-full text-left py-1 group", isSelected ? "text-[#3D2B1A]" : "text-[#8A7966] hover:text-[#3D2B1A]")}>
                <div className={cn("h-3.5 w-3.5 rounded border flex items-center justify-center transition-all shrink-0", isSelected ? "bg-[#3D2B1A] border-[#3D2B1A]" : "border-[#DDD6C8] bg-white group-hover:border-[#C4783A]")}>{isSelected && <Check className="h-2 w-2 text-white" strokeWidth={4} />}</div>
                <span className="text-[13px] font-medium">{range.label}</span>
              </button>
            );
          })}
          <div className="pt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input type="number" placeholder="Từ" value={customMinPrice} onChange={(e) => setCustomMinPrice(e.target.value)} className="w-full h-9 text-[12px] border border-[#DDD6C8] rounded-lg px-3 bg-white text-[#3D2B1A] placeholder-[#C4B49A] focus:outline-none focus:border-[#C4783A] transition-all" />
              <span className="text-[#DDD6C8]">—</span>
              <input type="number" placeholder="Đến" value={customMaxPrice} onChange={(e) => setCustomMaxPrice(e.target.value)} className="w-full h-9 text-[12px] border border-[#DDD6C8] rounded-lg px-3 bg-white text-[#3D2B1A] placeholder-[#C4B49A] focus:outline-none focus:border-[#C4783A] transition-all" />
            </div>
            <button type="button" onClick={handleCustomPriceApply} className="w-full h-9 text-[11px] uppercase tracking-widest font-bold text-[#3D2B1A] border border-[#3D2B1A] rounded-lg hover:bg-[#3D2B1A] hover:text-white transition-all active:scale-95">Áp dụng</button>
          </div>
        </div>
      </FilterSection>

      <FilterSection title="Đánh giá">
        <div className="space-y-3 ml-1">
          {[5, 4, 3].map((s) => {
            const isSelected = currentMinRating === String(s);
            return (
              <button key={s} type="button" onClick={() => updateFilters('minRating', isSelected ? null : String(s))} className={cn("flex items-center gap-3 w-full text-left group", isSelected ? "text-[#3D2B1A]" : "text-[#8A7966] hover:text-[#3D2B1A]")}>
                <div className={cn("h-3.5 w-3.5 rounded border flex items-center justify-center transition-all shrink-0", isSelected ? "bg-[#3D2B1A] border-[#3D2B1A]" : "border-[#DDD6C8] bg-white group-hover:border-[#C4783A]")}>{isSelected && <Check className="h-2 w-2 text-white" strokeWidth={4} />}</div>
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} className={cn("h-3 w-3", i < s ? "fill-[#C4783A] text-[#C4783A]" : "text-[#DDD6C8]")} />))}</div>
                <span className="text-[12px] font-medium ml-1">Trở lên</span>
              </button>
            );
          })}
        </div>
      </FilterSection>
    </form>
  );
});
