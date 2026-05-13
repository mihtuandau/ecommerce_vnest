"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "./cards/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";
import { useSearchParams } from "next/navigation";
import { PackageSearch, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

interface ProductListProps {
  initialProducts?: Product[];
  view?: "grid" | "list";
  page?: number;
  onPageChange?: (page: number) => void;
}

import React from "react";

export const ProductList = React.memo(function ProductList({
  initialProducts,
  view = "grid",
  page = 1,
  onPageChange,
}: ProductListProps) {
  const searchParams = useSearchParams();

  // Extract filters from URL safely
  const categoryId = searchParams?.get("categoryId");
  const brandId = searchParams?.get("brandId");
  const minPrice = searchParams?.get("minPrice");
  const maxPrice = searchParams?.get("maxPrice");
  const minRating = searchParams?.get("minRating");
  const search = searchParams?.get("search");
  const sortBy = searchParams?.get("sortBy") || "newest";

  const queryParams = {
    page,
    limit: 9,
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(minRating && { minRating }),
    ...(search && { search }),
    ...(sortBy && { sortBy }),
  };

  const { data, isLoading, error, refetch } = useProducts(queryParams, {
    enabled: !initialProducts,
  });

  const products = (initialProducts !== undefined) ? initialProducts : (data?.data || []);
  const totalPages = data?.meta?.totalPages || 0;

  if (isLoading && !initialProducts) {
    return (
      <div
        className={cn(
          "grid gap-4",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-2xl border border-slate-100 overflow-hidden",
              view === "list" ? "flex gap-5 p-3" : ""
            )}
          >
            <Skeleton
              className={cn(
                "w-full",
                view === "grid" ? "aspect-square" : "h-[140px] w-36 rounded-xl shrink-0"
              )}
            />
            <div className={cn("space-y-3 flex-1", view === "grid" ? "p-3.5" : "py-2")}>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !initialProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        <div className="h-20 w-20 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-400">
          <RefreshCcw className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800">Không thể tải sản phẩm</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            Vui lòng kiểm tra kết nối mạng và thử lại sau ít phút.
          </p>
        </div>
        <Button onClick={() => refetch()} className="rounded-xl px-6 h-10 font-semibold text-sm">
          Thử lại ngay
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-in fade-in duration-500">
        <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300">
          <PackageSearch className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-800">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Vui lòng thử lại với các bộ lọc hoặc từ khóa tìm kiếm khác.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/shop")}
          className="rounded-xl px-6 h-10 border-slate-200 font-semibold text-sm"
        >
          Xem tất cả sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-10 min-h-[600px] flex flex-col justify-between">
      <div
        className={cn(
          "grid animate-in fade-in slide-in-from-bottom-4 duration-700 flex-1 content-start",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3 gap-4" : "grid-cols-1 gap-3"
        )}
      >
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-1.5 pt-8">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
            className="h-9 w-9 rounded-xl border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.max(1, totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === page;

              if (
                totalPages > 7 &&
                pageNum !== 1 &&
                pageNum !== totalPages &&
                (pageNum < page - 1 || pageNum > page + 1)
              ) {
                if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={pageNum} className="px-1.5 text-slate-300 text-sm">
                      ···
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={pageNum}
                  variant={isCurrent ? "default" : "ghost"}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "h-9 w-9 rounded-xl font-semibold text-sm transition-all",
                    isCurrent
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="icon"
            disabled={page === totalPages || totalPages === 0}
            onClick={() => onPageChange?.(page + 1)}
            className="h-9 w-9 rounded-xl border-slate-200 hover:bg-primary/5 hover:text-primary hover:border-primary/20 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
});
