"use client";

import React from "react";
import { Star, ShoppingBag, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";
import { cn } from "@/utils/cn";

interface DetailReviewProps {
  orderItems: any[];
  onReviewSubmit?: (itemId: number, rating: number, comment: string) => void;
  isReviewed?: boolean;
}

export function DetailReview({
  orderItems,
  onReviewSubmit,
  isReviewed,
}: DetailReviewProps) {
  const [ratings, setRatings] = React.useState<Record<number, number>>({});
  const [comments, setComments] = React.useState<Record<number, string>>({});

  const handleRate = (itemId: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [itemId]: rating }));
  };

  const handleComment = (itemId: number, comment: string) => {
    setComments((prev) => ({ ...prev, [itemId]: comment }));
  };

  const unreviewedItems = orderItems.filter((item) => !item.isReviewed);

  if (unreviewedItems.length === 0) {
    return (
      <div className="mt-8 p-10 bg-emerald-50 border border-emerald-100 rounded-[24px] text-center space-y-3">
        <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
          <Star fill="currentColor" size={24} />
        </div>
        <p className="text-sm font-bold text-emerald-800">
          Cảm ơn bạn! Bạn đã đánh giá tất cả sản phẩm trong đơn này.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white border border-[#DDD6C8] rounded-[24px] overflow-hidden shadow-sm font-sans-brand">
      <div className="px-8 py-6 border-b border-[#DDD6C8] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Star className="text-[#C4783A]" size={20} />
          <h3 className="text-[10px] font-black text-[#3D2B1A] uppercase tracking-[0.25em]">
            Đánh giá sản phẩm
          </h3>
        </div>
        <span className="text-[10px] font-black text-[#8A7966] uppercase tracking-[0.2em] opacity-60">
          {unreviewedItems.length} sản phẩm chờ đánh giá
        </span>
      </div>

      <div className="divide-y divide-[#DDD6C8]/30">
        {orderItems.map((item) => (
          <div
            key={item.id}
            className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="h-20 w-16 relative rounded-lg overflow-hidden border border-[#DDD6C8] bg-[#F3EFE8]">
                <Image
                  src={getImageUrl(
                    item.variant?.images?.[0] || item.variant?.product?.images?.[0]
                  )}
                  alt={item.productName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <p className="text-[10px] font-black text-[#8A7966] uppercase tracking-[0.2em] mb-1">
                  {(item.variant?.product?.brand as any)?.name || "LUXE"}
                </p>
                <h4 className="text-[14px] font-bold text-[#3D2B1A] line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-[11px] text-[#8A7966] mt-1">
                  Màu: {item.variant?.color} · Size: {item.variant?.size}
                </p>
              </div>

              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(item.id, star)}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      size={24}
                      className={cn(
                        "transition-colors",
                        (ratings[item.id] || 0) >= star
                          ? "text-[#C4783A] fill-[#C4783A]"
                          : "text-[#DDD6C8]"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <textarea
                placeholder="Cảm nhận của bạn về sản phẩm..."
                className="w-full p-4 bg-[#FAF8F4] border border-[#DDD6C8] rounded-xl text-xs font-medium focus:outline-none focus:border-[#C4783A] transition-colors resize-none h-24"
                value={comments[item.id] || ""}
                onChange={(e) => handleComment(item.id, e.target.value)}
              />
              <Button
                onClick={() =>
                  onReviewSubmit?.(
                    item.id,
                    ratings[item.id] || 0,
                    comments[item.id] || ""
                  )
                }
                className="w-full h-10 bg-[#3D2B1A] text-white rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#2A2420]"
              >
                Gửi đánh giá
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-[#FAF8F4]/40 border-t border-[#DDD6C8] flex justify-end">
        <Button className="rounded-full bg-[#3D2B1A] text-white px-10 py-6 h-auto text-sm font-bold uppercase tracking-[0.2em] shadow-xl shadow-[#3D2B1A]/20 hover:scale-105 transition-all">
          <Send size={16} className="mr-3" />
          Gửi tất cả đánh giá
        </Button>
      </div>
    </div>
  );
}
