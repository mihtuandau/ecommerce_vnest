"use client";

import React from "react";
import Image from "next/image";
import { Star, X, MessageSquarePlus } from "lucide-react";
import { cn } from "@/utils/cn";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui";

import { Product } from "@/types/models";

interface ReviewListProps {
  productId: number;
  product: Product;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    name?: string;
    avatar?: string;
  };
  images?: (string | { id?: number | string; url: string })[];
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

const RatingSummary = ({
  reviews,
  product,
}: {
  reviews: Review[];
  product: Product;
}) => {
  const calculatedAvg =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
      : 0;
  const avg = product?.averageRating || calculatedAvg || 0;
  const total = product?.reviewCount || reviews.length || 0;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 mb-10 pb-10 border-b border-slate-100">
      
      <div className="flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl p-8 min-w-[160px] border border-slate-100">
        <span className="text-6xl font-semibold text-slate-900 leading-none mb-2 tracking-tighter">
          {avg.toFixed(1)}
        </span>
        <Stars rating={avg} size={20} />
        <span className="text-xs font-semibold text-slate-500 mt-4">
          {total} đánh giá
        </span>
      </div>

      
      <div className="flex-1 w-full max-w-md flex flex-col gap-3 justify-center">
        {counts.map(({ star, count }) => {
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1.5 w-6">
                <span className="text-xs font-semibold text-slate-500">{star}</span>
                <Star
                  size={10}
                  className="fill-yellow-400 text-yellow-400 flex-shrink-0"
                />
              </div>
              <div className="flex-1 h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000 group-hover:brightness-110"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500 w-8 text-right tabular-nums">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { useProductReviews, useCanReview } from "../../hooks";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ReviewModal } from "./ReviewModal";
import { useAuthStore } from "@/store/useAuthStore";

import { ReviewAISummary } from "./ReviewAISummary";

export function ReviewList({ productId, product }: ReviewListProps) {
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const body = reviewsData as any;
  const reviews = Array.isArray(body) ? body : body?.reviews || body?.data || [];

  const total = body?.total || reviews.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="space-y-6">
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

      
      <ReviewAISummary productId={productId} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="space-y-1">
          <h3 className="text-[16px] font-bold text-[#3D2B1A]">
            Đánh giá từ khách hàng ({total})
          </h3>
          <p className="text-[12px] font-medium text-[#8A7966]">
            Những chia sẻ chân thực từ những người đã trải nghiệm
          </p>
        </div>

        {user && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-11 px-8 text-[12px] font-bold border-[#3D2B1A] text-[#3D2B1A] hover:bg-[#3D2B1A] hover:text-white transition-all gap-2"
            asChild
          >
            <Link href="/orders">
              <MessageSquarePlus size={14} />
              Viết đánh giá
            </Link>
          </Button>
        )}
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="Chưa có đánh giá nào"
          description="Hãy là người đầu tiên trải nghiệm và để lại cảm nhận của bạn về sản phẩm này."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review: Review) => {
            const initial = (review.user?.name || "N")[0].toUpperCase();
            return (
              <div
                key={review.id}
                className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-primary/20">
                    {initial}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">
                          {review.user?.name || "Người dùng"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          ✓ Đã mua hàng
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>

                    <Stars rating={review.rating} size={12} />

                    <p className="text-sm text-slate-600 leading-relaxed pt-1">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {review.images.map((img, idx: number) => (
                          <Image
                            key={(img as any).id || idx}
                            src={typeof img === "string" ? img : img.url}
                            alt="Review"
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
                            onClick={() =>
                              setPreviewImage(typeof img === "string" ? img : img.url)
                            }
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
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent
          hideCloseButton
          className="max-w-[90vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none overflow-visible flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Xem ảnh</DialogTitle>
          <DialogClose className="fixed top-6 right-6 z-50 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all">
            <X className="h-6 w-6" />
          </DialogClose>
          {previewImage && (
            <div className="relative w-full h-[85vh]">
              <Image
                src={previewImage}
                alt="Review preview"
                fill
                className="object-contain rounded-none shadow-md"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
