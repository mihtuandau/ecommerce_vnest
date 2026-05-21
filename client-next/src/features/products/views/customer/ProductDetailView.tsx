"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDiscounts, useFlashSale } from "@/features/discounts/hooks";
import { useIncrementView, useProductDetail } from "@/features/products/hooks";
import { useRecentlyViewed } from "@/features/products/hooks/useRecentlyViewed";
import {
  findActiveFlashSaleSession,
  findSelectedProductVariant,
  getCurrentProductStock,
  getProductGalleryImages,
  getProductPricing,
} from "@/features/products/services";
import { ProductActions } from "../../components/customer/detail/ProductActions";
import { ProductBreadcrumbs } from "../../components/customer/detail/ProductBreadcrumbs";
import { ProductGallery } from "../../components/customer/detail/ProductGallery";
import { ProductInfo } from "../../components/customer/detail/ProductInfo";
import { ProductTabs } from "../../components/customer/detail/ProductTabs";
import { ProductTrustBadges } from "../../components/customer/detail/ProductTrustBadges";
import { RecentlyViewedProducts } from "../../components/customer/detail/RecentlyViewedProducts";
import { RelatedProducts } from "../../components/customer/detail/RelatedProducts";

interface ProductDetailViewProps {
  slug: string;
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const { data: product, isLoading, error } = useProductDetail(slug);
  const { data: flashSale } = useFlashSale();
  const { data: discountsData } = useDiscounts({ type: "PROMOTION" });
  const { mutate: incrementView } = useIncrementView();
  const { addProduct } = useRecentlyViewed();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const allDiscounts = useMemo(() => {
    const flashSaleDiscounts = Array.isArray(flashSale) ? flashSale : [];
    const promotionDiscounts = Array.isArray(discountsData) ? discountsData : [];
    return [...flashSaleDiscounts, ...promotionDiscounts];
  }, [flashSale, discountsData]);

  const activeFlashSession = useMemo(
    () => findActiveFlashSaleSession(flashSale, product?.id),
    [flashSale, product?.id]
  );

  useEffect(() => {
    if (!product?.id) return;

    addProduct(product);
    const timer = setTimeout(() => {
      incrementView(String(product.id));
    }, 3000);

    return () => clearTimeout(timer);
  }, [product, addProduct, incrementView]);

  const selectedVariant = useMemo(
    () => findSelectedProductVariant(product, selectedSize, selectedColor),
    [product, selectedSize, selectedColor]
  );

  const allAvailableImages = useMemo(
    () => getProductGalleryImages(product, selectedVariant),
    [product, selectedVariant]
  );

  if (isLoading) {
    return (
      <div className="bg-brand-cream min-h-screen font-sans-brand">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Skeleton className="h-6 w-48 bg-brand-sand/20 rounded-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Skeleton className="aspect-square rounded-[2rem] bg-white border border-brand-sand/40" />
              <div className="flex gap-4 mt-6">
                <Skeleton className="h-20 w-20 rounded-2xl bg-white border border-brand-sand/40" />
                <Skeleton className="h-20 w-20 rounded-2xl bg-white border border-brand-sand/40" />
                <Skeleton className="h-20 w-20 rounded-2xl bg-white border border-brand-sand/40" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <Skeleton className="h-4 w-24 rounded-full bg-white/50" />
                <Skeleton className="h-10 w-3/4 rounded-2xl bg-white" />
                <Skeleton className="h-12 w-1/3 rounded-2xl bg-white mt-8" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-12 w-full rounded-full bg-white" />
                <Skeleton className="h-12 w-full rounded-full bg-white" />
              </div>
              <Skeleton className="h-32 w-full rounded-3xl bg-white/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-[20px] font-bold text-primary mb-6 font-serif">
          Không tìm thấy sản phẩm
        </h1>
        <Button
          asChild
          className="rounded-full px-8 h-12 bg-primary hover:bg-brand-bronze text-white border-none"
          variant="outline"
        >
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  const { finalPrice, finalOriginalPrice } = getProductPricing(
    product,
    selectedVariant,
    allDiscounts
  );
  const currentStock = getCurrentProductStock(product, selectedVariant);

  return (
    <div className="bg-brand-cream min-h-screen font-sans-brand">
      <ProductBreadcrumbs product={product} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="sticky top-32">
              <ProductGallery images={allAvailableImages} name={product.name} />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
              <ProductInfo
                product={product}
                flashSale={activeFlashSession}
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
                selectedVariant={selectedVariant}
              />

              <ProductTrustBadges />
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-brand-ivory pt-20">
          <ProductTabs product={product} />
        </div>

        <div className="mt-24">
          <RelatedProducts
            categoryId={product.categoryId}
            currentProductId={String(product.id)}
          />
        </div>

        <div className="mt-24">
          <RecentlyViewedProducts currentProductId={String(product.id)} />
        </div>
      </div>
    </div>
  );
}
