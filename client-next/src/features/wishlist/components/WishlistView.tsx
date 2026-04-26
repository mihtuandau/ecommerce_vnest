"use client";

import React, { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/useToast";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Heart, ShoppingCart, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export function WishlistView() {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const { success } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleAddToCart = (item: any) => {
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
              className="flex items-center gap-2 text-slate-500 hover:text-[#1565C1] transition-all group w-fit"
            >
              <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#1565C1] group-hover:bg-blue-50 transition-all">
                <ArrowLeft size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Quay lại trang chủ
              </span>
            </Link>

            <div className="flex items-end justify-between border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Danh sách yêu thích
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Lưu giữ những sản phẩm bạn quan tâm nhất
                </p>
              </div>
              <div className="hidden sm:block text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-[#1565C1]">{items.length}</span> SẢN PHẨM
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="group border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 rounded-[1.5rem] overflow-hidden bg-white"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50 p-6">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-white transition-all duration-300"
                    >
                      <Trash2 size={16} />
                    </button>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="absolute top-4 left-4 bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                        -
                        {Math.round(
                          ((item.originalPrice - item.price) / item.originalPrice) * 100
                        )}
                        %
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-sm font-bold text-slate-800 hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-primary">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-slate-500 line-through font-semibold">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="w-full h-11 rounded-xl bg-slate-900 hover:bg-primary text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={14} />
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
                className="text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest"
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
