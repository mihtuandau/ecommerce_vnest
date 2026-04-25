"use client";

import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/utils/cn";

interface ReviewListProps {
  productId: number;
  product: any;
}

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <Star
        key={i}
        size={size}
        className={cn(
          "transition-all",
          i <= Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-slate-100 text-slate-100"
        )}
      />
    ))}
  </div>
);

const RatingSummary = ({ reviews, product }: { reviews: any[]; product: any }) => {
  const avg = product?.rating || 0;
  const total = product?.reviewCount || reviews.length || 0;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-10 pb-10 border-b border-slate-100">
      {/* Average Score */}
      <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl p-8 min-w-[160px] border border-slate-100">
        <span className="text-6xl font-semibold text-slate-900 leading-none mb-2 tracking-tighter">
          {avg.toFixed(1)}
        </span>
        <Stars rating={avg} size={20} />
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-4">
          {total} đánh giá
        </span>
      </div>

      {/* Progress Bars */}
      <div className="flex-1 w-full max-w-md flex flex-col gap-3 justify-center">
        {counts.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1.5 w-6">
                <span className="text-[11px] font-semibold text-slate-400">{star}</span>
                <Star size={10} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
              </div>
              <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000 group-hover:brightness-110"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-300 w-8 text-right tabular-nums">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { useProductReviews } from "../../hooks";
import { Skeleton } from "@/components/ui/Skeleton";

export function ReviewList({ productId, product }: ReviewListProps) {
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  
  // Defensive check for different API response formats
  const reviews = Array.isArray(reviewsData) 
    ? reviewsData 
    : (reviewsData?.reviews || reviewsData?.data || []);
    
  const total = reviewsData?.total || reviews.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="animate-in fade-in duration-700">
      <RatingSummary reviews={reviews} product={product} />

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/30 rounded-3xl border border-slate-100 border-dashed">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
             <Star size={32} className="text-slate-200" />
          </div>
          <p className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">Chưa có đánh giá nào</p>
          <p className="text-slate-300 text-[11px] mt-2 font-medium">Hãy là người đầu tiên trải nghiệm và để lại cảm nhận của bạn</p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Đánh giá từ khách hàng ({total})</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {reviews.map((review: any) => {
              const initial = (review.user?.name || "N")[0].toUpperCase();
              return (
                <div key={review.id} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                      {initial}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{review.user?.name || "Người dùng"}</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            ✓ Đã mua hàng
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      <Stars rating={review.rating} size={12} />
                      
                      <p className="text-sm text-slate-600 leading-relaxed pt-1">
                        {review.comment}
                      </p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 pt-2">
                          {review.images.map((img: string, idx: number) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt="Review" 
                              className="h-16 w-16 object-cover rounded-lg border border-slate-200" 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
