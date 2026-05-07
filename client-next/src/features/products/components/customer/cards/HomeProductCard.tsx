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
          <span className="bg-primary text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1.5 rounded-full shadow-lg tracking-wide">
            Nổi bật
          </span>
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 md:p-5 space-y-1 md:space-y-1.5">
          <h3 className="text-[11px] md:text-sm font-semibold text-white line-clamp-1 md:line-clamp-2 leading-tight drop-shadow-sm">
            {product.name}
          </h3>
          <div className="flex flex-col">
            <span className="text-base md:text-2xl font-bold text-white drop-shadow-sm tabular-nums">
              {formatCurrency(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] md:text-sm text-white/60 line-through font-bold">
                  {formatCurrency(originalPrice)}
                </span>
                {discount && (
                  <span className="bg-destructive/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
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
      <div className="h-full w-full">
        <Link
          href={`/shop/${product.slug}`}
          className="group block space-y-2 md:space-y-3 p-2 md:p-3 rounded-2xl bg-white border border-slate-100 transition-all hover:shadow-xl hover:border-primary/20 h-full"
        >
          <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2.5 md:p-4 transition-all">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-[1.03] mix-blend-multiply p-2.5 md:p-4"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex flex-col gap-1 z-10">
              {discount && (
                <div className="text-[22px] md:text-[26px] leading-none pl-1 pt-0.5 drop-shadow-sm hover:scale-110 transition-transform">
                  🔥
                </div>
              )}
            </div>
            <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 flex flex-col gap-1 z-10">
              <div className="bg-primary/10 text-primary text-[10px] md:text-[11px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full flex items-center gap-1 shadow-sm border border-primary/20 tracking-wide">
                <TrendingUp className="h-2.5 w-2.5" /> Bán chạy
              </div>
            </div>
          </div>

          <div className="space-y-1.5 md:space-y-2 px-0.5">
            <h3 className="font-bold text-[11px] md:text-sm text-foreground line-clamp-2 min-h-[30px] md:min-h-[40px] leading-snug">
              {product.name}
            </h3>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[15px] md:text-xl font-bold text-primary tabular-nums leading-tight">
                  {formatCurrency(price)}
                </span>
                {originalPrice && originalPrice > price && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] md:text-[12px] text-slate-500 line-through font-bold">
                      {formatCurrency(originalPrice)}
                    </span>
                    {discount && (
                      <span className="bg-destructive/10 text-destructive text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                        -{discount}%
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] md:text-[11px] font-medium text-slate-400">
                    Đã bán {product.soldCount || 0}
                  </span>
                  <span className="text-slate-200">|</span>
                  <span className="text-[10px] md:text-[11px] font-medium text-slate-400 flex items-center gap-0.5">
                    {product.viewCount || 0} lượt xem
                  </span>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm",
                  isOutOfStock
                    ? "bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed"
                    : "bg-primary text-white"
                )}
              >
                {isOutOfStock ? (
                  <span className="text-[10px] font-bold">Hết</span>
                ) : (
                  <ShoppingCart size={18} />
                )}
              </button>
            </div>
          </div>
        </Link>
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
    <Link
      href={`/shop/${product.slug}`}
      className="group block relative p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-transparent transition-all hover:bg-white hover:shadow-xl hover:border-slate-100"
    >
      <div className="flex gap-3 md:gap-4">
        <div className="relative h-14 w-14 md:h-20 md:w-20 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm border border-slate-100 flex items-center justify-center p-1.5 md:p-2">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-1.5 md:p-2"
            sizes="80px"
          />
        </div>
        <div className="flex-1 space-y-1 md:space-y-2 py-0.5 min-w-0">
          <div className="flex items-center gap-1">
            <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-[#f4c300] text-[#f4c300]" />
            <span className="text-[11px] md:text-xs font-bold text-foreground">
              {product.averageRating || 0}
            </span>
            <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground">
              ({product.reviewCount || 0})
            </span>
          </div>
          <h3 className="font-bold text-[11px] md:text-sm text-foreground line-clamp-1 md:line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="text-[15px] md:text-lg font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] md:text-[11px] text-slate-400 line-through font-medium">
                    {formatCurrency(originalPrice)}
                  </span>
                  {discount && (
                    <span className="bg-destructive/10 text-destructive text-[9px] font-bold px-1 py-0.5 rounded-sm">
                      -{discount}%
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="hidden xs:block text-[10px] md:text-[11px] font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-full tracking-wide">
              Top đánh giá
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});
