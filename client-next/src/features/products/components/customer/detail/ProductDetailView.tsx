"use client";

import React, { useState, useMemo } from "react";
import { useProductDetail } from "@/features/products/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductActions } from "./ProductActions";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "../RelatedProducts";

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const { data: product, isLoading, error } = useProductDetail(slug);
  const { data: flashSale } = useFlashSale();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Find Selected Variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v: any) => 
      (!selectedSize || v.size === selectedSize) && 
      (!selectedColor || v.color === selectedColor)
    );
  }, [product, selectedSize, selectedColor]);

  // ── Combine All Images (Main + Variants) ──
  const allAvailableImages = useMemo(() => {
    if (!product) return [];
    const mainImages = product.images || [];
    const variantImages: any[] = [];
    
    product.variants?.forEach((v: any) => {
      v.images?.forEach((img: any) => {
        // Tránh trùng lặp URL
        if (!variantImages.some(vi => vi.url === img.url) && !mainImages.some(mi => mi.url === img.url)) {
          variantImages.push(img);
        }
      });
    });

    if (selectedVariant?.images?.length > 0) {
      // Nếu đã chọn biến thể, đưa ảnh biến thể đó lên đầu
      const otherImages = [...mainImages, ...variantImages].filter(
        img => !selectedVariant.images.some((svi: any) => svi.url === img.url)
      );
      return [...selectedVariant.images, ...otherImages];
    }

    return [...mainImages, ...variantImages];
  }, [product, selectedVariant]);

  if (isLoading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <Skeleton className="aspect-square rounded-[3rem]" />
          <div className="space-y-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-4">
               <Skeleton className="h-14 flex-1 rounded-full" />
               <Skeleton className="h-14 flex-1 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <h1 className="text-2xl font-semibold uppercase tracking-tight text-slate-400">Không tìm thấy sản phẩm</h1>
        <Button asChild className="rounded-full px-8" variant="outline">
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  const isFlashSale = flashSale?.products?.some((p: any) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? (flashSale.percentage || 0) : 0;
  
  const currentBasePrice = selectedVariant?.price || product.price || (product as any).basePrice || 0;
  
  const finalPrice = isFlashSale 
    ? Math.round(currentBasePrice * (1 - flashSalePercent / 100))
    : currentBasePrice;
    
  const originalPriceVal = product.originalPrice || (product as any).oldPrice;
  const finalOriginalPrice = isFlashSale 
    ? currentBasePrice 
    : originalPriceVal;

  const currentStock = selectedVariant?.stock ?? product.stock;

  return (
    <div className="bg-white min-h-screen pb-20">
      <ProductBreadcrumbs product={product} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-7">
            <ProductGallery 
              images={allAvailableImages} 
              name={product.name} 
            />
          </div>

          {/* ── Right: Product Info & Actions ── */}
          <div className="lg:col-span-5 space-y-8">
            <ProductInfo 
              product={product} 
              flashSale={flashSale} 
              finalPrice={finalPrice} 
              finalOriginalPrice={finalOriginalPrice} 
            />

            <ProductActions 
              product={product} 
              finalPrice={finalPrice} 
              currentStock={currentStock}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedVariant={selectedVariant}
            />
          </div>
        </div>

        {/* Details & Tabs */}
        <div className="mt-20 border-t border-slate-50 pt-16">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}
