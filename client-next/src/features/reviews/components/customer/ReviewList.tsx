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

const RatingSummary = ({ reviews, product }: { reviews: Review[]; product: Product }) => {
  const calculatedAvg = reviews.length > 0 ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length : 0;
  const avg = product?.averageRating || calculatedAvg || 0;
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
        <span className="text-xs font-semibold text-slate-500 mt-4">
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
                <span className="text-xs font-semibold text-slate-500">{star}</span>
                <Star size={10} className="fill-yellow-400 text-yellow-400 flex-shrink-0" />
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

import { ReviewAISummary } from "./ReviewAISummary";

export function ReviewList({ productId, product }: ReviewListProps) {
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  
  // We don't have an orderId here easily, but we can try to find one from user's orders
  // or the backend can check if they've purchased THIS product in ANY order.
  // Our current backend 'can-review' requires an orderId.
  // For now, let's just focus on the visible button.
  
  const body = reviewsData as any;
  const reviews = Array.isArray(body) 
    ? body 
    : (body?.reviews || body?.data || []);
    
  const total = body?.total || reviews.length || 0;

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
      
      {/* AI Review Summary Section */}
      <ReviewAISummary productId={productId} />

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900">Đánh giá từ khách hàng ({total})</h3>
          <p className="text-xs font-semibold text-slate-500">Những chia sẻ thật từ người mua</p>
        </div>
        
        {/* Note: In a real scenario, we'd check if user is logged in and has purchased */}
        {/* Since we don't have an orderId here, we point them to their orders if they want to review */}
        <Button 
          variant="outline" 
          size="sm"
          className="rounded-full h-10 px-6 text-xs font-bold border-slate-200 hover:bg-slate-50 gap-2"
          asChild
        >
          <Link href="/orders">
            <MessageSquarePlus className="h-3.5 w-3.5 text-primary" />
            Viết đánh giá
          </Link>
        </Button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/30 rounded-3xl border border-slate-100 border-dashed">
          <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
             <Star size={32} className="text-slate-200" />
          </div>
          <p className="text-slate-500 font-semibold text-sm">Chưa có đánh giá nào</p>
          <p className="text-slate-400 text-xs mt-2 font-normal">Hãy là người đầu tiên trải nghiệm và để lại cảm nhận của bạn</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review: Review) => {
            const initial = (review.user?.name || "N")[0].toUpperCase();
            return (
              <div key={review.id} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 shadow-sm border border-primary/20">
                    {initial}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{review.user?.name || "Người dùng"}</span>
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
                            src={typeof img === 'string' ? img : img.url} 
                            alt="Review" 
                            width={80}
                            height={80}
                            className="h-20 w-20 object-cover rounded-xl border border-slate-200 cursor-pointer hover:opacity-90 transition-opacity shadow-sm" 
                            onClick={() => setPreviewImage(typeof img === 'string' ? img : img.url)}
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
