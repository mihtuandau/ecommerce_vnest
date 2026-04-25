"use client";

import { Product } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, TrendingUp, Sparkles, Award } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/store/useUIStore";

interface HomeProductCardProps {
  product: Product;
  variant: "featured" | "bestseller" | "toprated";
}

export function HomeProductCard({ product, variant }: HomeProductCardProps) {
  const { addItem } = useCartStore();
  const { success } = useToast();

  const parsePrice = (val: any) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
    return 0;
  };

  const price = parsePrice(product.price || (product as any).basePrice);
  const originalPriceVal = product.originalPrice || (product as any).oldPrice;
  const originalPrice = originalPriceVal ? parsePrice(originalPriceVal) : null;

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
      imageUrl: imageUrl,
      slug: product.slug,
      quantity: 1,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  const discount = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

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
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.03] mix-blend-multiply"
          />
        </div>

        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 z-30 flex flex-col gap-1">
          <span className="bg-[#1565C0] text-white text-[8px] md:text-[9px] font-bold px-2 py-0.5 md:px-2.5 md:py-1.5 rounded-full shadow-lg uppercase tracking-wider">
            Nổi bật
          </span>
          {discount && (
            <span className="bg-[#e85d24] text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg shadow-lg uppercase tracking-widest">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 z-30 p-3 md:p-5 space-y-1 md:space-y-1.5">
          <h3 className="text-[11px] md:text-sm font-bold text-white line-clamp-1 md:line-clamp-2 leading-tight drop-shadow-sm">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-1">
            <span className="text-[13px] md:text-xl font-black text-white drop-shadow-sm tabular-nums">
              {formatCurrency(price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="rounded-full h-7 w-7 md:h-9 md:w-9 shadow-xl bg-white text-[#1565C0] hover:bg-[#1565C0] hover:text-white transition-all border-none flex items-center justify-center shrink-0"
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
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 flex flex-col gap-1">
            <div className="bg-[#1565C0]/10 text-[#1565C0] text-[8px] md:text-[9px] font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full flex items-center gap-1 shadow-sm border border-[#1565C0]/20 tracking-wide">
              <TrendingUp className="h-2.5 w-2.5" /> Bán chạy
            </div>
            {discount && (
              <div className="bg-[#e85d24] text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-center shadow-sm uppercase tracking-widest">
                -{discount}%
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1.5 md:space-y-2 px-0.5">
          <h3 className="font-bold text-[11px] md:text-sm text-[#1a1a1a] line-clamp-2 min-h-[30px] md:min-h-[40px] leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[13px] md:text-lg font-black text-[#1a1a1a] tabular-nums leading-tight">
                {formatCurrency(price)}
              </span>
              <span className="text-[8px] md:text-[9px] font-black text-[#999] uppercase tracking-[0.1em] mt-0.5">
                Đã bán {(product as any).soldCount || 0}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="rounded-lg md:rounded-full h-7 w-7 md:h-9 md:w-9 bg-slate-50 text-[#1565C0] hover:bg-[#1565C0] hover:text-white shadow-sm border border-slate-100 flex items-center justify-center transition-all shrink-0"
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
            <span className="text-[10px] md:text-xs font-black text-[#1a1a1a]">
              {(product as any).averageRating || 5.0}
            </span>
            <span className="text-[8px] md:text-[9px] font-bold text-[#999]">
              ({(product as any).reviewCount || 0})
            </span>
          </div>
          <h3 className="font-bold text-[11px] md:text-sm text-[#1a1a1a] line-clamp-1 md:line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[13px] md:text-base font-black text-[#1a1a1a] tabular-nums">
              {formatCurrency(price)}
            </span>
            <div className="hidden xs:block text-[7px] md:text-[8px] font-black text-[#1565C0] bg-[#1565C0]/10 px-1.5 py-0.5 rounded-md uppercase tracking-[0.1em]">
              Top Rated
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
