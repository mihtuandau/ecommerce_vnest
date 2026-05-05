"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Star, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
  };
}

interface PendingReviewsProps {
  reviews?: Review[];
  isLoading?: boolean;
}

export function PendingReviews({ reviews, isLoading }: PendingReviewsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-none shadow-sm h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Card className="rounded-2xl border-none shadow-sm h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold text-slate-800">
            Đánh giá chờ duyệt
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[200px] text-slate-400">
          <p className="text-sm">Không có đánh giá nào đang chờ</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-4 px-6 border-b border-slate-50">
        <CardTitle className="text-base font-semibold text-slate-900">
          Đánh giá chờ duyệt
        </CardTitle>
        <Button
          variant="link"
          className="text-primary font-medium text-sm flex items-center gap-1 hover:no-underline p-0"
          asChild
        >
          <Link href={ROUTES.ADMIN_REVIEWS || "/admin/reviews"}>
            Xem tất cả <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-0 p-0 flex-1">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={`flex items-start gap-4 p-5 hover:bg-slate-50/50 transition-colors group relative ${
              index !== reviews.length - 1 ? "border-b border-slate-50" : ""
            }`}
          >
            {/* Avatar */}
            <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
              <span className="text-slate-500 font-semibold text-sm">
                {(review.user?.name || "K").charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex gap-0.5 mb-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-900 font-medium line-clamp-2 leading-relaxed mb-1 tracking-tight">
                {review.comment || "Không có nội dung"}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {review.product?.name}
              </p>
            </div>

            {/* Action */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
              asChild
            >
              <Link href={`${ROUTES.ADMIN_REVIEWS || "/admin/reviews"}?id=${review.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
