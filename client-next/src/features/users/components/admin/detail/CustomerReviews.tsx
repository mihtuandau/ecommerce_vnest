"use client";

import React from "react";
import { Star, Package } from "lucide-react";
import { useAllReviews } from "@/features/reviews/hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/utils/cn";

interface CustomerReviewsProps {
  userId: number;
}

export function CustomerReviews({ userId }: CustomerReviewsProps) {
  const { data, isLoading } = useAllReviews({ userId, limit: 100 });
  const reviews = data?.reviews || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-slate-200" />
        </div>
        <p className="text-slate-400 font-bold">Khách hàng chưa có đánh giá nào.</p>
      </div>
    );
  }

  const getImageUrl = (img: any) => {
    if (!img) return "";
    const rawUrl = typeof img === 'string' ? img : img?.url || "";
    return rawUrl?.startsWith('http') ? rawUrl : `/${rawUrl}`;
  };

  return (
    <div className="space-y-3">
      {reviews.map((review: any) => {
        const productImg = review.product?.images?.[0];
        const productImgUrl = getImageUrl(productImg);

        return (
          <div key={review.id} className="group bg-white p-5 rounded-sm border border-slate-100 hover:border-slate-200 transition-all duration-200 flex flex-col md:flex-row items-start gap-4">
            {/* Product Info */}
            <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
              {productImgUrl ? (
                <img 
                  src={productImgUrl} 
                  alt={review.product?.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-slate-200" />
              )}
            </div>

            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{review.product?.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={cn(
                            "transition-all",
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-100"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-slate-300">|</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm font-medium text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-sm border border-slate-100/50">
                {review.comment || "Không có nội dung đánh giá"}
              </p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {review.images.map((img: string, idx: number) => (
                    <img 
                      key={idx} 
                      src={getImageUrl(img)} 
                      alt="Review" 
                      className="h-14 w-14 object-cover rounded-2xl border border-slate-200" 
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
