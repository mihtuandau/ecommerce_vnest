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

  // Lấy dữ liệu thực tế từ Database
  const soldCount = product.soldCount || 0;
  
  // Tính tổng kho từ các phiên bản nếu kho chính bằng 0
  const variantsStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;
  const stock = (product.stock || 0) > 0 ? product.stock : variantsStock;
  
  const totalStock = stock + soldCount;
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
    <div className="group bg-white border border-slate-200/60 rounded-2xl overflow-hidden flex flex-col relative h-full transition-all duration-300 hover:shadow-xl hover:border-orange-500/20 cursor-pointer">
      {/* Discount badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-gradient-to-r from-[#E85D24] to-[#ff8a50] text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-lg shadow-[#E85D24]/20 animate-pulse">
          <Zap size={10} className="fill-white" />
          -{discountPercent}%
        </div>
      </div>

      {/* Image Container */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block bg-white aspect-square overflow-hidden p-5"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all bg-white shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0",
            isFavorite ? "text-rose-500 opacity-100 translate-x-0" : "text-slate-300 hover:text-rose-500"
          )}
        >
          <Heart size={16} className={cn(isFavorite && "fill-current")} />
        </button>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-4 pt-2 gap-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between h-4">
            {product.brand?.name ? (
              <span className="text-[11px] text-[#E85D24] font-bold uppercase tracking-widest opacity-80">
                {product.brand.name}
              </span>
            ) : <div />}
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star size={10} className="fill-yellow-500 text-yellow-500" />
              <span className="text-[11px] font-bold text-yellow-700">
                {product.averageRating && product.averageRating > 0 
                  ? product.averageRating.toFixed(1) 
                  : "N/A"}
              </span>
            </div>
          </div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-[#E85D24] transition-colors min-h-[40px]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Progress Section */}
        <div className="space-y-2.5">
          <div className="relative h-6 bg-orange-50 rounded-full overflow-hidden border border-orange-100/50 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#E85D24] via-[#f36b32] to-[#ff8a50] rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${soldPercent}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[progress-stripe_1.5s_linear_infinite]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-tight transition-colors duration-500",
                soldPercent > 50 ? "text-white" : "text-[#E85D24]"
              )}>
                {soldPercent >= 90 ? "⚡ Sắp cháy hàng" : `🔥 Đã bán ${soldCount}`}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-[#E85D24] animate-pulse" />
               <span className="text-[11px] font-bold text-slate-500">Còn lại: <span className="text-slate-900 font-black">{stock}</span></span>
             </div>
            <span className="text-[11px] font-black text-[#E85D24]">{soldPercent}%</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div className="space-y-0">
            <div className="text-[10px] text-slate-400 line-through font-bold">
              {formatCurrency(originalPrice)}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#E85D24] tracking-tighter">
                {formatCurrency(salePrice)}
              </span>
              <span className="text-[9px] font-bold text-[#E85D24] opacity-80 uppercase">đ</span>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="h-10 w-10 rounded-full bg-[#E85D24] text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm"
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

// Add global styles for stripe animation
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes progress-stripe {
      from { background-position: 0 0; }
      to { background-position: 20px 0; }
    }
  `;
  document.head.appendChild(style);
}

import { Star } from "lucide-react";

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
      <section className="bg-gradient-to-br from-[#E85D24] via-[#f36b32] to-[#ff8a50] relative overflow-hidden shadow-2xl shadow-[#E85D24]/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Zap className="absolute top-[-10%] left-[-5%] w-64 h-64 text-white/5 rotate-12 animate-pulse" />
          <Zap className="absolute bottom-[-10%] right-[-5%] w-80 h-80 text-white/5 -rotate-12 animate-bounce duration-[3000ms]" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />
          
          {/* Subtle lightning bolt pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/flash-it.png')] mix-blend-overlay" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-10">
            <div className="flex items-start md:items-center gap-4 md:gap-6">
              <button
                onClick={() => router.back()}
                className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all hover:scale-105 active:scale-95 border border-white/10 shrink-0"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest shadow-lg shadow-yellow-400/20">
                    Hot Deal
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-[11px] font-bold uppercase tracking-wider">
                    <Zap size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    Sự kiện đang diễn ra
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-sm">
                  Flash Sale <span className="text-yellow-300">Giảm đến {flashSale.percentage}%</span>
                </h1>
                <p className="mt-2 text-white/70 text-sm md:text-base font-medium max-w-xl">
                  Cơ hội vàng để sở hữu những sản phẩm công nghệ hàng đầu với mức giá chưa từng có. 
                  <span className="hidden sm:inline"> Số lượng có hạn!</span>
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/20 backdrop-blur-xl rounded-[2.5rem] px-8 py-6 border border-white/10 shadow-2xl group transition-all hover:bg-black/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 group-hover:scale-110 transition-transform">
                  <Clock size={20} className="text-[#E85D24]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Kết thúc sau</p>
                  <HeroCountdown endDate={flashSale.endDate} />
                </div>
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
          {flashSale.products.map((product: Product) => (
            <div key={product.id}>
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