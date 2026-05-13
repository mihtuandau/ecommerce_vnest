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
          "grid gap-6 animate-in fade-in duration-700",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-white rounded-[2rem] border border-[#DDD6C8]/40 overflow-hidden",
              view === "list" ? "flex gap-6 p-4" : ""
            )}
          >
            <Skeleton
              className={cn(
                "bg-[#FAF8F4]",
                view === "grid" ? "aspect-square w-full" : "h-40 w-40 md:h-52 md:w-52 rounded-2xl shrink-0"
              )}
            />
            <div className={cn("space-y-4 flex-1", view === "grid" ? "p-5" : "py-2")}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/3 rounded-full" />
              <div className="pt-4 border-t border-[#F3EFE8] flex justify-between items-center">
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
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-[3rem] border border-[#DDD6C8]/40 shadow-sm animate-in zoom-in-95 duration-500 px-6">
        <div className="h-24 w-24 rounded-[2rem] bg-rose-50 flex items-center justify-center text-rose-500 shadow-inner">
          <RefreshCcw className="h-10 w-10" />
        </div>
        <div className="space-y-3 max-w-sm">
          <h3 className="text-2xl font-bold text-[#3D2B1A]" style={{ fontFamily: "'Playfair Display', serif" }}>Hệ thống đang bảo trì</h3>
          <p className="text-sm text-[#8A7966] font-medium leading-relaxed">
            Chúng tôi xin lỗi vì sự bất tiện này. Vui lòng kiểm tra lại kết nối hoặc thử lại sau ít phút.
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          className="rounded-full px-10 h-12 bg-[#3D2B1A] hover:bg-[#C4783A] text-white font-bold text-[11px] uppercase tracking-widest shadow-xl shadow-[#3D2B1A]/10 transition-all active:scale-95 border-none"
        >
          Tải lại trang ngay
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-8 bg-white rounded-[3rem] border border-[#DDD6C8]/40 shadow-sm animate-in zoom-in-95 duration-700 px-6">
        <div className="h-24 w-24 rounded-[2rem] bg-[#FAF8F4] flex items-center justify-center text-[#C4B49A] shadow-inner">
          <PackageSearch className="h-10 w-10" />
        </div>
        <div className="space-y-3 max-w-md">
          <h3 className="text-2xl font-bold text-[#3D2B1A]" style={{ fontFamily: "'Playfair Display', serif" }}>Tuyệt phẩm chưa xuất hiện</h3>
          <p className="text-sm text-[#8A7966] font-medium leading-relaxed">
            Thật tiếc, chúng tôi chưa tìm thấy sản phẩm nào phù hợp với yêu cầu của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm nhé.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/shop")}
          className="rounded-full px-10 h-12 border-[#DDD6C8] text-[#3D2B1A] font-bold text-[11px] uppercase tracking-widest hover:bg-[#FAF8F4] transition-all active:scale-95"
        >
          Khám phá tất cả sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-16 min-h-[600px] flex flex-col justify-between">
      <div
        className={cn(
          "grid animate-in fade-in slide-in-from-bottom-6 duration-1000 flex-1 content-start",
          view === "grid" ? "grid-cols-2 lg:grid-cols-3 gap-6" : "grid-cols-1 gap-6"
        )}
      >
        {products.map((product: Product) => (
          <ProductCard key={product.id} product={product} view={view} />
        ))}
      </div>

      {/* Pagination */}
      {products.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-12 border-t border-[#F3EFE8]">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 1}
            onClick={() => onPageChange?.(page - 1)}
            className="h-11 w-11 rounded-2xl border-[#DDD6C8] bg-white text-[#3D2B1A] hover:bg-[#FAF8F4] hover:text-[#C4783A] hover:border-[#C4783A]/30 disabled:opacity-30 transition-all"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
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
                    <span key={pageNum} className="px-2 text-[#C4B49A] text-sm font-bold">
                      ···
                    </span>
                  );
                }
                return null;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => onPageChange?.(pageNum)}
                  className={cn(
                    "h-11 w-11 rounded-2xl font-bold text-[13px] transition-all",
                    isCurrent
                      ? "bg-[#3D2B1A] text-white shadow-xl shadow-[#3D2B1A]/15 active:scale-95"
                      : "bg-white text-[#8A7966] hover:bg-[#FAF8F4] hover:text-[#3D2B1A] border border-[#DDD6C8]"
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
            className="h-11 w-11 rounded-2xl border-[#DDD6C8] bg-white text-[#3D2B1A] hover:bg-[#FAF8F4] hover:text-[#C4783A] hover:border-[#C4783A]/30 disabled:opacity-30 transition-all"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
});
