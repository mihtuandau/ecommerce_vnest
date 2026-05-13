"use client";

import React, { useState, useCallback } from "react";
import { ProductList } from "@/features/products/components/customer/ProductList";
import { Button } from "@/components/ui/Button";
import {
  LayoutGrid,
  ArrowUpDown,
  ArrowDownAz,
  ArrowUpAz,
  TrendingUp,
  Sparkles,
  Star,
  Filter,
  List,
  ChevronDown,
  Check,
  Search,
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
import { useProducts } from "@/features/products/hooks";

// Import extracted components
import { ShopBreadcrumbs } from "./ShopBreadcrumbs";
import { FilterContent } from "./FilterContent";
  
const SORT_OPTIONS = [
  { label: "Phổ biến nhất", value: "sold", icon: TrendingUp },
  { label: "Mới nhất", value: "newest", icon: Sparkles },
  { label: "Giá: Thấp → Cao", value: "price-asc", icon: ArrowUpDown },
  { label: "Giá: Cao → Thấp", value: "price-desc", icon: ArrowUpDown },
  { label: "Tên: A → Z", value: "name-asc", icon: ArrowDownAz },
  { label: "Tên: Z → A", value: "name-desc", icon: ArrowUpAz },
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
  const currentSort = searchParams.get("sortBy") || "sold";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search");

  // Get product count for display
  const queryParams = {
    page: currentPage,
    limit: 9,
    ...(currentCategory && { categoryId: currentCategory }),
    ...(currentBrand && { brandId: currentBrand }),
    ...(currentMinPrice && { minPrice: currentMinPrice }),
    ...(currentMaxPrice && { maxPrice: currentMaxPrice }),
    ...(currentMinRating && { minRating: currentMinRating }),
    ...(currentSearch && { search: currentSearch }),
    ...(currentSort && { sortBy: currentSort }),
  };
  const { data: productData } = useProducts(queryParams);
  const totalProducts = productData?.meta?.total || 0;
  const currentProducts = productData?.data?.length || 0;

  // Count active filters
  const activeFilterCount = [currentCategory, currentBrand, currentMinPrice, currentMinRating].filter(Boolean).length;

  // Get current category name
  const findCategoryName = (cats: Category[], id: string): string | null => {
    for (const cat of cats) {
      if (String(cat.id) === id) return cat.name;
      if (cat.children) {
        const name = findCategoryName(cat.children, id);
        if (name) return name;
      }
    }
    return null;
  };
  const currentCategoryName = currentCategory ? findCategoryName(categories, currentCategory) : null;
  const currentBrandName = currentBrand ? brandsList.find(b => String(b.id) === currentBrand)?.name : null;

  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  }, [router, searchParams]);

  const updatePriceFilter = useCallback((min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min);
    else params.delete("minPrice");
    if (max) params.set("maxPrice", max);
    else params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  }, [router, searchParams]);

  const updatePage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [router, searchParams]);

  const clearAllFilters = useCallback(() => {
    router.push("/shop");
  }, [router]);

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
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Phổ biến nhất";

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      <ShopBreadcrumbs currentCategory={currentCategory} categories={categories} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8">
        <section aria-labelledby="products-heading" className="pb-24">
          <h2 id="products-heading" className="sr-only">Sản phẩm</h2>

          {/* ── ROW 1: Search + Sort + View Toggle (full-width) ── */}
          <div className="flex items-center justify-between gap-3 mb-6">
            {/* Search */}
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const searchVal = (formData.get("search") as string)?.trim();
              const params = new URLSearchParams(searchParams.toString());
              if (searchVal) params.set("search", searchVal);
              else params.delete("search");
              params.set("page", "1");
              router.push(`/shop?${params.toString()}`);
            }} className="relative w-full max-w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={currentSearch || ""}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full h-9 pl-9 pr-4 text-sm border border-slate-200 rounded-xl bg-slate-50/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
              />
            </form>

            <div className="flex items-center gap-2.5">
              {/* Mobile filter button */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-semibold gap-2 relative">
                      <Filter className="h-3.5 w-3.5" />
                      Bộ lọc
                      {activeFilterCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full max-w-xs p-0 border-none flex flex-col">
                    <SheetHeader className="px-5 py-4 border-b shrink-0 space-y-0">
                      <SheetTitle className="text-base font-semibold text-slate-800">Bộ lọc sản phẩm</SheetTitle>
                    </SheetHeader>
                    <div className="py-2 overflow-y-auto flex-1">
                      <FilterContent {...filterProps} isMobile={true} />
                    </div>
                    {activeFilterCount > 0 && (
                      <div className="p-4 border-t">
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="w-full py-2.5 text-xs font-semibold text-white bg-primary rounded-xl transition-all hover:brightness-110"
                        >
                          Xóa tất cả bộ lọc
                        </button>
                      </div>
                    )}
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-semibold gap-1.5 pr-2.5 hover:border-primary/20 hover:bg-primary/5 transition-all shrink-0">
                    {activeSortLabel}
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-100 shadow-xl p-1.5">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => updateFilters("sortBy", option.value)}
                      className={cn(
                        "rounded-lg text-xs font-medium py-2.5 px-3 transition-colors cursor-pointer flex items-center justify-between",
                        currentSort === option.value ? "bg-primary/5 text-primary font-semibold" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <option.icon className="h-3.5 w-3.5" />
                        {option.label}
                      </div>
                      {currentSort === option.value && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View toggle */}
              <div className="flex items-center gap-0.5 bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setView("grid")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "grid" ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Hiển thị dạng lưới"
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "list" ? "bg-white shadow-sm text-primary" : "text-slate-400 hover:text-slate-600"
                  )}
                  title="Hiển thị dạng danh sách"
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* ── ROW 2: Sidebar + Content Grid ── */}
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-4">
            {/* ── SIDEBAR ── */}
            <aside className="hidden lg:block lg:col-span-1 shrink-0">
              <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <FilterContent {...filterProps} />
                
                {/* Clear all filters */}
                {activeFilterCount > 0 && (
                  <div className="px-5 pb-5">
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-primary border border-slate-200 hover:border-primary/20 rounded-xl transition-all hover:bg-primary/5"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <div className="lg:col-span-3 space-y-4">
              {/* Sub-toolbar: Product count + Filter tags */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                  Hiển thị{" "}
                  <span className="font-bold text-slate-800">{currentProducts}</span>
                  {" / "}
                  <span className="font-bold text-slate-800">{totalProducts}</span>
                  {" "}sản phẩm
                </p>

                {/* Active filter tags */}
                {(activeFilterCount > 0 || currentSearch) && (
                  <div className="flex items-center flex-wrap gap-2">
                    {currentCategoryName && (
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                        {currentCategoryName}
                        <button
                          onClick={() => updateFilters("categoryId", null)}
                          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {currentBrandName && (
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                        Thương hiệu: {currentBrandName}
                        <button
                          onClick={() => updateFilters("brandId", null)}
                          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {(currentMinPrice || currentMaxPrice) && (
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                        Giá: {currentMinPrice ? `${Number(currentMinPrice).toLocaleString("vi-VN")}đ` : "0đ"} - {currentMaxPrice ? `${Number(currentMaxPrice).toLocaleString("vi-VN")}đ` : "Max"}
                        <button
                          onClick={() => updatePriceFilter(null, null)}
                          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {currentMinRating && (
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                        Từ {currentMinRating} sao
                        <button
                          onClick={() => updateFilters("minRating", null)}
                          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {currentSearch && (
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg shadow-sm">
                        &quot;{currentSearch}&quot;
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.delete("search");
                            params.set("page", "1");
                            router.push(`/shop?${params.toString()}`);
                          }}
                          className="ml-0.5 text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {(activeFilterCount > 1 || (activeFilterCount > 0 && currentSearch)) && (
                      <button
                        onClick={clearAllFilters}
                        className="text-xs font-medium text-primary hover:text-primary/70 transition-colors px-1"
                      >
                        Xóa tất cả
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Product Grid */}
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
