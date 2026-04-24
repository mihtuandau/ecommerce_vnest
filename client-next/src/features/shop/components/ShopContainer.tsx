"use client";

import React, { useState } from "react";
import { ProductList } from "@/features/products/components/customer/ProductList";
import { Button } from "@/components/ui/Button";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  Check,
  ArrowUpDown,
  ArrowDownAz,
  ArrowUpAz,
  TrendingUp,
  Sparkles,
  Star,
} from "lucide-react";
import { useCategories, useBrands } from "@/features/products/hooks";
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
  const { data: categoryData } = useCategories();
  const { data: brandData } = useBrands();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentMinRating = searchParams.get("minRating");
  const currentSort = searchParams.get("sortBy") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const categories = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.data || [];
  const brands = Array.isArray(brandData) ? brandData : brandData?.data || [];

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/shop?${params.toString()}`);
  };

  const updatePriceFilter = (min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    router.push(`/shop?${params.toString()}`);
  };

  const updatePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filterProps = {
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
    categories,
    brands,
    updateFilters,
    updatePriceFilter,
  };

  const activeSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Mới nhất";

  return (
    <div className="bg-slate-50/30 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── BREADCRUMBS ── */}
        <ShopBreadcrumbs currentCategory={currentCategory} categories={categories} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start pb-20">
          {/* ── DESKTOP SIDEBAR ── */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white rounded-[2rem] border border-slate-200/50 overflow-hidden p-6 shadow-sm">
              <FilterContent {...filterProps} />
            </div>
          </aside>

          {/* ── PRODUCT MAIN AREA ── */}
          <main className="lg:col-span-9 space-y-4 md:space-y-6">
            {/* Secondary Toolbar (Sorting & View) */}
            <div className="flex items-center justify-between bg-white px-4 md:px-6 py-3 md:py-4 rounded-2xl md:rounded-[2rem] border border-slate-200/50 shadow-sm">
              <div className="flex items-center gap-2 md:gap-4">
                {/* MOBILE FILTER TRIGGER */}
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl h-10 px-5 border-slate-200 text-slate-900 font-bold gap-2 bg-slate-50 shadow-sm"
                      >
                        <SlidersHorizontal className="h-4 w-4 text-primary" />
                        Bộ lọc
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="h-[85vh] rounded-t-[2.5rem] p-0 border-none shadow-2xl flex flex-col focus:outline-none"
                    >
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto my-3 shrink-0" />
                      <SheetHeader className="px-6 pb-4 border-b shrink-0">
                        <div className="flex items-center justify-between">
                          <SheetTitle className="text-left font-black uppercase tracking-widest text-slate-900">
                            Tùy chọn lọc
                          </SheetTitle>
                          <button
                            onClick={() => router.push("/shop")}
                            className="text-xs font-bold text-primary"
                          >
                            Xóa tất cả
                          </button>
                        </div>
                      </SheetHeader>
                      <div className="p-6 overflow-y-auto flex-1 pb-32">
                        <FilterContent {...filterProps} isMobile={true} />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 flex gap-4 z-10">
                        <SheetTrigger asChild>
                          <Button className="flex-1 rounded-2xl font-black h-12 uppercase tracking-widest shadow-xl shadow-primary/20">
                            Xem kết quả
                          </Button>
                        </SheetTrigger>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="hidden sm:flex items-center bg-slate-50 p-1 rounded-xl">
                  <button
                    onClick={() => setView("grid")}
                    className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-primary" : "text-slate-500"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <span className="hidden xs:inline text-[12px] font-medium text-slate-500">
                    Sắp xếp:
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="text-[12px] font-bold text-slate-900 flex items-center gap-1.5 bg-slate-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-xl border border-slate-100 sm:border-none shadow-sm sm:shadow-none hover:text-primary transition-colors">
                        {activeSortLabel}
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 rounded-2xl p-2 shadow-2xl border-slate-100"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                          key={opt.value}
                          onClick={() => updateFilters("sortBy", opt.value)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-[13px] font-medium transition-all ${currentSort === opt.value ? "bg-primary/5 text-primary font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <opt.icon
                              className={cn(
                                "h-4 w-4",
                                currentSort === opt.value
                                  ? "text-primary"
                                  : "text-slate-400"
                              )}
                            />
                            {opt.label}
                          </div>
                          {currentSort === opt.value && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Grid */}
            <ProductList 
              view={view} 
              page={currentPage} 
              onPageChange={updatePage} 
            />
          </main>
        </div>
      </div>
    </div>
  );
}
