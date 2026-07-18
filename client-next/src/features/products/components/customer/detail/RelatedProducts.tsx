"use client";

import { useProducts } from "@/features/products/hooks";
import { ProductCard } from "@/features/products/components/customer/cards/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";
import { Spinner } from "@/components/ui/Spinner";
import { SectionHeading } from "@/features/home/components/customer/shared/SectionHeading";

interface RelatedProductsProps {
  categoryId: number | null | undefined;
  currentProductId: string | number;
}

export function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
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
        <div className="flex items-center gap-2">
          <Spinner size="sm" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-taupe/60">
            Đang tải gợi ý
          </h2>
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
      <div className="space-y-3">
        <SectionHeading
          eyebrow="Gợi ý cho bạn"
          title="Sản phẩm liên quan"
          accent="liên quan"
        />
        <p className="text-brand-taupe text-sm max-w-md leading-relaxed">
          Có thể bạn cũng sẽ thích những sản phẩm này
        </p>
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
