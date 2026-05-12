"use client";

import React from "react";
import Link from "next/link";
import { Star, TrendingUp, Zap, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";
import { useCart } from "@/features/cart/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { QuickAddModal } from "./QuickAddModal";
import { animateFlyToCart } from "@/utils/animateCart";

interface HomeProductCardProps {
  product: Product;
  variant: "featured" | "bestseller" | "toprated";
}

export const HomeProductCard = React.memo(function HomeProductCard({
  product,
  variant,
}: HomeProductCardProps) {
  const { addItem } = useCart();
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);

  const { data: flashSale } = useFlashSale();
  const firstVariant = product.variants?.[0];
  const stock = firstVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = stock <= 0 || !firstVariant;

  const isFlashSale = flashSale?.products?.some(
    (p: any) => String(p.id) === String(product.id)
  );

  const flashSalePercent = isFlashSale ? flashSale?.percentage || 0 : 0;

  const basePrice = firstVariant?.price || product.basePrice || 0;
  let regularOriginalPrice = firstVariant?.originalPrice || product.originalPrice;

  if (!regularOriginalPrice || regularOriginalPrice <= basePrice) {
    regularOriginalPrice = undefined;
  }

  const hasRegularDiscount =
    regularOriginalPrice && regularOriginalPrice > basePrice;

  const price = isFlashSale
    ? Math.round(basePrice * (1 - flashSalePercent / 100))
    : basePrice;

  const originalPrice = isFlashSale
    ? basePrice
    : hasRegularDiscount
      ? regularOriginalPrice
      : null;

  // Handle case where product.images might be a JSON string from backend
  let images = product.images;
  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch (e) {
      images = [];
    }
  }

  const rawImage = Array.isArray(images) ? images[0] : null;
  const imageUrl = getImageUrl(
    typeof rawImage === "string" ? rawImage : (rawImage as any)?.url
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variants = product.variants || [];
    const hasMultipleVariants = variants.length > 1;
    const hasOptions = variants.some((v: any) => v.size || v.color);

    if (hasMultipleVariants || hasOptions) {
      setIsQuickAddOpen(true);
      return;
    }

    animateFlyToCart(e, imageUrl);

    const variantId = variants?.[0]?.id;
    if (!variantId) return;

    addItem({
      productId: String(product.id),
      variantId: String(variantId),
      name: product.name,
      price: price,
      originalPrice: originalPrice || undefined,
      imageUrl: imageUrl,
      slug: product.slug,
      quantity: 1,
    });
  };

  const discount = isFlashSale
    ? flashSalePercent
    : hasRegularDiscount
      ? Math.round(((regularOriginalPrice! - basePrice) / regularOriginalPrice!) * 100)
      : null;

  // ── FEATURED VARIANT ──
  if (variant === "featured") {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="group block relative aspect-[3/4] md:h-[360px] md:aspect-auto rounded-2xl overflow-hidden bg-white border border-slate-100 transition-all duration-500 hover:shadow-xl hover:border-primary/20"
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-8 pb-14 md:pb-20">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.03] mix-blend-multiply"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>

        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 z-30 flex flex-col gap-1">
          <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">
            Nổi bật
          </span>
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 md:p-5 space-y-1 md:space-y-1.5">
          <h3 className="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-tight drop-shadow-sm">
            {product.name}
          </h3>
          <div className="flex flex-col">
            <span className="text-xl md:text-3xl font-bold text-white drop-shadow-sm tabular-nums">
              {formatCurrency(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-sm text-white/60 line-through font-bold">
                  {formatCurrency(originalPrice)}
                </span>
                {discount && (
                  <span className={cn(
                    "text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest",
                    isFlashSale ? "bg-[#E85D24]" : "bg-primary"
                  )}>
                    -{discount}%
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // ── BESTSELLER VARIANT ──
  if (variant === "bestseller") {
    return (
      <div className="group relative flex flex-col h-full cursor-pointer bg-white rounded-2xl">
        {/* Card-wide Link */}
        <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-20">
          <span className="sr-only">Xem chi tiết {product.name}</span>
        </Link>

        {/* ── IMAGE SECTION ── */}
        <div className="relative z-10 aspect-square w-full overflow-hidden rounded-2xl bg-slate-50/50">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
            <div className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1.5 uppercase tracking-widest">
              <TrendingUp className="h-3 w-3" /> Bán chạy
            </div>
          </div>
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="relative z-10 mt-4 flex-1 flex flex-col px-1">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug flex-1">
              {product.name}
            </h3>
            <div className="flex flex-col items-end shrink-0">
              <p className="text-sm font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="text-[10px] text-slate-400 line-through font-bold">
                  {formatCurrency(originalPrice)}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-auto pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-0.5 no-uppercase">
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                <span className="text-slate-900 font-bold">
                  {Number(product.averageRating || 5).toFixed(1)}
                </span>
              </div>
              <span className="h-2 w-px bg-slate-100" />
              <span>
                Đã bán {product.soldCount || 0}
              </span>
            </div>

            {discount && (
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest text-white",
                isFlashSale ? "bg-[#E85D24]" : "bg-primary"
              )}>
                -{discount}%
              </span>
            )}
          </div>
        </div>

        <QuickAddModal
          product={product}
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          price={price}
          originalPrice={originalPrice}
        />
      </div>
    );
  }

  // ── TOP RATED VARIANT ──
  return (
    <div className="group relative p-3 rounded-2xl bg-slate-50/50 hover:bg-white transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-xl">
      {/* Card-wide Link */}
      <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-20">
        <span className="sr-only">Xem chi tiết {product.name}</span>
      </Link>

      <div className="relative z-10 flex gap-4">
        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-slate-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
            sizes="80px"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-between py-0.5">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-900">
                {Number(product.averageRating || 5).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({product.reviewCount || 0})
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-xs text-gray-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
              Top Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});
