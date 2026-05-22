"use client";

import { Suspense, useCallback, useState } from "react";
import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Sheet, SheetContent } from "@/components/ui/Sheet";
import { useBrands } from "@/features/products/hooks/queries/useBrands";
import { useCategories } from "@/features/products/hooks/queries/useCategories";
import { useProducts } from "@/features/products/hooks/queries/useProducts";
import { ShopActiveFilters } from "../../components/customer/shop/ShopActiveFilters";
import { ShopBreadcrumbs } from "../../components/customer/shop/ShopBreadcrumbs";
import { ShopFilters } from "../../components/customer/shop/ShopFilters";
import { ShopProductsGrid } from "../../components/customer/shop/ShopProductsGrid";
import { ShopToolbar } from "../../components/customer/shop/ShopToolbar";
import { ShopSkeleton } from "../../components/customer/shop/skeletons/ShopSkeleton";

function ShopViewContent() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data: categoryData = [] } = useCategories({ tree: true });
  const { data: brands = [] } = useBrands();

  const categories = Array.isArray(categoryData)
    ? categoryData
    : (categoryData as any)?.data || [];
  const brandsList = Array.isArray(brands) ? brands : (brands as any)?.data || [];

  const currentCategory = searchParams.get("categoryId");
  const currentBrand = searchParams.get("brandId");
  const currentMinPrice = searchParams.get("minPrice");
  const currentMaxPrice = searchParams.get("maxPrice");
  const currentMinRating = searchParams.get("minRating");
  const currentSort = searchParams.get("sortBy") || "sold";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSearch = searchParams.get("search");

  const { data: productData, isLoading: isProductsLoading } = useProducts({
    page: currentPage,
    limit: 9,
    ...(currentCategory && { categoryId: currentCategory }),
    ...(currentBrand && { brandId: currentBrand }),
    ...(currentMinPrice && { minPrice: currentMinPrice }),
    ...(currentMaxPrice && { maxPrice: currentMaxPrice }),
    ...(currentMinRating && { minRating: currentMinRating }),
    ...(currentSearch && { search: currentSearch }),
    ...(currentSort && { sortBy: currentSort }),
  });

  const updateFilters = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.set("page", "1");
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const updatePriceFilter = useCallback(
    (min: string | null, max: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (min) params.set("minPrice", min);
      else params.delete("minPrice");
      if (max) params.set("maxPrice", max);
      else params.delete("maxPrice");
      params.set("page", "1");
      const queryString = params.toString();
      router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-brand-cream min-h-screen font-sans-brand">
      <ShopBreadcrumbs currentCategory={currentCategory} categories={categories} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-12">
          <aside className="hidden lg:block lg:col-span-1 sticky top-32 h-fit">
            <div className="bg-white rounded-2xl p-6 border border-brand-sand shadow-[0_8px_30px_rgba(61,43,26,0.04)]">
              <ShopFilters
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

          <main className="lg:col-span-3 space-y-8">
            <ShopToolbar
              currentSearch={currentSearch}
              currentSort={currentSort}
              onFilterChange={updateFilters}
              onFilterOpen={() => setIsMobileFilterOpen(true)}
              onViewChange={setView}
              totalProducts={productData?.meta?.total || 0}
              view={view}
            />

            <ShopActiveFilters
              brands={brandsList}
              categories={categories}
              currentBrand={currentBrand}
              currentCategory={currentCategory}
              currentMaxPrice={currentMaxPrice}
              currentMinPrice={currentMinPrice}
              currentMinRating={currentMinRating}
              currentSearch={currentSearch}
              onClearAll={() => router.push(pathname, { scroll: false })}
              onFilterChange={updateFilters}
              onPriceChange={updatePriceFilter}
            />

            <ShopProductsGrid
              initialProducts={productData?.data}
              isLoading={isProductsLoading}
              page={currentPage}
              view={view}
              onPageChange={handlePageChange}
            />
          </main>
        </div>
      </div>

      <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="h-full flex flex-col bg-white">
            <div className="px-6 py-6 border-b border-brand-ivory flex items-center justify-between">
              <h2 className="text-[14px] font-bold uppercase tracking-widest text-primary">
                Bộ lọc
              </h2>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X size={20} className="text-brand-taupe/40" />
              </button>
            </div>
            <div className="flex-1 overflow-auto py-6">
              <ShopFilters
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
              <Button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full h-12 bg-primary text-white rounded-full font-bold text-[12px] uppercase tracking-widest hover:bg-brand-bronze"
              >
                Xem kết quả
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function ShopView() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopViewContent />
    </Suspense>
  );
}
