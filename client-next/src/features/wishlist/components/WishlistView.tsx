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

export function WishlistView() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCart();
  const { success } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddToCart = (item: { id: number; name: string; price: number; imageUrl: string; slug: string }) => {
    addItem({
      productId: item.id,
      variantId: item.id, // Giả sử dùng ID sản phẩm nếu chưa chọn variant
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-10">
          {/* Header & Navigation */}
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-600 hover:text-primary transition-all group w-fit"
            >
              <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-primary group-hover:bg-blue-50 transition-all">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-semibold">
                Quay lại trang chủ
              </span>
            </Link>

            <div className="flex items-end justify-between border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Danh sách yêu thích
                </h1>
                <p className="text-slate-600 text-sm font-normal">
                  Lưu giữ những sản phẩm bạn quan tâm nhất
                </p>
              </div>
              <div className="hidden sm:block text-[10px] font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-primary">{items.length}</span> sản phẩm
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-slate-900 font-bold text-xl">Danh sách trống</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                Hãy bắt đầu khám phá và lưu lại những sản phẩm bạn yêu thích nhé!
              </p>
              <Button
                className="mt-8 rounded-full px-10 h-12 bg-primary shadow-lg shadow-blue-500/20"
                asChild
              >
                <Link href="/shop">Mua sắm ngay</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 rounded-2xl sm:rounded-[1.5rem] overflow-hidden bg-white"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 p-3 sm:p-6">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 sm:top-4 sm:right-4 h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition-all duration-300"
                    >
                      <Trash2 size={14} className="sm:size-4" />
                    </button>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-rose-500 text-white text-[10px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                        -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-xs sm:text-sm font-semibold text-slate-900 hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                        <span className="text-sm sm:text-base font-bold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-1 sm:pt-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full h-9 sm:h-11 rounded-lg sm:rounded-xl bg-primary hover:bg-[#0d47a1] text-white text-[11px] sm:text-xs font-bold shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                      >
                        <ShoppingCart size={14} className="sm:size-4" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Recently Viewed or Recommendations could go here */}
          {items.length > 0 && (
            <div className="pt-10 border-t border-slate-100 flex justify-center">
              <Button
                variant="ghost"
                className="text-slate-500 hover:text-primary font-semibold text-xs transition-colors"
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
