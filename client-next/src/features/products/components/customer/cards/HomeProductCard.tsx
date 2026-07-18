"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Star, Zap, Heart } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";
import { useCart } from "@/features/cart/hooks";
import { useFlashSale } from "@/features/discounts/hooks";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { QuickAddModal } from "./QuickAddModal";
import { animateFlyToCart } from "@/utils/animateCart";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useToast } from "@/hooks/useToast";

interface HomeProductCardProps {
  product: Product;
  variant: "featured" | "bestseller" | "toprated";
}

export const HomeProductCard = React.memo(function HomeProductCard({
  product,
  variant,
}: HomeProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const user = useAuthStore((state) => state.user);
  const { success, error } = useToast();
  const router = useRouter();
  const [isQuickAddOpen, setIsQuickAddOpen] = React.useState(false);

  const { data: flashSale } = useFlashSale();
  const firstVariant = product.variants?.[0];
  const stock = firstVariant?.stock ?? product.stock ?? 0;

  const isFavorite = isInWishlist(String(product.id));

  const isFlashSale = flashSale?.products?.some(
    (p: any) => String(p.id) === String(product.id)
  );

  const flashSalePercent = isFlashSale ? flashSale?.percentage || 0 : 0;

  const basePrice = firstVariant?.price || product.basePrice || 0;
  let regularOriginalPrice = firstVariant?.originalPrice || product.originalPrice;

  if (!regularOriginalPrice || regularOriginalPrice <= basePrice) {
    regularOriginalPrice = undefined;
  }

  const hasRegularDiscount = regularOriginalPrice && regularOriginalPrice > basePrice;

  const price = isFlashSale
    ? Math.round(basePrice * (1 - flashSalePercent / 100))
    : basePrice;

  const originalPrice = isFlashSale
    ? basePrice
    : hasRegularDiscount
      ? regularOriginalPrice
      : null;

  // Handle images
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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      error("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
      return;
    }
    toggleWishlist({
      id: String(product.id),
      variantId: firstVariant?.id || product.id,
      name: product.name,
      price: price,
      originalPrice: originalPrice || undefined,
      imageUrl: imageUrl,
      slug: product.slug,
      stock: stock,
      categoryId: product.categoryId,
      categoryName: product.category?.name || "Bộ sưu tập LUXE",
    });
    if (!isFavorite) success(`Đã thêm ${product.name} vào yêu thích`);
  };

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

  // ── BESTSELLER & FEATURED VARIANT (WARM MOCKUP STYLE) ──
  if (variant === "bestseller" || variant === "featured") {
    const bgColors = ["bg-[#E8E0D0]", "bg-[#E3E6EE]", "bg-[#EDE4DA]", "bg-[#DDE5E0]"];
    const bgClass =
      bgColors[parseInt(String(product.id || "0"), 16) % bgColors.length] ||
      "bg-[#E8E0D0]";

    return (
      <>
        <div
          onClick={() => router.push(`/shop/${product.slug}`)}
          className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-brand-sand hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(61,43,26,0.1)] transition-all duration-300 cursor-pointer"
        >
          
          <div
            className={cn(
              "relative h-[280px] w-full flex items-center justify-center overflow-hidden",
              bgClass
            )}
          >
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain p-6 transition-transform duration-500 ease-in-out group-hover:scale-105 mix-blend-multiply"
              sizes="(max-width: 768px) 50vw, 25vw"
            />

            <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
              {isFlashSale ? (
                <span className="bg-brand-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  -{discount}%
                </span>
              ) : product.isNew ? (
                <span className="bg-brand-espresso text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Mới
                </span>
              ) : null}
            </div>

            <button
              onClick={handleToggleWishlist}
              className={cn(
                "absolute top-3 right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                isFavorite
                  ? "bg-brand-accent border-brand-accent text-white"
                  : "bg-white border-brand-sand text-brand-taupe hover:bg-brand-ivory hover:text-brand-accent"
              )}
            >
              <Heart
                size={14}
                fill={isFavorite ? "currentColor" : "none"}
                strokeWidth={isFavorite ? 0 : 2}
              />
            </button>
          </div>

          
          <div className="relative z-10 flex-1 flex flex-col p-4 md:p-5">
            <div className="text-[11px] font-bold text-brand-taupe tracking-[0.1em] mb-1">
              {product.category?.name || "Bộ sưu tập LUXE"}
            </div>
            <h3 className="text-[14.5px] font-medium text-brand-espresso mb-2 line-clamp-2 leading-snug hover:text-brand-accent transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-brand-accent text-[13px] tracking-[1px]">
                  {"★".repeat(Math.round(product.averageRating || 5)) +
                    "☆".repeat(5 - Math.round(product.averageRating || 5))}
                </div>
                <span className="text-[12px] text-brand-taupe font-medium">
                  ({product.reviewCount || 0})
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-brand-taupe font-medium shrink-0">
                <span className="bg-brand-cream px-2 py-0.5 rounded-full">
                  {product.soldCount || 0} đã bán
                </span>
                <span className="flex items-center gap-1.5 bg-[#FBF9F6] border border-brand-ivory px-2 py-0.5 rounded-full">
                  <Zap size={10} className="fill-current text-brand-accent" />{" "}
                  {product.viewCount || 0} lượt xem
                </span>
              </div>
            </div>

            <div className="mt-auto pt-2 border-t border-brand-ivory flex items-baseline gap-2.5">
              <span className="text-[18px] font-bold text-brand-espresso leading-none font-serif">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[12px] text-brand-taupe line-through">
                  {formatCurrency(originalPrice)}
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
        />
      </>
    );
  }

  // ── TOP RATED VARIANT (LIST STYLE) ──
  return (
    <>
      <div
        onClick={() => router.push(`/shop/${product.slug}`)}
        className="group relative p-4 flex gap-4 bg-white rounded-2xl border border-brand-sand hover:border-brand-accent/30 hover:shadow-[0_12px_32px_rgba(61,43,26,0.08)] transition-all duration-300 cursor-pointer"
      >
        <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-white shrink-0 flex items-center justify-center border border-brand-sand/50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            sizes="96px"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between py-1">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-1 text-[11px] text-brand-taupe">
              <span className="text-brand-accent text-[10px] tracking-[1px]">★★★★★</span>
              <span>({product.reviewCount || 0})</span>
            </div>
            <h3 className="text-[13.5px] font-medium text-brand-espresso line-clamp-2 leading-snug hover:text-brand-accent transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] font-bold text-brand-espresso font-serif">
                {formatCurrency(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[11px] text-brand-taupe line-through font-medium">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
            <div className="text-[9px] font-bold text-brand-accent border border-brand-accent/30 bg-brand-accent/5 px-2 py-0.5 rounded-full">
              Top Rate
            </div>
          </div>
        </div>
      </div>
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        price={price}
        originalPrice={originalPrice}
      />
    </>
  );
});
