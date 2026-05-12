"use client";

import React from "react";
import { Box, Filter, Zap, Star, Check, Plus, Minus, LayoutGrid, ChevronRight, ChevronDown } from "lucide-react";
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
          <span className="font-bold text-slate-400 text-[11px] uppercase tracking-widest">{title}</span>
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
  const [expandedCategories, setExpandedCategories] = React.useState<Set<number>>(new Set());

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

  const renderCategory = (cat: Category, level = 0) => {
    const isSelected = String(cat.id) === currentCategory;
    const hasChildren = cat.children && cat.children.length > 0;
    const isExpanded = expandedCategories.has(cat.id);
    
    return (
      <React.Fragment key={cat.id}>
        <div 
          className="flex items-center gap-2 group/item"
          style={{ paddingLeft: `${level * 0.75}rem` }}
        >
          {/* Toggle Button for children */}
          <div className="w-4 flex justify-center">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(cat.id, e)}
                className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="flex h-5 shrink-0 items-center">
            <div className="group grid size-4 grid-cols-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => updateFilters('categoryId', String(cat.id))}
                className="col-start-1 row-start-1 appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
              />
              <Check className={cn(
                "pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center text-white",
                isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"
              )} />
            </div>
          </div>
          <button
            type="button"
            onClick={() => updateFilters('categoryId', String(cat.id))}
            className={cn(
              "text-sm text-left transition-colors flex items-center gap-2 py-1",
              isSelected ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900",
              level > 0 && "text-[13px]"
            )}
          >
            <div className={cn(
              "rounded-md overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 group-hover/item:border-primary/20 transition-colors",
              level === 0 ? "h-6 w-6" : "h-5 w-5"
            )}>
              {cat.image ? (
                <Image
                  src={getImageUrl(cat.image)}
                  alt={cat.name}
                  width={24}
                  height={24}
                  className="object-cover h-full w-full"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-300">
                  <LayoutGrid size={level === 0 ? 10 : 8} />
                </div>
              )}
            </div>
            {cat.name}
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

  return (
    <form className={cn("space-y-2 h-full overflow-auto scrollbar-hide pb-10", isMobile ? "px-2" : "")}>
      {/* Categories Section */}
      <FilterSection title="Danh mục">
        <div className="space-y-3.5">
          <div className="flex items-center gap-3 group/item">
            <div className="flex h-5 shrink-0 items-center">
              <div className="group grid size-4 grid-cols-1">
                <input
                  type="checkbox"
                  checked={!currentCategory}
                  onChange={() => updateFilters('categoryId', null)}
                  className="col-start-1 row-start-1 appearance-none rounded-md border border-slate-300 bg-white checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all cursor-pointer"
                />
                <Check className={cn(
                  "pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center text-white",
                  !currentCategory ? "opacity-100 scale-100" : "opacity-0 scale-50"
                )} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFilters('categoryId', null)}
              className={cn(
                "text-sm text-left transition-colors flex items-center gap-2",
                !currentCategory ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
              )}
            >
              <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                <Box size={12} className={!currentCategory ? "text-primary" : "text-slate-400"} />
              </div>
              Tất cả sản phẩm
            </button>
          </div>

          {categories.map((cat) => renderCategory(cat))}
        </div>
      </FilterSection>

      {/* Brands Section */}
      <FilterSection title="Thương hiệu">
        <div className="space-y-3.5">
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
                  "text-sm text-left transition-colors",
                  String(brand.id) === currentBrand ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {brand.name}
              </button>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Section */}
      <FilterSection title="Khoảng giá">
        <div className="space-y-3.5">
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
                  "text-sm text-left transition-colors",
                  (currentMinPrice === range.min && currentMaxPrice === range.max) ? "text-primary font-bold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {range.label}
              </button>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Ratings Section */}
      <FilterSection title="Đánh giá">
        <div className="space-y-3.5">
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
                <span className="text-sm">Từ {s} sao</span>
              </button>
            </div>
          ))}
        </div>
      </FilterSection>
    </form>
  );
}

