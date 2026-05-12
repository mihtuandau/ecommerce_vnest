"use client";

import React, { useState } from "react";
import { ProductList } from "@/features/products/components/customer/ProductList";
import { Button } from "@/components/ui/Button";
import {
  LayoutGrid,
  ChevronDown,
  Check,
  ArrowUpDown,
  ArrowDownAz,
  ArrowUpAz,
  TrendingUp,
  Sparkles,
  Star,
  Filter,
  Menu,
} from "lucide-react";
import { useCategories, useBrands } from "@/features/products/hooks";
import { Category, Brand } from "@/types/models";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";

// Import extracted components
import { ShopBreadcrumbs } from "./ShopBreadcrumbs";
import { FilterContent } from "./FilterContent";

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest", icon: Sparkles },
  { label: "Bán chạy nhất", value: "sold", icon: TrendingUp },
  { label: "Giá: Thấp đến Cao", value: "price-asc", icon: ArrowUpDown },
  { label: "Giá: Cao đến Thấp", value: "price-desc", icon: ArrowUpDown },
  { label: "Tên: A - Z", value: "name-asc", icon: ArrowDownAz },
  { label: "Tên: Z - A", value: "name-desc", icon: ArrowUpAz },
  { label: "Đánh giá cao", value: "rating", icon: Star },
];

export function ShopContainer() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const { data: categoryData = [] } = useCategories({ tree: true });
  const { data: brands = [] } = useBrands();

  // Categories extraction helper
  const categories: Category[] = React.useMemo(() => {
    return Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
  }, [categoryData]);

  const brandsList: Brand[] = React.useMemo(() => {
    return Array.isArray(brands) ? brands : (brands as any)?.data || [];
  }, [brands]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentMinRating = searchParams.get("minRating");
  const currentSort = searchParams.get("sortBy") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const updatePriceFilter = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterProps = {
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
    categories,
    brands: brandsList,
    updateFilters,
    updatePriceFilter,
  };

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Mới nhất";

  return (
    <div className="bg-white min-h-screen pb-20">
      <ShopBreadcrumbs currentCategory={currentCategory} categories={categories} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-10">
        <section aria-labelledby="products-heading" className="pb-24">
          <h2 id="products-heading" className="sr-only">Sản phẩm</h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <aside className="hidden lg:block w-64 shrink-0">
              <FilterContent {...filterProps} />
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-2">
                   <h3 className="text-sm font-bold text-slate-900">Danh sách sản phẩm</h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="lg:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-bold gap-2">
                          <Filter className="h-3.5 w-3.5" />
                          Bộ lọc
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-full max-w-xs p-0 border-none flex flex-col">
                        <SheetHeader className="px-4 py-4 border-b shrink-0 space-y-0">
                          <SheetTitle className="text-lg font-medium text-gray-900">Bộ lọc</SheetTitle>
                        </SheetHeader>
                        <div className="px-4 py-6 overflow-y-auto flex-1">
                          <FilterContent {...filterProps} isMobile={true} />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-bold gap-2">
                        <Filter className="h-3.5 w-3.5" />
                        Sắp xếp: {activeSortLabel}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl p-1">
                      {SORT_OPTIONS.map((option) => (
                        <DropdownMenuItem
                          key={option.value}
                          onClick={() => updateFilters("sortBy", option.value)}
                          className={cn(
                            "rounded-lg text-xs font-bold py-2.5 transition-colors cursor-pointer",
                            currentSort === option.value ? "bg-primary/5 text-primary" : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {option.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setView("grid")}
                      className={cn("p-1.5 rounded-lg transition-all", view === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600")}
                    >
                      <LayoutGrid size={16} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={cn("p-1.5 rounded-lg transition-all", view === "list" ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600")}
                    >
                      <Menu size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <ProductList 
                view={view} 
                page={currentPage} 
                onPageChange={updatePage} 
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
