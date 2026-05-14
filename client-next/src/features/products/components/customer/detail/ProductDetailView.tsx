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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-square rounded-3xl" />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-3/4 rounded-xl" />
              <Skeleton className="h-6 w-1/4 rounded-lg" />
            </div>
            <Skeleton className="h-40 w-full rounded-2xl" />
            <div className="space-y-4">
               <Skeleton className="h-14 w-full rounded-full" />
               <Skeleton className="h-14 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-[20px] font-bold text-[#3D2B1A] mb-6 font-serif">Không tìm thấy sản phẩm</h1>
        <Button asChild className="rounded-full px-8 h-12 bg-[#3D2B1A] hover:bg-[#C4783A] text-white" variant="outline">
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
    <div className="bg-[#FAF8F4] min-h-screen">
      <ProductBreadcrumbs product={product} />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* ── Left: Image Gallery ── */}
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <ProductGallery 
                images={allAvailableImages} 
                name={product.name} 
              />
            </div>
          </div>

          {/* ── Right: Product Info & Actions ── */}
          <div className="lg:col-span-5 space-y-10">
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
        <div className="mt-24 border-t border-[#F3EFE8] pt-20">
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
