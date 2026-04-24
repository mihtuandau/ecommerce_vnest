"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "@/components/shared/ProductCard";
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

export function ProductList({
  initialProducts,
  view = "grid",
  page = 1,
  onPageChange,
}: ProductListProps) {
  const searchParams = useSearchParams();

  // Extract filters from URL
  const categoryId = searchParams.get("categoryId");
  const brandId = searchParams.get("brandId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const search = searchParams.get("search");
  const sortBy = searchParams.get("sortBy");

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

  const products = initialProducts || data?.data || [];
  const totalPages = data?.totalPages || 0;

  if (isLoading && !initialProducts) {
    return (
      <div
        className={cn(
          "grid gap-3 md:gap-5",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn("space-y-5", view === "list" && "flex gap-6 space-y-0")}
          >
            <Skeleton
              className={cn(
                "w-full rounded-[2rem]",
                view === "grid" ? "aspect-square" : "h-[180px] w-1/4"
              )}
            />
            <div className={cn("space-y-3 px-2 flex-1", view === "list" && "py-4")}>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !initialProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
          <RefreshCcw className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Không thể tải sản phẩm</h3>
          <p className="text-slate-500 max-w-xs mx-auto">
            Vui lòng kiểm tra kết nối mạng và thử lại sau ít phút.
          </p>
        </div>
        <Button onClick={() => refetch()} className="rounded-full px-8">
          Thử lại ngay
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-in fade-in duration-700">
        <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
          <PackageSearch className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">
            Vui lòng thử lại với các bộ lọc hoặc từ khóa tìm kiếm khác.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/shop")}
          className="rounded-full px-8 border-slate-200"
        >
          Xem tất cả sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 min-h-[1400px] flex flex-col justify-between pb-12">
      <div
        className={cn(
          "grid gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-4 duration-1000 flex-1 content-start",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
      >
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex justify-center items-center gap-2 pt-8 border-t border-slate-100">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
            className="rounded-xl border-slate-200 hover:bg-white hover:text-primary hover:border-primary/20 disabled:opacity-30"
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
                    <span key={pageNum} className="px-2 text-slate-300">
                      ...
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
                    "h-10 w-10 rounded-xl font-bold text-sm",
                    isCurrent
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-slate-500 hover:bg-white hover:text-primary hover:shadow-sm"
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
            className="rounded-xl border-slate-200 hover:bg-white hover:text-primary hover:border-primary/20 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
