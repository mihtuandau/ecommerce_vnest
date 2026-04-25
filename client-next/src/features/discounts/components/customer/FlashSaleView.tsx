"use client";

import React, { useState, useEffect } from "react";
import { useFlashSale } from "@/features/discounts/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import { getTimeLeft } from "@/utils/formatDate";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { Zap, ChevronLeft, ShoppingCart, ShoppingBag, Heart, Flame } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToast } from "@/hooks/useToast";
import { Skeleton } from "@/components/ui/Skeleton";

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
      <span className="text-sm text-slate-400 font-medium bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
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
    <div className="flex items-center gap-4">
      {blocks.map((b, i) => (
        <React.Fragment key={b.label}>
          {i > 0 && <span className="text-[#e85d24]/30 text-2xl font-light pb-6">:</span>}
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-white border border-[#e85d24]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <span className="text-3xl font-bold text-[#e85d24] tabular-nums tracking-tighter">{pad(b.value)}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">{b.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────

function FlashProductCard({ product, discountPercent }: { product: any; discountPercent: number }) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  const { success } = useToast();

  const isFavorite = isInWishlist(String(product.id));
  const imageUrl =
    product.image ||
    (typeof product.images?.[0] === "string" ? product.images[0] : product.images?.[0]?.url) ||
    "/placeholder.png";

  const originalPrice = product.basePrice || 0;
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));

  const soldCount = product.soldCount || 0;
  const totalStock = (product.stock || 0) + soldCount;
  const soldPercent = Math.min(100, Math.round((soldCount / Math.max(1, totalStock)) * 100));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: String(product.id),
      variantId: String(product.id),
      name: product.name,
      price: salePrice,
      imageUrl,
      slug: product.slug,
      quantity: 1,
    });
    success(`Đã thêm ${product.name} vào giỏ hàng`);
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
    if (!isFavorite) success(`Đã thêm ${product.name} vào yêu thích`);
  };

  return (
    <div className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-[#e85d24]/5 hover:border-[#e85d24]/20 transition-all duration-500 flex flex-col relative h-full">
      {/* Discount badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-[#e85d24] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-lg shadow-[#e85d24]/20 flex items-center gap-1.5">
          <Zap size={12} className="fill-white" />
          -{discountPercent}%
        </div>
      </div>

      {/* Image Container */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block bg-[#fcfdfe] h-60 overflow-hidden p-8"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            "absolute top-4 right-4 h-10 w-10 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm bg-white/80 backdrop-blur-md border border-white",
            isFavorite ? "text-rose-500" : "text-slate-300 hover:text-rose-500"
          )}
        >
          <Heart size={18} className={cn(isFavorite && "fill-current")} />
        </button>
      </Link>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="space-y-1.5">
          {product.brand?.name && (
            <span className="text-[11px] text-slate-400 font-medium">
              {product.brand.name}
            </span>
          )}
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-base font-semibold text-slate-800 leading-tight line-clamp-2 hover:text-[#e85d24] transition-colors min-h-[44px]">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">🔥 Đã bán {soldCount}</span>
            <span className={cn(soldPercent > 80 ? "text-[#e85d24] font-bold animate-pulse" : "")}>{soldPercent}%</span>
          </div>
          <div className="h-2 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
            <div
              className="h-full bg-gradient-to-r from-[#e85d24] to-[#ff7d45] rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${soldPercent}%` }}
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-xs text-slate-300 line-through font-medium mt-1">
              {formatCurrency(originalPrice)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="h-12 w-12 rounded-2xl bg-[#e85d24] hover:bg-slate-900 text-white flex items-center justify-center transition-all duration-500 shadow-lg shadow-[#e85d24]/20 hover:scale-110 active:scale-95"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
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
        <div className="h-64 bg-slate-50 animate-pulse" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 -mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[480px] rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!flashSale || !flashSale.products?.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-20 px-4 text-center gap-6">
        <div className="h-24 w-24 rounded-[2rem] bg-slate-50 flex items-center justify-center shadow-inner">
          <ShoppingBag size={40} className="text-slate-200" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sự kiện đã kết thúc</h1>
          <p className="text-slate-400 font-medium max-w-xs mx-auto leading-relaxed">
            Hẹn gặp lại bạn ở các đợt Flash Sale tiếp theo với nhiều ưu đãi hấp dẫn hơn.
          </p>
        </div>
        <Button asChild className="h-14 px-10 rounded-full bg-slate-900 text-white font-semibold shadow-2xl hover:bg-[#e85d24] transition-all">
          <Link href="/shop">Quay lại cửa hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-24">
      {/* ── Hero ── */}
      <section className="relative bg-white overflow-hidden border-b border-slate-50">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#e85d24]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#e85d24]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_#e85d24_0%,_transparent_0.8%)] bg-[length:40px_40px] opacity-[0.03]" />
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-12 md:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            {/* Left */}
            <div className="flex items-start gap-8">
              <button
                onClick={() => router.back()}
                className="h-14 w-14 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all duration-300 hover:text-[#e85d24] shadow-sm mt-1 bg-white"
              >
                <ChevronLeft size={28} />
              </button>
              
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#e85d24]/5 border border-[#e85d24]/10">
                  <Flame size={16} className="text-[#e85d24] fill-[#e85d24] animate-pulse" />
                  <span className="text-xs font-semibold text-[#e85d24]">Đang diễn ra</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-none">
                  Flash <span className="text-[#e85d24]">Sale</span>
                </h1>
                
                <p className="text-slate-500 font-medium max-w-sm text-lg leading-relaxed">
                  Săn ngay những món đồ công nghệ yêu thích với mức giảm giá tới <span className="text-[#e85d24] font-bold">{flashSale.percentage}%</span>.
                </p>
              </div>
            </div>

            {/* Right — Countdown */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col gap-6 shadow-[0_20px_50px_rgba(232,93,36,0.05)]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-400 tracking-wider">Kết thúc sau</span>
                <div className="h-[1px] flex-1 bg-slate-100" />
              </div>
              <Countdown endDate={flashSale.endDate} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 py-20">
        <div className="flex items-center justify-between mb-16 px-2">
          <div className="flex items-center gap-4">
             <div className="h-10 w-1.5 bg-[#e85d24] rounded-full" />
             <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Sản phẩm khuyến mãi</h2>
          </div>
          <p className="text-sm font-medium text-slate-400">
            <span className="text-[#e85d24] font-bold">{flashSale.products.length}</span> sản phẩm đang giảm giá
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {flashSale.products.map((product: any, idx: number) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${idx * 100}ms` }}
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