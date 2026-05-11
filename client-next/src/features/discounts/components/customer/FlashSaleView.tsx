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
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/features/cart/hooks";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";
import { getImageUrl } from "@/utils/image";

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
            <span className="text-xs text-slate-500 font-semibold">{b.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────

function FlashProductCard({ product: rawProduct, discountPercent }: { product: any; discountPercent: number }) {
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success, error } = useToast();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const product = rawProduct.product || rawProduct;
  const isFavorite = isInWishlist(String(product.id));
  
  // Handle image path correctly
  let images = product.images;
  if (typeof images === "string") {
    try { images = JSON.parse(images); } catch (e) { images = []; }
  }
  const rawImage = Array.isArray(images) ? images[0] : null;
  const imageUrl = getImageUrl(typeof rawImage === "string" ? rawImage : (rawImage as any)?.url);

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  // Use flash sale specific sold/stock if available
  const soldCount = rawProduct.sold ?? product.soldCount ?? 0;
  const variantsStock = product.variants?.reduce((acc: number, v: any) => acc + (v.stock || 0), 0) || 0;
  const stock = rawProduct.stock ?? ((product.stock || 0) > 0 ? product.stock : variantsStock);
  const totalStock = rawProduct.totalStock || (stock + soldCount);
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variants = product.variants || [];
    if (variants.length > 1 || variants.some((v: any) => v.size || v.color)) {
      setIsQuickAddOpen(true);
      return;
    }
    const variantId = variants?.[0]?.id;
    if (!variantId) { error("Sản phẩm tạm hết hàng"); return; }
    import("@/utils/animateCart").then(({ animateFlyToCart }) => { animateFlyToCart(e, imageUrl); });
    addItem({
      productId: String(product.id),
      variantId: String(variantId),
      name: product.name,
      price: salePrice,
      originalPrice,
      imageUrl,
      slug: product.slug,
      quantity: 1,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="group relative flex flex-col h-full bg-white rounded-3xl cursor-pointer p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(232,93,36,0.12)] hover:-translate-y-1 border border-slate-100/50">

      {/* ── IMAGE SECTION ── */}
      <div className="relative z-30 aspect-square w-full overflow-hidden rounded-2xl bg-slate-50/30">
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="h-full w-full object-cover object-center transition-all duration-1000 ease-in-out group-hover:scale-110 group-hover:rotate-2"
            sizes="(max-width: 768px) 50vw, 20vw"
          />
          {/* Hover Overlay & Action Button */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-50">
            <button
              onClick={handleAddToCart}
              className="transition-all duration-500 bg-white/60 backdrop-blur-md text-slate-900 rounded-xl font-semibold shadow-sm border border-white/20 px-6 h-9 flex items-center justify-center active:scale-95 text-sm hover:bg-white/60 hover:text-slate-900"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
        
        <div className="absolute top-2 left-2 z-30">
          <div className="bg-gradient-to-r from-[#E85D24] to-[#ff8a50] text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg shadow-orange-500/20 flex items-center gap-1 uppercase tracking-wider">
            <Zap size={10} className="fill-white animate-pulse" />
            -{discountPercent}%
          </div>
        </div>

        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-2 right-2 h-9 w-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm z-30",
            isFavorite ? "text-rose-500 bg-white" : "text-gray-400 bg-white hover:text-rose-500 opacity-0 group-hover:opacity-100 hover:scale-110"
          )}
        >
          <Heart size={16} className={cn(isFavorite && "fill-current")} />
        </button>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="relative z-10 mt-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="space-y-1">
            <Link href={`/shop/${product.slug}`}>
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-[#E85D24] transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E85D24] bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-tight">
                {product.brand?.name || "Minh Tuấn"}
              </span>
              <div className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-900 font-bold">
                  {product.averageRating || "5.0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-[#E85D24] tabular-nums tracking-tight">
            {formatCurrency(salePrice)}
          </span>
          <span className="text-xs text-gray-400 line-through tabular-nums font-medium">
            {formatCurrency(originalPrice)}
          </span>
        </div>
        
        {/* Progress Row */}
        <div className="mt-auto">
          <div className="space-y-1.5">
            <div className="relative h-1.5 bg-orange-100/30 rounded-full overflow-hidden border border-orange-100/10">
              <div
                className="h-full bg-gradient-to-r from-[#E85D24] via-[#f36b32] to-[#ff8a50] rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${soldPercent}%` }}
              >
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] animate-[progress-stripe_1s_linear_infinite]" />
              </div>
            </div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
              <span className="text-[#E85D24]">Đã bán {soldCount}</span>
              <span className="text-gray-400">Còn {stock}</span>
            </div>
          </div>
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
                  <div className="bg-yellow-400 text-slate-900 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-widest shadow-lg shadow-yellow-400/20">
                    Hot Deal
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-xs font-bold uppercase tracking-wider">
                    <Zap size={12} className="text-yellow-300 fill-yellow-300 animate-pulse" />
                    Sự kiện đang diễn ra
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-sm">
                  Flash Sale <span className="text-yellow-300">Giảm đến {flashSale.percentage}%</span>
                </h1>
                <p className="mt-2 text-white/70 text-sm md:text-base font-medium max-w-xl">
                  Cơ hội vàng để sở hữu những sản phẩm công nghệ hàng đầu với mức giá chưa từng có. 
                  <span className="hidden sm:inline"> Số lượng có hạn!</span>
                </p>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/20 backdrop-blur-xl rounded-4xl px-8 py-6 border border-white/10 shadow-2xl group transition-all hover:bg-black/30">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20 group-hover:scale-110 transition-transform">
                  <Clock size={20} className="text-[#E85D24]" />
                </div>
                <div>
                  <p className="text-xs text-white/50 font-bold uppercase tracking-widest">Kết thúc sau</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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