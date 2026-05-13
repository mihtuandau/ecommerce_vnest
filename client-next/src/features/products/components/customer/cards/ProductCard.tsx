"use client";

import React from "react";
import { Product } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Star, Eye, Heart, Flame } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { useFlashSale } from "@/features/discounts/hooks";
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
  const isFavorite = useWishlistStore(state => state.items.some(i => i.id === String(product.id)));
  const toggleWishlist = useWishlistStore(state => state.toggleWishlist);
  const { success } = useToast();
  const { data: flashSale } = useFlashSale();
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      color: variants?.[0]?.color,
      size: variants?.[0]?.size,
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

  // Variant info for display
  const variants = product.variants || [];
  const colorCount = new Set(variants.filter(v => v.color).map(v => v.color)).size;
  const sizeCount = new Set(variants.filter(v => v.size).map(v => v.size)).size;
  const variantInfo = [
    colorCount > 0 ? `${colorCount} màu` : null,
    sizeCount > 0 ? `${sizeCount} size` : null,
  ].filter(Boolean).join(" · ");

  // Format sold count for display
  const formatSoldCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return count.toString();
  };

  // ── LIST VIEW VARIANT ──
  if (view === "list") {
    return (
      <div className="group relative flex gap-5 bg-white rounded-2xl border border-slate-100 p-3 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">

        {/* ── IMAGE SECTION ── */}
        <div className="relative z-10 w-32 h-32 md:w-44 md:h-44 shrink-0 overflow-hidden rounded-xl bg-slate-50 p-2 cursor-pointer">
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="h-full w-full object-contain object-center transition-transform duration-500 ease-in-out group-hover:scale-105 mix-blend-multiply"
              sizes="(max-width: 768px) 128px, 176px"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
            {isFlashSale && (
              <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <Flame size={10} /> Flash Sale
              </span>
            )}
            {discountPercent > 0 && !isFlashSale && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                Giảm giá
              </span>
            )}
            {product.isNew && (
              <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                Mới
              </span>
            )}
            {soldCount >= 50 && !isFlashSale && !product.isNew && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                Bán chạy
              </span>
            )}
          </div>
        </div>

        {/* Wishlist Button */}
        <button 
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 z-30 border",
            isFavorite 
              ? "text-rose-500 bg-rose-50 border-rose-200" 
              : "text-slate-300 bg-white border-slate-200 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50"
          )}
        >
          <Heart size={14} className={cn(isFavorite && "fill-current")} />
        </button>

        {/* ── CONTENT SECTION ── */}
        <div className="relative z-10 flex-1 flex flex-col py-1">
          <div className="space-y-1.5">
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {product.name}
              </h3>
            </Link>
            {variantInfo && (
              <p className="text-[11px] text-slate-400 font-medium">
                {variantInfo}
              </p>
            )}
          </div>

          {/* Rating + Stats */}
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={cn("h-3 w-3", i < Math.round(rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
                ))}
              </div>
              <span className="text-slate-700 font-semibold">
                {rating > 0 ? rating.toFixed(1) : "5.0"}
              </span>
              {product.reviewCount > 0 && (
                <span className="text-slate-400">({product.reviewCount})</span>
              )}
            </div>
            <span className="h-3 w-px bg-slate-200" />
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-slate-400" />
              <span>{formatSoldCount(viewCount)}</span>
            </div>
            <span className="h-3 w-px bg-slate-200" />
            <span>Đã bán {formatSoldCount(soldCount)}</span>
          </div>

          <div className="mt-2 flex-1">
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {product.description || "Sản phẩm chính hãng chất lượng cao."}
            </p>
          </div>
          
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="text-sm md:text-base font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="text-[10px] md:text-[11px] text-slate-400 line-through tabular-nums">
                  {formatCurrency(originalPrice)}
                </p>
              )}
              {discountPercent > 0 && (
                <span className={cn(
                  "text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded",
                  isFlashSale 
                    ? "text-orange-600 bg-orange-50" 
                    : "text-primary bg-primary/5"
                )}>
                  -{discountPercent}%
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="relative h-9 w-9 md:w-auto md:px-4 rounded-full md:rounded-xl bg-primary text-white hover:brightness-110 font-semibold text-xs shadow-md transition-all active:scale-[0.98] z-20 flex items-center justify-center"
            >
              <ShoppingCart size={14} className="md:mr-1.5" />
              <span className="hidden md:inline">
                {isOutOfStock ? "Hết hàng" : "Thêm nhanh"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW VARIANT ──
  return (
    <div className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/10">

      {/* ── IMAGE SECTION ── */}
      <div className="relative z-0 aspect-square w-full overflow-hidden bg-slate-50/50 p-4">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="h-full w-full object-contain object-center transition-transform duration-500 ease-in-out group-hover:scale-105 mix-blend-multiply"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={product.isNew}
          />
          {/* Hover Overlay & Action Button */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30 pointer-events-none">
             <Button
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 bg-white/90 backdrop-blur-md text-slate-800 rounded-xl font-semibold shadow-lg border border-slate-200/50 px-6 h-10 flex items-center gap-2 justify-center active:scale-95 text-sm hover:bg-white hover:text-primary"
             >
               <ShoppingCart size={15} />
               {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
             </Button>
          </div>
        </div>
      </div>
      
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-30">
        {isFlashSale && (
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
            <Flame size={10} /> Flash Sale
          </span>
        )}
        {discountPercent > 0 && !isFlashSale && (
          <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            Giảm giá
          </span>
        )}
        {product.isNew && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            Mới
          </span>
        )}
        {soldCount >= 50 && !isFlashSale && !product.isNew && discountPercent === 0 && (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm">
            Bán chạy
          </span>
        )}
      </div>

      {/* Wishlist + Discount Badge */}
      <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-2 z-30">
        <button 
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 border shadow-sm",
            isFavorite 
              ? "text-rose-500 bg-rose-50 border-rose-200" 
              : "text-slate-400 bg-white border-slate-200 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200"
          )}
        >
          <Heart size={14} className={cn(isFavorite && "fill-current")} />
        </button>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 flex-1 flex flex-col p-3.5 pt-3">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/shop/${product.slug}`} className="flex-1">
            <h3 className="text-[13px] font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        {/* Variant info */}
        {variantInfo && (
          <p className="mt-1 text-[10px] text-slate-400 font-medium">
            {variantInfo}
          </p>
        )}
        
        {/* Rating + View + Sold */}
        <div className="mt-2 flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("h-2.5 w-2.5", i < Math.round(rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
              ))}
            </div>
            <span className="text-slate-700 font-semibold text-[11px]">
              {rating > 0 ? rating.toFixed(1) : "5.0"}
            </span>
            {product.reviewCount > 0 && (
              <span>({product.reviewCount})</span>
            )}
          </div>
          <span className="h-2.5 w-px bg-slate-200" />
          <div className="flex items-center gap-0.5">
            <Eye className="h-3 w-3" />
            <span>{formatSoldCount(viewCount)}</span>
          </div>
          <span className="h-2.5 w-px bg-slate-200" />
          <span className="font-medium">Đã bán {formatSoldCount(soldCount)}</span>
        </div>

        {/* Price section */}
        <div className="mt-auto pt-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-primary tabular-nums">
                {formatCurrency(price)}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="text-[10px] text-slate-400 line-through tabular-nums">
                  {formatCurrency(originalPrice)}
                </p>
              )}
            </div>
            {discountPercent > 0 && (
              <span className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                isFlashSale 
                  ? "text-orange-600 bg-orange-50 border border-orange-200" 
                  : "text-primary bg-primary/5 border border-primary/10"
              )}>
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      </div>

      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        price={price}
        originalPrice={originalPrice}
        flashSalePercent={flashSalePercent}
      />
    </div>
  );
});

 
