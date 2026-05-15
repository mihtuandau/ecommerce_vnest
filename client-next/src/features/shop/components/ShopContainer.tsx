"use client";

import React, { useState, useCallback } from "react";
import { ProductList } from "@/features/products/components/customer/ProductList";
import { LayoutGrid, Filter, List, ChevronDown, Search, X } from "lucide-react";
import { useCategories, useBrands, useProducts } from "@/features/products/hooks";
import { Category, Brand } from "@/types/models";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent } from "@/components/ui/Sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";
import { cn } from "@/utils/cn";
import { FilterContent } from "./FilterContent";

const SORT_OPTIONS = [
  { label: "Phổ biến nhất", value: "sold" },
  { label: "Mới nhất", value: "newest" },
  { label: "Giá: Thấp → Cao", value: "price-asc" },
  { label: "Giá: Cao → Thấp", value: "price-desc" },
  { label: "Đánh giá cao", value: "rating" },
];

export function ShopContainer() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { data: categoryData = [] } = useCategories({ tree: true });
  const { data: brands = [] } = useBrands();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const categories = Array.isArray(categoryData) ? categoryData : (categoryData as any)?.data || [];
  const brandsList = Array.isArray(brands) ? brands : (brands as any)?.data || [];

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentMinRating = searchParams.get("minRating");
  const currentSort = searchParams.get("sortBy") || "sold";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search");

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

  const { data: productData, isLoading: isProductsLoading } = useProducts(queryParams);
  const totalProducts = productData?.meta?.total || 0;

  const updateFilters = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.set("page", "1");
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const updatePriceFilter = useCallback((min: string | null, max: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min); else params.delete("minPrice");
    if (max) params.set("maxPrice", max); else params.delete("maxPrice");
    params.set("page", "1");
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [router, searchParams, pathname]);

  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || "Sắp xếp";

  return (
    <div className="bg-brand-cream min-h-screen font-sans-brand">
      {/* ── BREADCRUMBS ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-5 flex items-center gap-1.5 text-[12.5px] text-brand-taupe">
          <Link href="/" className="hover:text-brand-espresso transition-colors">Trang chủ</Link>
          <span className="opacity-50 text-[10px]">›</span>
          <Link href="/shop" className={cn("hover:text-brand-espresso transition-colors", !currentCategory && "text-brand-espresso font-semibold")}>Cửa hàng</Link>
          {currentCategory && (
            <>
              <span className="opacity-50 text-[10px]">›</span>
              <span className="text-brand-espresso font-semibold">
                {categories.find((c: any) => String(c.id) === currentCategory)?.name || "Danh mục"}
              </span>
            </>
          )}
        </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12">
          
          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-brand-sand shadow-[0_8px_30px_rgba(61,43,26,0.04)]">
              <FilterContent
                currentCategory={currentCategory}
                currentBrand={currentBrand}
                currentMinPrice={currentMinPrice}
                currentMaxPrice={currentMaxPrice}
                currentMinRating={currentMinRating}
                categories={categories}
                brands={brandsList}
                updateFilters={updateFilters}
                updatePriceFilter={updatePriceFilter}
              />
            </div>
          </aside>

          {/* ── MAIN ── */}
          <main className="lg:col-span-3 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-ivory pb-6">
              <div className="flex items-center gap-6">
                <button onClick={() => setIsMobileFilterOpen(true)} className="flex lg:hidden items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-primary"><Filter size={14} /> Bộ lọc</button>
                <div className="text-[13px] text-brand-taupe font-medium">Hiển thị <span className="text-primary font-bold">{totalProducts}</span> sản phẩm</div>
              </div>

              <div className="flex items-center gap-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const val = new FormData(e.currentTarget).get("search") as string;
                  updateFilters("search", val || null);
                }} className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-brand-taupe/40" />
                  <input name="search" type="text" defaultValue={currentSearch || ""} placeholder="Tìm kiếm..." className="h-10 pl-9 pr-4 w-48 bg-white border border-brand-sand rounded-full text-[12px] focus:outline-none focus:border-brand-bronze shadow-sm" />
                </form>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-4 h-10 border border-brand-sand rounded-full text-[12px] font-bold text-primary bg-white hover:border-brand-bronze transition-all">
                      <span>{activeSortLabel}</span>
                      <ChevronDown size={14} className="text-brand-taupe/40" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl">
                    {SORT_OPTIONS.map((opt) => (
                      <DropdownMenuItem key={opt.value} className={cn("rounded-xl h-10 text-[13px] font-medium cursor-pointer mb-1", currentSort === opt.value ? "bg-primary text-white" : "text-brand-taupe hover:bg-brand-cream")} onClick={() => updateFilters('sortBy', opt.value)}>{opt.label}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center border border-brand-sand rounded-full p-1">
                  <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-full", view === "grid" ? "bg-primary text-white shadow-md" : "text-brand-taupe/40")}><LayoutGrid size={16} /></button>
                  <button onClick={() => setView("list")} className={cn("p-1.5 rounded-full", view === "list" ? "bg-primary text-white shadow-md" : "text-brand-taupe/40")}><List size={16} /></button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips */}
            {(currentCategory || currentBrand || currentMinPrice || currentMaxPrice || currentMinRating || currentSearch) && (
              <div className="flex flex-wrap items-center gap-2 pt-2 animate-in fade-in slide-in-from-top-1 duration-500">
                <span className="text-[10px] font-bold text-brand-taupe uppercase tracking-widest mr-2">Đang lọc:</span>
                
                {currentCategory && (
                  <button onClick={() => updateFilters('categoryId', null)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-sand rounded-full text-[11px] font-medium text-primary hover:border-brand-bronze transition-all group">
                    Danh mục: {categories.find((c: any) => String(c.id) === currentCategory)?.name || "Đang tải..."}
                    <X size={12} className="text-brand-taupe/40 group-hover:text-rose-500" />
                  </button>
                )}

                {currentBrand && (
                  <button onClick={() => updateFilters('brandId', null)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-sand rounded-full text-[11px] font-medium text-primary hover:border-brand-bronze transition-all group">
                    Hiệu: {brandsList.find((b: any) => String(b.id) === currentBrand)?.name || "Đang tải..."}
                    <X size={12} className="text-brand-taupe/40 group-hover:text-rose-500" />
                  </button>
                )}

                {(currentMinPrice || currentMaxPrice) && (
                  <button onClick={() => updatePriceFilter(null, null)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-sand rounded-full text-[11px] font-medium text-primary hover:border-brand-bronze transition-all group">
                    Giá: {currentMinPrice ? `${(Number(currentMinPrice)/1000).toLocaleString()}k` : "0"} — {currentMaxPrice ? `${(Number(currentMaxPrice)/1000).toLocaleString()}k` : "∞"}
                    <X size={12} className="text-brand-taupe/40 group-hover:text-rose-500" />
                  </button>
                )}

                {currentMinRating && (
                  <button onClick={() => updateFilters('minRating', null)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-brand-sand rounded-full text-[11px] font-medium text-primary hover:border-brand-bronze transition-all group">
                    Đánh giá: {currentMinRating}+ ⭐
                    <X size={12} className="text-brand-taupe/40 group-hover:text-rose-500" />
                  </button>
                )}

                {currentSearch && (
                  <button onClick={() => updateFilters('search', null)} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-full text-[11px] font-medium shadow-md shadow-primary/10 group">
                    Tìm: "{currentSearch}"
                    <X size={12} className="text-white/60 group-hover:text-white" />
                  </button>
                )}

                <button
                  onClick={() => router.push(pathname, { scroll: false })}
                  className="text-[11px] font-bold text-brand-bronze hover:underline px-2 transition-all"
                >
                  Xóa tất cả
                </button>
              </div>
            )}

            <ProductList
              initialProducts={productData?.data}
              isLoading={isProductsLoading}
              page={currentPage}
              view={view}
              onPageChange={(p) => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", p.toString());
                router.push(`/shop?${params.toString()}`, { scroll: false });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </main>
        </div>
      </div>

      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="h-full flex flex-col bg-white">
            <div className="px-6 py-6 border-b border-brand-ivory flex items-center justify-between">
               <h2 className="text-[14px] font-bold uppercase tracking-widest text-primary">Bộ lọc</h2>
               <button onClick={() => setIsMobileFilterOpen(false)}><X size={20} className="text-brand-taupe/40" /></button>
            </div>
            <div className="flex-1 overflow-auto py-6">
              <FilterContent
                currentCategory={currentCategory}
                currentBrand={currentBrand}
                currentMinPrice={currentMinPrice}
                currentMaxPrice={currentMaxPrice}
                currentMinRating={currentMinRating}
                categories={categories}
                brands={brandsList}
                updateFilters={updateFilters}
                updatePriceFilter={updatePriceFilter}
                isMobile
              />
            </div>
            <div className="p-6 border-t border-brand-ivory">
              <button onClick={() => setIsMobileFilterOpen(false)} className="w-full h-12 bg-primary text-white rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-brand-bronze">Xem kết quả</button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
