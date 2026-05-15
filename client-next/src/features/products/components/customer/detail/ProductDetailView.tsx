"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useProductDetail, useIncrementView } from "@/features/products/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

import { ProductBreadcrumbs } from "./ProductBreadcrumbs";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { ProductActions } from "./ProductActions";
import { ProductTrustBadges } from "./ProductTrustBadges";
import { RecentlyViewedProducts } from "../RecentlyViewedProducts";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import { ProductTabs } from "./ProductTabs";
import { RelatedProducts } from "../RelatedProducts";

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const { data: product, isLoading, error } = useProductDetail(slug);
  const { data: flashSale } = useFlashSale();
  const { mutate: incrementView } = useIncrementView();
  const { addProduct } = useRecentlyViewed();
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Track Recently Viewed & Increment view count
  useEffect(() => {
    if (product?.id) {
      addProduct(product);
      
      const timer = setTimeout(() => {
        incrementView(String(product.id));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [product, addProduct, incrementView]);

  // Find Selected Variant
  const selectedVariant = useMemo(() => {
    if (!product?.variants) return null;
    return product.variants.find((v) => 
      (!selectedSize || v.size === selectedSize) && 
      (!selectedColor || v.color === selectedColor)
    );
  }, [product, selectedSize, selectedColor]);

  // ── Combine All Images (Main + Variants) ──
  const allAvailableImages = useMemo(() => {
    if (!product) return [];
    const getUrl = (img: any) => (typeof img === "string" ? img : img?.url || "");
    
    const mainImages = product.images || [];
    const variantImages: any[] = [];
    
    product.variants?.forEach((v) => {
      v.images?.forEach((img) => {
        const url = getUrl(img);
        if (
          !variantImages.some((vi) => getUrl(vi) === url) && 
          !mainImages.some((mi) => getUrl(mi) === url)
        ) {
          variantImages.push(img);
        }
      });
    });

    let combined = [...mainImages, ...variantImages];

    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      const variantUrls = selectedVariant.images.map(img => getUrl(img));
      const otherImages = combined.filter(img => !variantUrls.includes(getUrl(img)));
      combined = [...selectedVariant.images, ...otherImages];
    }

    return combined.map(img => ({ url: getUrl(img) }));
  }, [product, selectedVariant]);

  if (isLoading) {
    return (
      <div className="bg-brand-cream min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-6 w-48 bg-brand-sand/20 animate-pulse rounded-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Skeleton className="aspect-square rounded-[2rem] bg-white border border-brand-sand/40" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-20 w-20 rounded-xl bg-white border border-brand-sand/40" />
                <Skeleton className="h-20 w-20 rounded-xl bg-white border border-brand-sand/40" />
                <Skeleton className="h-20 w-20 rounded-xl bg-white border border-brand-sand/40" />
              </div>
            </div>
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded-full bg-white" />
                <Skeleton className="h-12 w-3/4 rounded-2xl bg-white" />
                <Skeleton className="h-8 w-1/4 rounded-xl bg-white" />
              </div>
              <Skeleton className="h-32 w-full rounded-3xl bg-white" />
              <div className="space-y-6">
                 <Skeleton className="h-14 w-full rounded-full bg-white" />
                 <Skeleton className="h-14 w-full rounded-full bg-white" />
              </div>
              <Skeleton className="h-24 w-full rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-[20px] font-bold text-primary mb-6 font-serif">Không tìm thấy sản phẩm</h1>
        <Button asChild className="rounded-full px-8 h-12 bg-primary hover:bg-brand-bronze text-white border-none" variant="outline">
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  const isFlashSale = flashSale?.products?.some((p: any) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? (flashSale!.percentage || 0) : 0;
  
  const currentBasePrice = selectedVariant?.price || product.price || product.basePrice || 0;
  
  const finalPrice = isFlashSale 
    ? Math.round(currentBasePrice * (1 - flashSalePercent / 100))
    : currentBasePrice;
    
  const originalPriceVal = selectedVariant?.originalPrice || product.originalPrice;
  const finalOriginalPrice = isFlashSale 
    ? currentBasePrice 
    : originalPriceVal;

  const currentStock = selectedVariant?.stock ?? product.stock;
  
  return (
    <div className="bg-brand-cream min-h-screen">
      <ProductBreadcrumbs product={product} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-6">
            <div className="sticky top-32">
              <ProductGallery 
                images={allAvailableImages} 
                name={product.name} 
              />
            </div>
          </div>

          {/* ── Right: Product Info & Actions ── */}
          <div className="lg:col-span-6 space-y-10">
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
              <ProductInfo 
                product={product} 
                flashSale={flashSale} 
                finalPrice={finalPrice} 
                finalOriginalPrice={finalOriginalPrice} 
              />

              <ProductActions 
                product={product} 
                finalPrice={finalPrice} 
                finalOriginalPrice={finalOriginalPrice} 
                currentStock={currentStock}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedVariant={selectedVariant || null}
              />

              <ProductTrustBadges />
            </div>
          </div>
        </div>

        {/* Details & Tabs */}
        <div className="mt-24 border-t border-brand-ivory pt-20">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <div className="mt-24">
          <RelatedProducts categoryId={product.categoryId} currentProductId={String(product.id)} />
        </div>

        {/* Recently Viewed Products */}
        <div className="mt-24">
          <RecentlyViewedProducts currentProductId={String(product.id)} />
        </div>
      </div>
    </div>
  );
}
