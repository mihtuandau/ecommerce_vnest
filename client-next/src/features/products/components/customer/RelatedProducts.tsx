"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "./cards/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";

interface RelatedProductsProps {
  categoryId: number | null | undefined;
  currentProductId: number;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: products, isLoading } = useProducts({
    categoryId: categoryId || undefined,
    limit: 4,
  });

  // Filter out current product
  const related = Array.isArray(products?.data) 
    ? products.data.filter((p: Product) => p.id !== currentProductId) 
    : [];

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Đang tải gợi ý</h2>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="space-y-10">
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
