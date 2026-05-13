"use client";

import React from "react";
import { Box, Star, Check, ChevronRight, ChevronDown, Tag, Banknote, Sparkles, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/image";
import Image from "next/image";
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
  icon,
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between px-5 py-4 text-sm transition-colors hover:bg-slate-50/50"
      >
        <span className="font-semibold text-slate-700 text-[13px] uppercase tracking-wide flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200",
            !isOpen && "-rotate-90"
          )} 
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-4 animate-in fade-in slide-in-from-top-1 duration-200">
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

  // Auto-expand parents of current category
  React.useEffect(() => {
    if (currentCategory) {
      const findAndExpandParents = (cats: Category[], targetId: number): boolean => {
        for (const cat of cats) {
          if (cat.id === targetId) return true;
          if (cat.children && findAndExpandParents(cat.children, targetId)) {
            setExpandedCategories(prev => new Set(prev).add(cat.id));
            return true;
          }
        }
        return false;
      };
      findAndExpandParents(categories, Number(currentCategory));
    }
  }, [currentCategory, categories]);

  // Count products in category (simple count)
  const countProducts = (cat: Category): number => {
    let count = cat.products?.length || 0;
    if (cat.children) {
      cat.children.forEach(child => {
        count += countProducts(child);
      });
    }
    return count;
  };

  const handleCustomPriceApply = () => {
    updatePriceFilter(
      customMinPrice || null,
      customMaxPrice || null
    );
  };

  const renderCategory = (cat: Category, level = 0) => {
    const isSelected = String(cat.id) === currentCategory;
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedCategories.has(cat.id);
    
    return (
      <React.Fragment key={cat.id}>
        <div 
          className={cn(
            "flex items-center gap-2.5 group/item rounded-lg transition-all py-1",
            isSelected && "bg-primary/5",
          )}
          style={{ paddingLeft: `${level * 0.75 + 0.25}rem` }}
        >
          {/* Toggle Button for children */}
          <div className="w-4 flex justify-center shrink-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(cat.id, e)}
                className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
              >
                {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </button>
            ) : (
              <div className="w-3 h-3" />
            )}
          </div>

          <button
            type="button"
            onClick={() => updateFilters('categoryId', isSelected ? null : String(cat.id))}
            className={cn(
              "flex-1 text-left transition-colors flex items-center gap-2 py-1 pr-2 rounded-md text-[13px]",
              isSelected ? "text-primary font-semibold" : "text-slate-600 hover:text-slate-900",
            )}
          >
            <div className={cn(
              "rounded-lg overflow-hidden flex-shrink-0 border transition-colors",
              level === 0 ? "h-7 w-7" : "h-6 w-6",
              isSelected ? "border-primary/30 bg-primary/5" : "border-slate-100 bg-slate-50 group-hover/item:border-primary/20"
            )}>
              {cat.image ? (
                <Image
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  width={28}
                  height={28}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-300">
                  <Box size={level === 0 ? 12 : 10} className={isSelected ? "text-primary" : ""} />
                </div>
              )}
            </div>
            <span className="flex-1">{cat.name}</span>
          </button>
        </div>
        
        {/* Render Children if expanded */}
        {hasChildren && isExpanded && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            {cat.children!.map(sub => renderCategory(sub, level + 1))}
          </div>
        )}
      </React.Fragment>
    );
  };

  const priceRanges = [
    { label: "Dưới 500K", min: "0", max: "500000" },
    { label: "500K - 2 triệu", min: "500000", max: "2000000" },
    { label: "2 - 5 triệu", min: "2000000", max: "5000000" },
    { label: "5 - 15 triệu", min: "5000000", max: "15000000" },
    { label: "Trên 15 triệu", min: "15000000", max: "999999999" }
  ];

  return (
    <form className={cn("h-full overflow-auto scrollbar-hide", isMobile ? "px-0" : "")}>
      {/* Categories Section */}
      <FilterSection title="Danh mục" icon={<Tag size={14} />}>
        <div className="space-y-0.5">
          <div 
            className={cn(
              "flex items-center gap-2.5 rounded-lg transition-all py-1 px-1",
              !currentCategory && "bg-primary/5"
            )}
          >
            <button
              type="button"
              onClick={() => updateFilters('categoryId', null)}
              className={cn(
                "flex-1 text-[13px] text-left transition-colors flex items-center gap-2 py-1 rounded-md",
                !currentCategory ? "text-primary font-semibold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className={cn(
                "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                !currentCategory ? "bg-primary/5 border-primary/30" : "bg-slate-50 border-slate-100"
              )}>
                <Box size={12} className={!currentCategory ? "text-primary" : "text-slate-400"} />
              </div>
              Tất cả
            </button>
          </div>

          {categories.map((cat) => renderCategory(cat))}
        </div>
      </FilterSection>

      {/* Brands Section */}
      {brands.length > 0 && (
        <FilterSection title="Thương hiệu" icon={<Sparkles size={14} />}>
          <div className="space-y-1">
            {brands.map((brand) => {
              const isSelected = String(brand.id) === currentBrand;
              return (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => updateFilters('brandId', isSelected ? null : String(brand.id))}
                  className={cn(
                    "flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded-lg transition-all text-[13px]",
                    isSelected
                      ? "text-primary font-semibold bg-primary/5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className={cn(
                    "h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                    isSelected 
                      ? "bg-primary border-primary" 
                      : "border-slate-300 bg-white"
                  )}>
                    {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                  </div>
                  {brand.name}
                </button>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Price Section */}
      <FilterSection title="Khoảng giá" icon={<Banknote size={14} />}>
        <div className="space-y-1.5">
          {priceRanges.map((range) => {
            const isSelected = currentMinPrice === range.min && currentMaxPrice === range.max;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => updatePriceFilter(
                  isSelected ? null : range.min,
                  isSelected ? null : range.max
                )}
                className={cn(
                  "flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded-lg transition-all text-[13px]",
                  isSelected
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "border-slate-300 bg-white"
                )}>
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                {range.label}
              </button>
            );
          })}
          
          {/* Custom price range */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Từ"
                value={customMinPrice}
                onChange={(e) => setCustomMinPrice(e.target.value)}
                className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2.5 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
              <span className="text-slate-300 text-xs shrink-0">—</span>
              <input
                type="number"
                placeholder="Đến"
                value={customMaxPrice}
                onChange={(e) => setCustomMaxPrice(e.target.value)}
                className="w-full h-8 text-xs border border-slate-200 rounded-lg px-2.5 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={handleCustomPriceApply}
              className="w-full h-8 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-lg transition-all"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </FilterSection>

      {/* Ratings Section */}
      <FilterSection title="Đánh giá" icon={<Star size={14} />}>
        <div className="space-y-1">
          {[5, 4, 3].map((s) => {
            const isSelected = currentMinRating === String(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => updateFilters('minRating', isSelected ? null : String(s))}
                className={cn(
                  "flex items-center gap-2.5 w-full text-left py-2 px-2 rounded-lg transition-all",
                  isSelected
                    ? "bg-primary/5"
                    : "hover:bg-slate-50"
                )}
              >
                <div className={cn(
                  "h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0",
                  isSelected 
                    ? "bg-primary border-primary" 
                    : "border-slate-300 bg-white"
                )}>
                  {isSelected && <Check className="h-2.5 w-2.5 text-white" />}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5 transition-colors", i < s ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                  ))}
                </div>
                <span className={cn(
                  "text-[13px] transition-colors",
                  isSelected ? "text-primary font-semibold" : "text-slate-500"
                )}>
                  Từ {s} sao
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Status Section */}
      <FilterSection title="Tình trạng" defaultOpen={false}>
        <div className="space-y-1">
          {[
            { label: "Còn hàng", value: "inStock" },
            { label: "Hàng mới", value: "new" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              className="flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded-lg transition-all text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <div className="h-4 w-4 rounded-md border border-slate-300 bg-white shrink-0" />
              {item.label}
            </button>
          ))}
        </div>
      </FilterSection>
    </form>
  );
});
  
