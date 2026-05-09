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

  // ── LIST VIEW VARIANT ──
  if (view === "list") {
    return (
      <div className="group relative flex gap-6 bg-white rounded-2xl overflow-hidden transition-all duration-300">

        {/* ── IMAGE SECTION ── */}
        <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 shrink-0 overflow-hidden rounded-2xl bg-slate-50/50 cursor-pointer">
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
              sizes="(max-width: 768px) 128px, 192px"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Wishlist Button - Moved outside Image Section to be on top of the z-20 Link */}
        <button 
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-2 left-[118px] md:left-[178px] h-7 w-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-30",
            isFavorite ? "text-rose-500 bg-white" : "text-gray-400 bg-white hover:text-rose-500"
          )}
        >
          <Heart size={14} className={cn(isFavorite && "fill-current")} />
        </button>

        {/* ── CONTENT SECTION ── */}
        <div className="relative z-10 flex-1 flex flex-col py-2">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
              <Link href={`/shop/${product.slug}`}>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-[12px] text-gray-500 font-medium">
                {product.brand?.name || "Minh Tuấn Shop"}
              </p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <p className="text-sm font-bold text-gray-900 tabular-nums">
                {formatCurrency(price)}
              </p>
              {originalPrice && originalPrice > price && (
                <p className="text-[11px] text-gray-400 line-through tabular-nums font-medium">
                  {formatCurrency(originalPrice)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 flex-1">
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description || "Sản phẩm chính hãng chất lượng cao từ Minh Tuấn Shop."}
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[11px] text-gray-900 font-medium">
                  {rating > 0 ? rating.toFixed(1) : "5.0"}
                </span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-[11px] text-gray-500">
                Đã bán {soldCount}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[11px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="relative h-9 px-4 rounded-xl bg-slate-900 text-white hover:bg-primary font-bold text-xs shadow-lg transition-all active:scale-95 z-20"
            >
              <ShoppingCart size={14} className="mr-2" />
              {isOutOfStock ? "Hết hàng" : "Thêm nhanh"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW VARIANT ──
  return (
    <div className="group relative flex flex-col h-full cursor-pointer">

      {/* ── IMAGE SECTION ── */}
      <div className="relative z-0 aspect-square w-full overflow-hidden rounded-2xl bg-slate-50/50">
        <div className="relative h-full w-full">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1"
            sizes="(max-width: 768px) 50vw, 25vw"
            priority={product.isNew}
          />
          {/* Hover Overlay & Action Button */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
             <Button
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/60 backdrop-blur-md text-slate-900 rounded-xl font-semibold shadow-sm border border-white/20 px-8 h-10 flex items-center justify-center active:scale-95 text-sm hover:bg-white/60 hover:text-slate-900"
             >
               {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
             </Button>
          </div>
        </div>
      </div>
      
      {/* Badges & Actions Overlay - Moved outside to be on top of z-20 Link */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-30">
        {product.isNew && (
          <span className="bg-white text-gray-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            Mới
          </span>
        )}
        {discountPercent > 0 && !product.isNew && (
          <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            Giảm {discountPercent}%
          </span>
        )}
      </div>

      <button 
        type="button"
        onClick={handleToggleWishlist}
        className={cn(
          "absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-30",
          isFavorite ? "text-rose-500 bg-white" : "text-gray-400 bg-white hover:text-rose-500"
        )}
      >
        <Heart size={16} className={cn(isFavorite && "fill-current")} />
      </button>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 mt-4 flex-1 flex flex-col px-0.5">
        <div className="flex justify-between items-start gap-4">
          <Link href={`/shop/${product.slug}`} className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end shrink-0">
            <p className="text-sm font-bold text-gray-900 tabular-nums">
              {formatCurrency(price)}
            </p>
            {originalPrice && originalPrice > price && (
              <p className="text-[11px] text-gray-400 line-through tabular-nums font-medium">
                {formatCurrency(originalPrice)}
              </p>
            )}
          </div>
        </div>
        
        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
          {product.brand?.name || "Minh Tuấn Shop"}
        </p>
        
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] text-gray-900 font-medium">
                {rating > 0 ? rating.toFixed(1) : "5.0"}
              </span>
            </div>
            <span className="text-[11px] text-gray-300">|</span>
            <span className="text-[11px] text-gray-500">
              Đã bán {soldCount}
            </span>
          </div>

          {originalPrice && originalPrice > price && (
            <span className="text-[11px] text-rose-500 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
              -{discountPercent}%
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
});

