"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { productsApi } from "@/features/products/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { getImageUrl } from "@/utils/image";
import { Skeleton } from "@/components/ui/Skeleton";

const productCache: Record<number, any> = {};

export const ChatProductCard = ({
  productId,
  salePrice,
}: {
  productId: number;
  salePrice?: number;
}) => {
  const [product, setProduct] = useState<any>(productCache[productId] || null);
  const [loading, setLoading] = useState(!productCache[productId]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let active = true;

    if (productCache[productId]) {
      setProduct(productCache[productId]);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await productsApi.getProduct(productId.toString());
        if (!active) return;
        productCache[productId] = data;
        setProduct(data);
      } catch (error: any) {
        if (!active) return;
        if (error?.response?.status === 429) {
          timeoutId = setTimeout(fetchProduct, 2000);
          return;
        }
        console.error("Failed to fetch chat product:", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProduct();

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [productId]);

  if (loading) return <Skeleton className="w-full h-20 rounded-xl" />;

  if (!product) return null;

  const currentPrice = salePrice || product.basePrice;
  const originalPrice = product.originalPrice || (salePrice ? product.basePrice : null);
  const hasDiscount = originalPrice && originalPrice > currentPrice;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded-xl hover:border-primary/30 hover:shadow-sm transition-all group mt-2 relative z-10"
    >
      <div className="h-12 w-12 rounded-lg bg-slate-50/50 flex-shrink-0 overflow-hidden border border-slate-50 flex items-center justify-center relative">
        <Image
          src={getImageUrl(product.images?.[0]?.url || product.image)}
          alt={product.name}
          fill
          className="object-contain p-1.5 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[11px] font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-bold text-gray-900 tabular-nums">
            {formatCurrency(currentPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[9px] text-gray-400 line-through tabular-nums">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
      <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-primary transition-colors" />
    </Link>
  );
};
