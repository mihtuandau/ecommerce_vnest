"use client";

import { Product } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, TrendingUp, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/store/useUIStore";
import { useFlashSale } from "@/features/discounts/hooks";

interface HomeProductCardProps {
  product: Product;
  variant: "featured" | "bestseller" | "toprated";
}

export function HomeProductCard({ product, variant }: HomeProductCardProps) {
  const { addItem } = useCart();
  const { success } = useToast();
  const { data: flashSale } = useFlashSale();

  const parsePrice = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
    return 0;
  };

  const basePrice = parsePrice(product.price || (product as any).basePrice);

  // Check if product is in flash sale
  const isFlashSale = flashSale?.products?.some((p: any) => p.id === product.id);
  const flashSalePercent = isFlashSale ? flashSale.percentage || 0 : 0;

  // Calculate final price based on flash sale
  const price = isFlashSale
    ? Math.round(basePrice * (1 - flashSalePercent / 100))
    : basePrice;

  // Calculate regular discount if not in flash sale
  const originalPriceVal = product.originalPrice || (product as any).oldPrice;
  const regularOriginalPrice = originalPriceVal ? parsePrice(originalPriceVal) : null;
  const hasRegularDiscount = regularOriginalPrice && regularOriginalPrice > basePrice;

  const originalPrice = isFlashSale 
    ? basePrice 
    : (hasRegularDiscount ? regularOriginalPrice : null);

  const rawImage = product.images?.[0];
  const imageUrl = typeof rawImage === "string" ? rawImage : (rawImage as any)?.url || "/placeholder.png";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const defaultVariantId = product.variants?.[0]?.id || product.id;

    addItem({
      productId: String(product.id),
      variantId: String(defaultVariantId),
      name: product.name,
      price: price,
      originalPrice: originalPrice || undefined,
      imageUrl: imageUrl,
      slug: product.slug,
      quantity: 1,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const discount = isFlashSale 
    ? flashSalePercent 
    : (hasRegularDiscount ? Math.round(((regularOriginalPrice! - basePrice) / regularOriginalPrice!) * 100) : null);

  // ── FEATURED VARIANT ──
  if (variant === "featured") {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="group block relative aspect-[3/4] md:h-[360px] md:aspect-auto rounded-2xl overflow-hidden bg-white border border-slate-100 transition-all duration-500 hover:shadow-xl hover:border-primary/20"
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 md:p-8 pb-14 md:pb-20">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] mix-blend-multiply"
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
          <div className="flex items-center justify-between gap-1">
            <div className="flex flex-col">
              <span className="text-base md:text-2xl font-bold text-white drop-shadow-sm tabular-nums">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <div className="flex items-center gap-2">
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
            <button
              onClick={handleAddToCart}
              className="rounded-full h-7 w-7 md:h-9 md:w-9 shadow-xl bg-white text-primary hover:bg-primary hover:text-white transition-all border-none flex items-center justify-center shrink-0"
            >
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  // ── BESTSELLER VARIANT ──
  if (variant === "bestseller") {
    return (
      <Link
        href={`/shop/${product.slug}`}
        className="group block space-y-2 md:space-y-3 p-2 md:p-3 rounded-2xl bg-white border border-slate-100 transition-all hover:shadow-xl hover:border-primary/20"
      >
        <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-white flex items-center justify-center p-2.5 md:p-4 transition-all">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.03] mix-blend-multiply"
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
                  Đã bán {(product as any).soldCount || 0}
                </span>
                <span className="text-slate-200">|</span>
                <span className="text-[10px] md:text-[11px] font-medium text-slate-400 flex items-center gap-0.5">
                  {(product as any).viewCount || 0} lượt xem
                </span>
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="rounded-full h-7 w-7 md:h-9 md:w-9 bg-slate-50 text-primary hover:bg-primary hover:text-white shadow-sm border border-slate-100 flex items-center justify-center transition-all shrink-0"
            >
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
            </button>
          </div>
        </div>
      </Link>
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
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex-1 space-y-1 md:space-y-2 py-0.5 min-w-0">
          <div className="flex items-center gap-1">
            <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-[#f4c300] text-[#f4c300]" />
            <span className="text-[11px] md:text-xs font-bold text-foreground">
              {(product as any).averageRating || 0}
            </span>
            <span className="text-[10px] md:text-[11px] font-medium text-muted-foreground">
              ({(product as any).reviewCount || 0})
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
}
