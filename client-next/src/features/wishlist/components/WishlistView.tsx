"use client";

import React, { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

import Image from "next/image";

export function WishlistView() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const { success } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    syncWishlist();
    setMounted(true);
  }, [syncWishlist]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
          <div className="space-y-10">
             <Skeleton className="h-6 w-40" />
             <div className="border-b border-slate-100 pb-8 space-y-4">
               <Skeleton className="h-10 w-64" />
               <Skeleton className="h-4 w-96" />
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square w-full rounded-2xl" />)}
             </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (item: any) => {
    addItem({
      productId: String(item.id),
      variantId: String(item.id), 
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      slug: item.slug,
      quantity: 1,
    });
    success(`Đã thêm ${item.name} vào giỏ hàng`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="space-y-10">
          {/* Header & Navigation */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all group w-fit"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">
                Quay lại trang chủ
              </span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-8">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                  Danh sách yêu thích
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Lưu giữ những sản phẩm bạn quan tâm nhất tại Vnest.
                </p>
              </div>
              <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-fit uppercase tracking-widest">
                <span className="text-slate-900 font-bold">{items.length}</span> sản phẩm
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 px-6">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart className="h-8 w-8 text-slate-200" />
              </div>
              <h3 className="text-slate-900 font-bold text-xl">Danh sách trống</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto font-medium">
                Hãy bắt đầu khám phá và lưu lại những sản phẩm bạn yêu thích nhé!
              </p>
              <Button
                className="mt-8 rounded-xl px-10 h-12 bg-primary hover:brightness-110 text-white font-bold transition-all shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/shop">Mua sắm ngay</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col h-full transition-all duration-300"
                >
                  {/* Card Actions Overlay */}
                  <div className="absolute top-3 right-3 z-30">
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all duration-300 border border-slate-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* ── IMAGE SECTION ── */}
                  <Link href={`/shop/${item.slug}`} className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50/50 block">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-700"
                    />
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </div>
                    )}
                  </Link>

                  {/* ── CONTENT SECTION ── */}
                  <div className="flex-1 flex flex-col py-4 px-0.5">
                    <div className="flex flex-col gap-2 mb-4">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-sm font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-bold text-slate-900 tabular-nums">
                          {formatCurrency(item.price)}
                        </p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="text-xs text-slate-400 line-through tabular-nums font-medium">
                            {formatCurrency(item.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                      >
                        <ShoppingCart size={14} />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Navigation */}
          {items.length > 0 && (
            <div className="pt-10 border-t border-slate-100 flex justify-center">
              <Button
                variant="ghost"
                className="text-slate-400 hover:text-primary font-bold text-xs transition-colors"
                asChild
              >
                <Link href="/shop" className="flex items-center gap-2">
                  Tiếp tục mua sắm <ShoppingBag size={14} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


