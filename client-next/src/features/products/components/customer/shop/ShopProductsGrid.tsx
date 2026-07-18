"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "../cards/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";
import { useSearchParams } from "next/navigation";
import { PackageSearch, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { EmptyState, Pagination } from "@/components/ui";
import {
  PRODUCTS_CONSTANTS,
  PRODUCTS_MESSAGES,
  PRODUCTS_VIEW_MODES,
} from "@/features/products/constants/product.constants";

interface ShopProductsGridProps {
  initialProducts?: Product[];
  isLoading?: boolean;
  view?: "grid" | "list";
  page?: number;
  onPageChange?: (page: number) => void;
}

import React from "react";

export const ShopProductsGrid = React.memo(function ShopProductsGrid({
  initialProducts,
  isLoading: externalIsLoading,
  view = "grid",
  page = 1,
  onPageChange,
}: ShopProductsGridProps) {
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
    limit: PRODUCTS_CONSTANTS.GRID_LIMIT,
    ...(categoryId && { categoryId }),
    ...(brandId && { brandId }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(minRating && { minRating }),
    ...(search && { search }),
    ...(sortBy && { sortBy }),
  };

  const {
    data,
    isLoading: internalIsLoading,
    error,
    refetch,
  } = useProducts(queryParams, {
    enabled: !initialProducts,
  });

  const isLoading = externalIsLoading || internalIsLoading;
  const products = initialProducts !== undefined ? initialProducts : data?.data || [];
  const totalPages = data?.meta?.totalPages || 0;

  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6 animate-in fade-in duration-700 min-h-[1200px] content-start",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
      >
        {Array.from({ length: PRODUCTS_CONSTANTS.GRID_LIMIT }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-[2rem] border border-brand-sand/40 overflow-hidden",
              view === PRODUCTS_VIEW_MODES.LIST ? "flex gap-6 p-4" : ""
            )}
          >
            <Skeleton
              className={cn(
                "bg-brand-cream",
                view === PRODUCTS_VIEW_MODES.GRID
                  ? "aspect-square w-full"
                  : "h-40 w-40 md:h-52 md:w-52 rounded-2xl shrink-0"
              )}
            />
            <div
              className={cn(
                "space-y-4 flex-1",
                view === PRODUCTS_VIEW_MODES.GRID ? "p-5" : "py-2"
              )}
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <div className="pt-4 border-t border-brand-ivory flex justify-between items-center">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-10 w-10 md:w-32 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && !initialProducts) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-[3rem] border border-brand-sand/40 shadow-sm animate-in zoom-in-95 duration-500 px-6">
        <div className="h-24 w-24 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
          <RefreshCcw className="h-10 w-10" />
        </div>
        <div className="space-y-3 max-w-sm">
          <h3 className="text-2xl font-bold text-primary font-serif">
            Hệ thống đang bảo trì
          </h3>
          <p className="text-sm text-brand-taupe font-medium leading-relaxed">
            Chúng tôi xin lỗi vì sự bất tiện này. Vui lòng kiểm tra lại kết nối hoặc thử
            lại sau ít phút.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          className="rounded-full px-10 h-12 bg-primary hover:bg-brand-bronze text-white font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-primary/10 transition-all active:scale-95 border-none"
        >
          Tải lại trang ngay
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Tuyệt phẩm chưa xuất hiện"
        description="Thật tiếc, chúng tôi chưa tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé."
        actionText="Khám phá tất cả sản phẩm"
        onAction={() => (window.location.href = "/shop")}
      />
    );
  }

  return (
    <div className="space-y-16 min-h-[1200px] flex flex-col justify-between">
      <div
        className={cn(
          "grid animate-in fade-in slide-in-from-bottom-6 duration-1000 flex-1 content-start",
          view === PRODUCTS_VIEW_MODES.GRID
            ? "grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid-cols-1 gap-6"
        )}
      >
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>

      
      {products.length > 0 && totalPages > 1 && (
        <div className="pt-12 border-t border-brand-sand">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </div>
      )}
    </div>
  );
});
