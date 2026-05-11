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
  Search,
  X,
  Box,
  Filter,
} from "lucide-react";
import Link from "next/link";
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
  const { data: categoryData } = useCategories();
  const { data: brandData } = useBrands();
  const searchParams = useSearchParams();
  const router = useRouter();

  console.log('[DEBUG] ShopContainer searchParams:', searchParams.toString());

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentMinRating = searchParams.get("minRating");
  const currentSort = searchParams.get("sortBy") || "newest";
  const currentPage = parseInt(searchParams.get("page") || "1");

  const categories = (Array.isArray(categoryData)
    ? categoryData
    : (categoryData as any)?.data || (categoryData as any)?.categories || []) as Category[];
  const brands = (Array.isArray(brandData) 
    ? brandData 
    : (brandData as any)?.data || (brandData as any)?.brands || []) as Brand[];

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
    <div className="bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── BREADCRUMBS ── */}
        <ShopBreadcrumbs currentCategory={currentCategory} categories={categories} />

        {/* ── HEADER SECTION ── */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex-1">
            {searchParams.get("search") && (
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                Kết quả cho "{searchParams.get("search")}"
              </h1>
            )}
          </div>

          <div className="flex items-center">
            {/* SORT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sắp xếp: {activeSortLabel}
                  <ChevronDown className="-mr-1 ml-1 h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none"
              >
                <div className="py-1">
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.value}
                      onClick={() => updateFilters("sortBy", opt.value)}
                      className={cn(
                        "block px-4 py-2 text-sm cursor-pointer",
                        currentSort === opt.value 
                          ? "font-medium text-gray-900 bg-gray-100" 
                          : "text-gray-500 hover:bg-gray-50"
                      )}
                    >
                      {opt.label}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* VIEW TOGGLES */}
            <button
              type="button"
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
            >
              <span className="sr-only">Đổi chế độ xem</span>
              {view === "grid" ? (
                <List className="h-5 w-5" />
              ) : (
                <LayoutGrid className="h-5 w-5" />
              )}
            </button>

            {/* MOBILE FILTER TRIGGER */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button 
                    type="button"
                    className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6"
                  >
                    <span className="sr-only">Bộ lọc</span>
                    <Filter className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full max-w-xs p-0 border-none flex flex-col"
                >
                  <SheetHeader className="px-4 py-4 border-b shrink-0 space-y-0">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-lg font-medium text-gray-900">
                        Bộ lọc
                      </SheetTitle>
                      <button
                        type="button"
                        onClick={() => router.push("/shop")}
                        className="text-sm text-primary hover:underline"
                      >
                        Xóa tất cả
                      </button>
                    </div>
                  </SheetHeader>
                  <div className="px-4 py-6 overflow-y-auto flex-1">
                    <FilterContent {...filterProps} isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <section aria-labelledby="products-heading" className="pt-6 pb-24">
          <h2 id="products-heading" className="sr-only">
            Sản phẩm
          </h2>

          <div className="flex flex-col lg:flex-row gap-x-12 gap-y-10">
            {/* ── DESKTOP SIDEBAR ── */}
            <aside className="hidden lg:block w-64 shrink-0">
              <FilterContent {...filterProps} />
            </aside>

            {/* ── PRODUCT GRID ── */}
            <div className="flex-1 min-w-0">
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


