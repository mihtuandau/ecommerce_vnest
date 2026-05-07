"use client";

import React from "react";
import { Product } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { useFlashSale } from "@/features/discounts/hooks";
import { useUIStore } from "@/store/useUIStore";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { QuickAddModal } from "./QuickAddModal";
import { animateFlyToCart } from "@/utils/animateCart";


interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

export const ProductCard = React.memo(function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success } = useToast();
  const { data: flashSale } = useFlashSale();
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);


  const isFavorite = isInWishlist(String(product.id));

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: price,
      originalPrice: originalPrice || undefined,
      imageUrl: imageUrl,
      slug: product.slug,
      stock: product.stock || 0,
    });
    if (!isFavorite) {
      success(`Đã thêm ${product.name} vào danh sách yêu thích`);
    }
  };

  const parsePrice = (val: string | number | undefined | null): number => {
    let num = 0;
    if (typeof val === "number") num = val;
    else if (typeof val === "string") num = parseFloat(val.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const basePrice = parsePrice(product.price || product.basePrice);

  // Check if product is in flash sale
  const isFlashSale = flashSale?.products?.some((p: { id: number | string }) => String(p.id) === String(product.id));
  const flashSalePercent = isFlashSale ? flashSale.percentage || 0 : 0;

  // Calculate final price based on flash sale
  const price = isFlashSale
    ? Math.round(basePrice * (1 - flashSalePercent / 100))
    : basePrice;

  // Set original price if on sale
  const originalPriceVal = product.variants?.[0]?.originalPrice || product.originalPrice;
  const originalPrice = isFlashSale
    ? basePrice
    : originalPriceVal
      ? parsePrice(originalPriceVal)
      : null;

  // Handle case where product.images might be a JSON string from backend
  let images = product.images;
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch (e) {
      images = [];
    }
  }

  const rawImage = Array.isArray(images) ? images[0] : null;
  const imageUrl = getImageUrl(typeof rawImage === "string" ? rawImage : (rawImage as any)?.url);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variants = product.variants || [];
    const hasMultipleVariants = variants.length > 1;

    // Check if the product has any options like size or color across variants
    const hasOptions = variants.some(v => v.size || v.color);

    if (hasMultipleVariants || hasOptions) {
      setIsQuickAddOpen(true);
      return;
    }

    // Trigger fly-to-cart animation
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



  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const soldCount = product.soldCount || 0;
  const viewCount = product.viewCount || 0;
  const rating = product.averageRating || 0;
  const firstVariant = product.variants?.[0];
  const stock = firstVariant?.stock ?? product.stock ?? 0;
  const isOutOfStock = stock <= 0 || !firstVariant;

  // ── LIST VIEW VARIANT ──
  if (view === "list") {
    return (
      <Card className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-primary/20 flex flex-row h-[140px] md:h-[180px]">
        <Link
          href={`/shop/${product.slug}`}
          className="relative w-1/3 md:w-1/4 h-full bg-slate-50/50 p-2 md:p-4 flex items-center justify-center shrink-0 border-r border-slate-100"
        >
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
            sizes="(max-width: 768px) 33vw, 25vw"
          />
          {discountPercent > 0 && !product.isNew && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[22px] md:text-[26px] leading-none drop-shadow-sm hover:scale-110 transition-transform">
                🔥
              </span>
            </div>
          )}
        </Link>

        <div className="flex-1 p-3 md:p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center justify-between relative">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-primary/80">
                  {product.brand?.name || "Minh Tuấn"}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#f4c300] text-[#f4c300]" />
                  <span className="text-[11px] font-medium text-slate-500">{rating > 0 ? rating.toFixed(1) : "Chưa có"}</span>
                </div>
              </div>
              <button 
                onClick={handleToggleWishlist}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isFavorite ? "text-rose-500 bg-rose-50" : "text-slate-300 hover:text-rose-500 hover:bg-slate-50"
                )}
              >
                <Heart size={16} className={cn(isFavorite && "fill-current")} />
              </button>
            </div>
            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-semibold text-slate-900 text-[13px] md:text-lg leading-tight line-clamp-1 md:line-clamp-2 hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-normal text-slate-500 tracking-tight">
              {soldCount > 0 && <span>Đã bán {soldCount}</span>}
              {viewCount > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="h-2.5 w-2.5 text-slate-400" /> {viewCount}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg md:text-2xl font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 line-through font-medium">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                    -{discountPercent}%
                  </span>
                </div>
              )}
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
      </Card>
    );
  }

  // ── GRID VIEW VARIANT ──
  return (
    <Card className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-xl hover:border-primary/20 flex flex-col h-full">
      {/* ── IMAGE SECTION ── */}
      <Link
        href={`/shop/${product.slug}`}
        className="block relative h-44 md:h-64 w-full overflow-hidden bg-slate-50/30 p-1.5 md:p-3 flex items-center justify-center shrink-0"
      >
        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 flex items-start justify-between w-full pr-4 md:pr-6">
          <div className="flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 md:py-1 rounded-md shadow-sm tracking-wide">
                Mới
              </span>
            )}
            {discountPercent > 0 && !product.isNew && (
              <span className="text-[22px] md:text-[26px] leading-none mt-0.5 drop-shadow-sm hover:scale-110 transition-transform">
                🔥
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <button 
              onClick={handleToggleWishlist}
              className={cn(
                "h-7 w-7 md:h-9 md:w-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300",
                isFavorite ? "text-rose-500 bg-white/90 shadow-sm" : "text-slate-400 bg-white/60 hover:text-rose-500 hover:bg-white shadow-sm"
              )}
            >
              <Heart size={14} className={cn(isFavorite && "fill-current")} />
            </button>
          </div>
        </div>

        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-110 mix-blend-multiply"
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={product.isNew}
        />
      </Link>

      {/* ── CONTENT SECTION ── */}
      <CardContent className="p-3 pt-0 flex flex-col flex-1 bg-white">
        <div className="space-y-1 flex-1 pt-2">
          {/* Brand Row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-500 tracking-wide">
              {product.brand?.name || "Minh Tuấn"}
            </span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block group/title">
            <h3 className="font-semibold text-slate-900 text-[11px] md:text-[13px] leading-tight line-clamp-2 group-hover/title:text-primary transition-colors min-h-[28px] md:min-h-[32px]">
              {product.name}
            </h3>
          </Link>

          {/* Rating, Sold & Views */}
          <div className="flex items-center justify-between gap-x-1 gap-y-1 flex-wrap w-full">
            <div className="flex items-center gap-1 shrink-0">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-2 md:h-2.5 w-2 md:w-2.5 ${i < Math.floor(rating) ? "fill-[#f4c300] text-[#f4c300]" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <span className="text-[8px] md:text-[9px] font-medium text-slate-400">
                ({product.reviewCount || 0})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-normal text-slate-500 tracking-tight flex-wrap justify-end ml-auto min-w-0">
              {soldCount > 0 && <span className="truncate">Đã bán {soldCount}</span>}
              {viewCount > 0 && (
                <div className="flex items-center gap-0.5 shrink-0">
                  <Eye className="h-3 w-3 text-slate-300" /> <span>{viewCount}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 md:pt-2 mt-2 border-t border-slate-50">
          <div className="flex flex-col">
            <span className="text-[15px] md:text-lg font-bold text-primary tabular-nums leading-tight">
              {formatCurrency(price)}
            </span>
            {discountPercent > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] md:text-[10px] text-slate-400 line-through font-medium">
                  {formatCurrency(originalPrice!)}
                </span>
                <span className="bg-destructive/10 text-destructive text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                  -{discountPercent}%
                </span>
              </div>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            size="icon"
            disabled={isOutOfStock}
            className={cn(
              "h-8 w-8 md:h-9 md:w-9 rounded-xl transition-all active:scale-95 shadow-lg",
              isOutOfStock
                ? "bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed shadow-none"
                : "bg-primary hover:bg-[#0d47a1] text-white shadow-blue-500/10"
            )}
          >
            {isOutOfStock ? (
              <span className="text-[8px] font-bold">Hết</span>
            ) : (
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
            )}
          </Button>
        </div>
      </CardContent>

      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        price={price}
        originalPrice={originalPrice}
      />
    </Card>
  );
});

