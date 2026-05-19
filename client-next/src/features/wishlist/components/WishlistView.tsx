"use client";

import React, { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCart } from "@/features/cart/hooks";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Trash2, ChevronLeft, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState, Price } from "@/components/ui";

import Image from "next/image";

export function WishlistView() {
  const router = useRouter();
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const { success } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-10">
            <Skeleton className="h-6 w-40" />
            <div className="border-b border-brand-sand/50 pb-8 space-y-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-2xl" />
              ))}
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
    <div className="min-h-screen bg-brand-cream font-sans-brand">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="space-y-10">
          {/* Header & Navigation */}
          <div className="space-y-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 text-[13px] text-brand-taupe hover:text-brand-espresso transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Quay lại</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-sand pb-8">
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-espresso font-serif-brand tracking-tight">
                  Danh sách{" "}
                  <em className="italic text-brand-bronze font-medium font-serif-brand">
                    yêu thích
                  </em>
                </h1>
                <p className="text-brand-taupe text-sm font-medium">
                  Lưu giữ những sản phẩm bạn quan tâm nhất.
                </p>
              </div>
              <div className="text-[10px] font-bold text-brand-taupe bg-white px-4 py-2 rounded-xl border border-brand-sand w-fit uppercase tracking-widest shadow-sm">
                <span className="text-brand-espresso font-bold">{items.length}</span>{" "}
                sản phẩm
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Danh sách trống"
              description="Hãy bắt đầu khám phá và lưu lại những sản phẩm bạn yêu thích nhé!"
              actionText="Mua sắm ngay"
              onAction={() => router.push("/shop")}
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col h-full bg-white rounded-2xl border border-brand-sand p-2 transition-all duration-300 hover:shadow-xl hover:shadow-brand-espresso/5"
                >
                  {/* Card Actions Overlay */}
                  <div className="absolute top-4 right-4 z-30">
                    <Button
                      onClick={() => removeFromWishlist(item.id)}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-brand-taupe hover:text-red-500 transition-all duration-300 border border-brand-sand/50 shadow-none hover:bg-white"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>

                  {/* ── IMAGE SECTION ── */}
                  <Link
                    href={`/shop/${item.slug}`}
                    className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-brand-cream/50 block"
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                    />
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="absolute top-4 left-4 bg-brand-bronze text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-widest">
                        -
                        {Math.round(
                          ((item.originalPrice - item.price) / item.originalPrice) * 100
                        )}
                        %
                      </div>
                    )}
                  </Link>

                  {/* ── CONTENT SECTION ── */}
                  <div className="flex-1 flex flex-col py-5 px-3">
                    <div className="flex flex-col gap-1.5 mb-4">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-[14px] font-bold text-brand-espresso hover:text-brand-bronze transition-colors line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <Price amount={item.price} originalAmount={item.originalPrice} showBadge size="md" />
                    </div>

                    <div className="mt-auto">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full h-11 rounded-xl bg-brand-espresso hover:bg-brand-espresso/90 text-white text-[12px] font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={15} />
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
            <div className="pt-12 border-t border-brand-sand flex justify-center">
              <Button
                variant="ghost"
                className="text-brand-taupe hover:text-brand-espresso font-bold text-sm transition-colors rounded-full"
                asChild
              >
                <Link href="/shop" className="flex items-center gap-2">
                  Tiếp tục khám phá <ShoppingBag size={16} />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
