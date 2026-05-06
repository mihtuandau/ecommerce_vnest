"use client";

import React, { useState, useEffect } from "react";
import { useFlashSale } from "@/features/discounts/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { Product } from "@/types/models";
import { getTimeLeft } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { Zap, ChevronLeft, ShoppingCart, ShoppingBag, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";

import { QuickAddModal } from "@/features/products/components/customer/cards/QuickAddModal";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// ── Countdown ──────────────────────────────────────────────

function Countdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) {
    return (
      <span className="text-sm text-slate-400 font-medium">
        Chương trình đã kết thúc
      </span>
    );
  }

  const blocks = [
    ...(time.days > 0 ? [{ value: time.days, label: "Ngày" }] : []),
    { value: time.hours, label: "Giờ" },
    { value: time.minutes, label: "Phút" },
    { value: time.seconds, label: "Giây" },
  ];

  return (
    <div className="flex items-center gap-2">
      {blocks.map((b, i) => (
        <React.Fragment key={b.label}>
          {i > 0 && <span className="text-[#E85D24]/40 text-lg font-bold pb-5">:</span>}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 bg-[#E85D24] rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white tabular-nums">{pad(b.value)}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">{b.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────

function FlashProductCard({ product, discountPercent }: { product: Product; discountPercent: number }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success, error } = useToast();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const isFavorite = isInWishlist(String(product.id));
  const imageUrl =
    (typeof product.images?.[0] === "string" ? product.images[0] : (product.images?.[0] as any)?.url) ||
    "/placeholder.png";

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  const soldCount = product.soldCount || 0;
  const totalStock = (product.stock || 0) + soldCount;
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

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

    const variantId = variants?.[0]?.id;
    if (!variantId) {
      error("Phiên bản này hiện không khả dụng");
      return;
    }

    import("@/utils/animateCart").then(({ animateFlyToCart }) => {
      animateFlyToCart(e, imageUrl);
    });

    addItem({
      productId: String(product.id),
      variantId: String(variantId),
      name: product.name,
      price: salePrice,
      originalPrice: originalPrice || undefined,
      imageUrl,
      slug: product.slug,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist({
      id: String(product.id),
      name: product.name,
      price: salePrice,
      originalPrice,
      imageUrl,
      slug: product.slug,
      stock: product.stock || 0,
    });
    if (!isFavorite) success(`Đã thêm vào yêu thích`);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col relative h-full transition-all duration-300 hover:shadow-md cursor-pointer">
      {/* Discount badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-[#E85D24] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
          <Zap size={11} className="fill-white" />
          -{discountPercent}%
        </div>
      </div>

      {/* Image Container */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block bg-slate-50 aspect-square overflow-hidden p-6"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border border-slate-100",
            isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-500"
          )}
        >
          <Heart size={16} className={cn(isFavorite && "fill-current")} />
        </button>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {product.brand?.name && (
          <span className="text-xs text-slate-500 font-medium">
            {product.brand.name}
          </span>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 hover:text-[#E85D24] transition-colors min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Progress Section */}
        <div className="space-y-1.5">
          <div className="h-1.5 bg-orange-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#E85D24] to-[#ff8a50] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Đã bán {soldCount}</span>
            <span className={cn(soldPercent > 80 && "text-[#E85D24] font-bold")}>{soldPercent}%</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <span className="text-xl font-bold text-[#E85D24] leading-none">
              {formatCurrency(salePrice)}
            </span>
            <div className="text-[11px] text-slate-300 line-through mt-0.5">
              {formatCurrency(originalPrice)}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="h-10 w-10 rounded-xl bg-[#E85D24] text-white flex items-center justify-center shadow-none"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
      <QuickAddModal
        product={product}
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        price={salePrice}
        originalPrice={originalPrice}
      />
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────

export function FlashSaleView() {
  const { data: flashSale, isLoading } = useFlashSale();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="h-48 bg-slate-50 animate-pulse" />
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[380px] rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!flashSale || !flashSale.products?.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4 text-center gap-5">
        <div className="h-20 w-20 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
          <ShoppingBag size={36} className="text-slate-200" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-900">Sự kiện đã kết thúc</h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Hẹn gặp lại bạn ở các đợt Flash Sale tiếp theo.
          </p>
        </div>
        <Button asChild className="h-11 px-8 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800">
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* ── Hero Banner ── */}
      <section className="bg-[#E85D24] relative overflow-hidden">

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
            <div className="flex items-start md:items-center gap-4">
              <button
                onClick={() => router.back()}
                className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors shrink-0"
              >
                <ChevronLeft size={22} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap size={14} className="text-yellow-200 fill-yellow-200" />
                  <span className="text-white/80 text-xs font-semibold">Flash Sale</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight truncate">
                  Giảm đến {flashSale.percentage}%
                </h1>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 border border-white/10 w-full md:w-auto">
              <Clock size={18} className="text-white/70 shrink-0" />
              <div className="flex-1 md:flex-none">
                <p className="text-xs text-white/60 font-semibold mb-2">Kết thúc sau</p>
                <HeroCountdown endDate={flashSale.endDate} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products Grid ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{flashSale.products.length}</span> sản phẩm đang giảm giá
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {flashSale.products.map((product: Product, idx: number) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <FlashProductCard
                product={product}
                discountPercent={flashSale.percentage}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Small countdown block used in the hero
function CountdownBlock({ value }: { value: number }) {
  return (
    <div className="bg-white rounded-lg px-2.5 py-1.5 min-w-[36px] text-center">
      <span className="text-lg font-bold text-[#E85D24] tabular-nums">{pad(value)}</span>
    </div>
  );
}

// Live countdown for the hero section
function HeroCountdown({ endDate }: { endDate: string }) {
  const [time, setTime] = useState(() => getTimeLeft(endDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);

  if (!time || time.expired) return <span className="text-white/70 text-sm">Đã kết thúc</span>;

  const blocks = [
    ...(time.days > 0 ? [time.days] : []),
    time.hours, time.minutes, time.seconds
  ];

  return (
    <div className="flex items-center gap-1.5">
      {blocks.map((v, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="text-white/30 font-bold">:</span>}
          <CountdownBlock value={v} />
        </React.Fragment>
      ))}
    </div>
  );
}