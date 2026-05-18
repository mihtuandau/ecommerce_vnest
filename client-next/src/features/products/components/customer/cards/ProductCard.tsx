"use client";

import React, { useMemo } from "react";
import { Product } from "@/types/models";
import { formatCurrency } from "@/utils/formatCurrency";
import { ShoppingCart, Star, Heart, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import { useFlashSale, useDiscounts } from "@/features/discounts/hooks";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { QuickAddModal } from "./QuickAddModal";
import { animateFlyToCart } from "@/utils/animateCart";
import { calculateDiscountedPrice } from "@/features/discounts/utils/discount";

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
  const { data: discountsData } = useDiscounts({ type: "PROMOTION" }); // Only get auto-applied promotions
  const router = useRouter();
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);

  const parsePrice = (val: string | number | undefined | null): number => {
    let num = 0;
    if (typeof val === "number") num = val;
    else if (typeof val === "string") num = parseFloat(val.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const basePrice = parsePrice(product.price || product.basePrice);
  
  const allDiscounts = useMemo(() => {
    const fs = Array.isArray(flashSale) ? flashSale : [];
    const ds = Array.isArray(discountsData) ? discountsData : [];
    return [...fs, ...ds];
  }, [flashSale, discountsData]);

  const price = calculateDiscountedPrice(product, allDiscounts);
  const isDiscounted = price < basePrice;

  const originalPriceVal = product.variants?.[0]?.originalPrice || product.originalPrice;
  const originalPrice = isDiscounted ? basePrice : originalPriceVal ? parsePrice(originalPriceVal) : null;

  const discountPercent = originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  let images = product.images;
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch (e) { images = []; }
  }
  const rawImage = Array.isArray(images) ? images[0] : null;
  const imageUrl = getImageUrl(typeof rawImage === "string" ? rawImage : (rawImage as any)?.url);

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
    if (!isFavorite) success(`Đã thêm ${product.name} vào yêu thích`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    const variants = product.variants || [];
    if (variants.length > 1 || variants.some(v => v.size || v.color)) {
      setIsQuickAddOpen(true); return;
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

  const formatSoldCount = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
    return count.toString();
  };

  const soldCount = product.soldCount || 0;
  const rating = product.averageRating || 5;

  // ── LIST VIEW ──
  if (view === "list") {
    return (
      <>
        <div 
          onClick={() => router.push(`/shop/${product.slug}`)}
          className="group relative flex bg-white rounded-2xl border border-brand-sand hover:border-brand-bronze/30 hover:shadow-[0_16px_48px_rgba(61,43,26,0.1)] transition-all duration-500 overflow-hidden cursor-pointer"
        >
          <div className="relative h-40 w-40 md:h-48 md:w-48 bg-brand-ivory flex-shrink-0 flex items-center justify-center p-4">
            <Image src={imageUrl} alt={product.name} fill className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply" sizes="(max-width: 768px) 160px, 192px" />
          </div>

          <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-brand-taupe uppercase tracking-[0.12em]">{product.category?.name || "Luxurious"}</p>
                  <h3 className="text-[16px] md:text-[18px] font-medium text-primary leading-tight hover:text-brand-bronze transition-colors">{product.name}</h3>
                </div>
                <button onClick={handleToggleWishlist} className={cn("relative z-30 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300", isFavorite ? "bg-brand-bronze border-brand-bronze text-white" : "bg-white border-brand-sand text-brand-taupe hover:bg-brand-cream hover:text-brand-bronze")}>
                  <Heart size={14} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="text-brand-bronze text-[13px]">★★★★★</div>
                  <span className="text-[12px] text-brand-taupe/40">({product.reviewCount || 0})</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-brand-taupe font-medium">
                  <span className="bg-brand-cream px-2 py-0.5 rounded-full">{formatSoldCount(soldCount)} đã bán</span>
                  <span className="flex items-center gap-1.5 bg-brand-ivory/50 border border-brand-ivory px-2 py-0.5 rounded-full">
                    <Zap size={10} className="fill-current text-brand-bronze" /> {product.viewCount || 0} lượt xem
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-[#8A7966] line-clamp-2 leading-relaxed max-w-xl">{product.description || "Sản phẩm thiết kế sang trọng, chất liệu cao cấp mang lại sự thoải mái và phong cách cho người mặc."}</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-baseline gap-3">
                <span className="text-[22px] font-bold text-primary leading-none font-sans">{formatCurrency(price)}</span>
                {originalPrice && originalPrice > price && <span className="text-[14px] text-brand-taupe/80 line-through font-medium">{formatCurrency(originalPrice)}</span>}
              </div>
              <button onClick={handleAddToCart} className="relative z-30 flex items-center gap-2 px-5 h-10 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-widest hover:bg-brand-bronze transition-all duration-300">
                <ShoppingCart size={14} /> Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
        <QuickAddModal product={product} isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} price={price} originalPrice={originalPrice} />
      </>
    );
  }

  // ── GRID VIEW ──
  return (
    <>
      <div 
        onClick={() => router.push(`/shop/${product.slug}`)}
        className="group relative flex flex-col h-full bg-white rounded-2xl border border-brand-sand hover:border-brand-bronze/30 hover:shadow-[0_16px_48px_rgba(61,43,26,0.1)] transition-all duration-500 overflow-hidden cursor-pointer"
      >
        <div className="relative h-[280px] w-full bg-brand-ivory overflow-hidden flex items-center justify-center">
          <Image src={imageUrl} alt={product.name} fill className="object-contain p-8 transition-transform duration-700 ease-out group-hover:scale-105 mix-blend-multiply" sizes="(max-width: 768px) 50vw, 25vw" />
          <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5">
            {discountPercent > 0 && <span className="bg-brand-bronze text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">-{discountPercent}%</span>}
            {product.isNew && <span className="bg-primary text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">Mới</span>}
          </div>
          <button onClick={handleToggleWishlist} className={cn("absolute top-4 right-4 z-30 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300", isFavorite ? "bg-brand-bronze border-brand-bronze text-white" : "bg-white/80 backdrop-blur-sm border-brand-sand text-brand-taupe hover:bg-white hover:text-brand-bronze")}>
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} strokeWidth={isFavorite ? 0 : 2} />
          </button>
        </div>

        <div className="p-4 md:p-5 flex flex-col flex-1">
          <div className="mb-2">
            <p className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.1em] mb-1">{product.category?.name || "Bộ sưu tập LUXE"}</p>
            <h3 className="text-[14.5px] font-medium text-primary mb-2 line-clamp-2 leading-snug hover:text-brand-bronze transition-colors min-h-[40px]">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-brand-bronze text-[13px] tracking-[1px]">
                 {"★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))}
              </div>
              <span className="text-[12px] text-brand-taupe/80 font-medium">({product.reviewCount || 0})</span>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-brand-taupe/80 font-medium shrink-0">
              <span className="bg-brand-cream px-2 py-0.5 rounded-full">{formatSoldCount(soldCount)} đã bán</span>
              <span className="flex items-center gap-1.5 bg-brand-ivory/50 border border-brand-ivory px-2 py-0.5 rounded-full">
                <Zap size={10} className="fill-current text-brand-bronze" /> {product.viewCount || 0}
              </span>
            </div>
          </div>
          
          <div className="mt-auto pt-3 border-t border-brand-ivory flex items-end justify-between gap-2">
            <div className="flex items-baseline gap-2 min-w-0">
              <span className="text-[16px] font-bold text-primary leading-none font-serif truncate">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[11px] text-brand-taupe/80 line-through font-medium whitespace-nowrap">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <button 
              onClick={handleAddToCart} 
              className="relative z-30 h-9 w-9 shrink-0 rounded-full bg-primary text-white flex items-center justify-center hover:bg-brand-bronze transition-all duration-300 shadow-sm"
            >
              <ShoppingCart size={15} />
            </button>
          </div>
        </div>
      </div>
      <QuickAddModal product={product} isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} price={price} originalPrice={originalPrice} />
    </>
  );
});
