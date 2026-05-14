"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "./cards/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";
import { Zap } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface RelatedProductsProps {
  categoryId: number | null | undefined;
  currentProductId: string | number;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: products, isLoading } = useProducts({
    categoryId: categoryId || undefined,
    limit: 4,
  });

  // Filter out current product
  const related = Array.isArray(products?.data) 
    ? products.data.filter((p: Product) => String(p.id) !== String(currentProductId)) 
    : [];

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <div className="flex items-center gap-2">
            <Spinner size="sm" variant="slate" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Đang tải gợi ý</h2>
          </div>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
          <Zap size={20} />
        </div>
        <div>
          <h2 className="text-[28px] font-bold text-[#3D2B1A] tracking-tight font-serif">Sản phẩm liên quan</h2>
          <p className="text-[13px] text-[#8A7966] font-medium mt-0.5">Có thể bạn cũng sẽ thích những sản phẩm này</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
        {related.map((product: Product) => (
          <div key={product.id} className="animate-in fade-in zoom-in-95 duration-500">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
