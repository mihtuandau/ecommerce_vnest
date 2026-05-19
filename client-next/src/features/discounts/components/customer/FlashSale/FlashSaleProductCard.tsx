"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Zap } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { getImageUrl } from "@/utils/image";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/useToast";
import { useRouter } from "next/navigation";
import { QuickAddModal } from "@/features/products/components/customer/cards/QuickAddModal";
import { cn } from "@/utils/cn";
import { getSessionStatus } from "../../../utils/flashSaleUtils";

interface FlashSaleProductCardProps {
  product: any;
  session: any;
  nextSession?: any;
}

export function FlashSaleProductCard({
  product,
  session,
  nextSession,
}: FlashSaleProductCardProps) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const user = useAuthStore((state) => state.user);
  const { success, error } = useToast();
  const router = useRouter();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const isFavorite = isInWishlist(String(product.id));
  const status = getSessionStatus(session.startDate, session.endDate);

  const images = product.images || [];
  const imageUrl = getImageUrl(images[0]?.url || images[0]);

  const originalPrice = product.basePrice || 0;
  let salePrice = originalPrice;
  let discountPercent = 0;
  let appliedFixedAmount = 0;

  const hasProductDiscount = product.percentage || product.fixedAmount;
  const targetSource = hasProductDiscount ? product : session;

  if (targetSource.fixedAmount) {
    appliedFixedAmount = targetSource.fixedAmount;
    salePrice = Math.max(0, originalPrice - appliedFixedAmount);
    discountPercent =
      targetSource.percentage || Math.round((appliedFixedAmount / originalPrice) * 100);
  } else if (targetSource.percentage) {
    discountPercent = targetSource.percentage;
    salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
  }

  const soldCount = product.soldCount || 0;
  const totalAllocated = product.stockLimit || 10;
  const remaining = Math.max(0, totalAllocated - soldCount);
  const soldPercent = Math.min(
    100,
    Math.round((soldCount / Math.max(totalAllocated, 1)) * 100)
  );
  const isSoldOut = remaining <= 0;

  const nextStartTime = nextSession
    ? new Date(nextSession.startDate).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;
  const isNextToday = nextSession
    ? new Date(nextSession.startDate).toDateString() === new Date().toDateString()
    : true;

  const colors = useMemo(() => {
    const vColors = (product.variants || [])
      .map((v: any) => v.color)
      .filter((c: string) => !!c);
    return Array.from(new Set(vColors));
  }, [product.variants]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status === "ENDED") return;
    if (status === "SOON") {
      success("Chúng tôi sẽ thông báo cho bạn ngay khi phiên này bắt đầu!");
      return;
    }

    const variants = product.variants || [];
    if (variants.length > 1 || variants.some((v: any) => v.size || v.color)) {
      setIsQuickAddOpen(true);
      return;
    }

    addItem({
      productId: String(product.id),
      variantId: String(variants?.[0]?.id),
      name: product.name,
      price: salePrice,
      originalPrice,
      imageUrl,
      slug: product.slug,
      quantity: 1,
    });
    success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white border border-[#DDD6C8] rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(61,43,26,0.1)]",
        isSoldOut && "opacity-60 pointer-events-none"
      )}
    >
      <div className="relative aspect-square bg-gradient-to-br from-[#F3EFE8] to-[#E8E0D0] flex items-center justify-center overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-[10px] left-[10px] z-10 bg-gradient-to-br from-[#E8320A] to-[#FF6B35] text-white text-[13px] font-extrabold px-[11px] py-1 rounded-full shadow-[0_2px_8px_rgba(232,50,10,0.4)] tracking-wide">
          -{discountPercent}%
        </div>

        {product.badge && (
          <div className="absolute top-[10px] right-[10px] z-10 bg-[#C44040] text-white text-[10px] font-bold px-[9px] py-1 rounded-full uppercase tracking-tighter shadow-sm">
            {product.badge === "hot"
              ? "HOT"
              : product.badge === "last"
                ? "SẮP HẾT"
                : product.badge.toUpperCase()}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) {
              error("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
              return;
            }
            toggleWishlist(product);
            if (!isFavorite) success(`Đã thêm ${product.name} vào yêu thích`);
          }}
          className={cn(
            "absolute top-[10px] right-[10px] w-[30px] h-[30px] rounded-full flex items-center justify-center bg-white border border-[#DDD6C8] transition-all z-20",
            isFavorite
              ? "text-[#C4783A] bg-[#F0D5BB] border-[#C4783A]"
              : "text-[#8A7966] opacity-0 group-hover:opacity-100",
            product.badge && "top-[40px]"
          )}
        >
          <Heart size={14} className={isFavorite ? "fill-current" : ""} />
        </button>

        <div className="absolute inset-0 bg-[#3D2B1A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-[56px] z-10">
          <button
            onClick={handleAddToCart}
            className="bg-white text-[#3D2B1A] px-[22px] py-[9px] rounded-full text-[12.5px] font-medium shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-[#3D2B1A] hover:text-[#FAF8F4] transition-all"
          >
            + Thêm vào giỏ
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white/92 p-[12px] z-20">
          <div className="flex justify-between text-[10.5px] font-bold mb-1 uppercase tracking-wider">
            <span className="text-[#E8320A]">Đã bán {soldPercent}%</span>
            <span className="text-[#8A7966]">
              {isSoldOut ? "Hết hàng" : `Còn ${remaining} sp`}
            </span>
          </div>
          <div className="h-[5px] bg-[#DDD6C8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E8320A] to-[#FF6B35] transition-all duration-1000"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center z-30">
            <span className="text-[14px] font-bold text-[#8A7966] uppercase tracking-widest">
              Hết hàng
            </span>
            {nextStartTime && (
              <span className="text-[11px] text-[#8A7966]">
                Phiên {isNextToday ? "tiếp theo" : "ngày mai"} {nextStartTime}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-[14px] pb-[16px] flex-1 flex flex-col">
        <div className="text-[10.5px] text-[#8A7966] uppercase tracking-[0.1em] mb-[3px] font-medium">
          {product.brand?.name || "Luxe Elite"}
        </div>
        <Link
          href={`/shop/${product.slug}`}
          className="text-[13.5px] font-medium text-[#3D2B1A] line-clamp-2 leading-relaxed mb-[7px] group-hover:text-[#E8320A] transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 mb-[10px]">
          <div className="flex text-[#C4783A] text-[11px] tracking-widest">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.floor(product.averageRating || 5) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-[11px] text-[#8A7966]">
            ({product.reviewCount || 0})
          </span>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-serif text-[20px] font-semibold text-[#E8320A]">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-[13px] text-[#8A7966] line-through font-medium">
              {formatCurrency(originalPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {colors.slice(0, 3).map((c: any) => (
                <div
                  key={c}
                  className="w-[13px] h-[13px] rounded-full border border-[rgba(0,0,0,0.1)]"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={status === "ENDED"}
              className={cn(
                "px-[14px] py-[8px] rounded-[8px] text-[12px] font-medium transition-all whitespace-nowrap",
                status === "LIVE"
                  ? "bg-[#3D2B1A] hover:bg-[#E8320A] text-[#FAF8F4] shadow-sm"
                  : status === "SOON"
                    ? "bg-white border border-[#DDD6C8] text-[#8A7966] hover:bg-[#FAF8F4]"
                    : "bg-[#F3EFE8] text-[#8A7966] opacity-60 cursor-not-allowed"
              )}
            >
              {status === "LIVE"
                ? "Mua ngay"
                : status === "SOON"
                  ? "Nhắc tôi"
                  : "Đã kết thúc"}
            </button>
          </div>
        </div>
      </div>

      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        price={salePrice}
        originalPrice={originalPrice}
        flashSalePercent={discountPercent}
        flashSaleFixedAmount={appliedFixedAmount}
      />
    </div>
  );
}
