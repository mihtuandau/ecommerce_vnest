"use client";

import React from "react";
import { Star, MessageSquare } from "lucide-react";

interface ReviewsStatsProps {
  reviews: any[];
  total: number;
}

export function ReviewsStats({ reviews, total }: ReviewsStatsProps) {
  // Compute local stats based on the returned reviews page or global average
  const count = total || reviews.length;

  // Calculate average rating
  const avgRating = React.useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  }, [reviews]);

  // Compute distribution of ratings (1 to 5)
  const distribution = React.useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length === 0) return dist;

    reviews.forEach((r) => {
      const rate = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (dist[rate] !== undefined) {
        dist[rate] += 1;
      }
    });

    // Convert to percentages
    const percentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const len = reviews.length;
    (Object.keys(dist) as unknown as Array<1 | 2 | 3 | 4 | 5>).forEach((key) => {
      percentages[key] = Math.round((dist[key] / len) * 100);
    });

    return percentages;
  }, [reviews]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Reviews Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <span className="text-xs text-slate-450 block">Tổng số đánh giá</span>
          <span className="text-3xl font-medium text-slate-800 block mt-1 tracking-tight">
            {count}
          </span>
          <span className="text-[10.5px] text-slate-400 block mt-1">
            Từ khách hàng đã mua sản phẩm
          </span>
        </div>
      </div>

      {/* Average Rating Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
        </div>
        <div>
          <span className="text-xs text-slate-450 block">Điểm đánh giá trung bình</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-medium text-slate-800 tracking-tight">
              {avgRating || "---"}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.round(avgRating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                }`}
              />
            ))}
            <span className="text-[10px] text-slate-400 ml-1.5">Độ hài lòng cao</span>
          </div>
        </div>
      </div>

      {/* Breakdown Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-center gap-1.5">
        <span className="text-[10.5px] text-slate-450 block mb-1">
          Tỷ lệ phân bổ điểm số (trang này)
        </span>
        {[5, 4, 3, 2, 1].map((rating) => {
          const pct = distribution[rating as 5 | 4 | 3 | 2 | 1] || 0;
          return (
            <div
              key={rating}
              className="flex items-center gap-2 text-xs text-slate-500"
            >
              <span className="w-8 flex items-center justify-end gap-0.5 text-slate-400 text-[11px]">
                {rating}{" "}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
              </span>
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-400 text-[10.5px]">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
