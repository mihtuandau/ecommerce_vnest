"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquarePlus, Star, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui";
import { Skeleton } from "@/components/ui/Skeleton";
import { Product } from "@/types/models";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useProductReviews } from "../../hooks";

interface ReviewListProps {
  productId: number;
  product: Product;
}

interface Review {
  id: number;
  productId?: number | string;
  orderId?: number | string;
  rating: number;
  comment: string;
  createdAt: string;
  size?: string;
  color?: string;
  variant?: {
    size?: string;
    color?: string;
    productId?: number | string;
  };
  orderItem?: {
    variant?: {
      size?: string;
      color?: string;
      productId?: number | string;
    };
    variantSnapshot?: {
      size?: string;
      color?: string;
      productId?: number | string;
    };
  };
  order?: {
    id?: number | string;
    orderCode?: string;
    orderItems?: Array<{
      productId?: number | string;
      variant?: {
        size?: string;
        color?: string;
        productId?: number | string;
      };
      variantSnapshot?: {
        size?: string;
        color?: string;
        productId?: number | string;
      };
    }>;
  };
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
            ? "fill-brand-bronze text-brand-bronze"
            : "fill-brand-sand/40 text-brand-sand/60"
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
      ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) / reviews.length
      : 0;
  const avg = product.averageRating || product.rating || calculatedAvg || 0;
  const total = product.reviewCount || reviews.length || 0;

  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((review) => Math.round(review.rating) === star).length,
  }));

  return (
    <div className="mb-8 rounded-2xl border border-brand-sand/30 bg-white/75 p-5 shadow-sm sm:p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[190px_1fr] md:gap-8 lg:grid-cols-[220px_1fr]">
        <div className="flex min-h-[190px] flex-col items-center justify-center rounded-xl bg-brand-ivory/45 p-6 text-center">
          <div className="font-serif text-[56px] font-semibold leading-none text-primary">
            {avg.toFixed(1)}
          </div>
          <div className="mt-3 flex justify-center">
            <Stars rating={avg} size={20} />
          </div>
          <p className="mt-3 text-[12.5px] font-semibold text-brand-taupe">
            {total} đánh giá
          </p>
        </div>

        <div className="flex min-w-0 flex-col justify-center">
          <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-primary">Khách hàng nói gì?</h3>
              <p className="text-[12.5px] text-brand-taupe">
                Tổng quan điểm đánh giá từ những trải nghiệm đã ghi nhận
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {counts.map(({ star, count }) => {
              const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div
                  key={star}
                  className="grid grid-cols-[38px_1fr_34px] items-center gap-3"
                >
                  <span className="flex items-center gap-1 text-[12px] font-semibold text-brand-taupe">
                    {star}
                    <Star size={11} className="fill-brand-bronze text-brand-bronze" />
                  </span>
                  <div className="h-2 overflow-hidden rounded-full bg-white shadow-inner">
                    <div
                      className="h-full rounded-full bg-brand-bronze transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-right text-[12px] font-semibold tabular-nums text-brand-taupe">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const getReviewPurchaseMeta = (review: Review, product: Product) => {
  const productId = String(review.productId || product.id);
  const purchaseItem =
    review.orderItem ||
    review.order?.orderItems?.find((item) => {
      const itemProductId =
        item.productId || item.variant?.productId || item.variantSnapshot?.productId;
      return itemProductId ? String(itemProductId) === productId : false;
    });

  const size =
    review.size ||
    review.variant?.size ||
    purchaseItem?.variant?.size ||
    purchaseItem?.variantSnapshot?.size;
  const color =
    review.color ||
    review.variant?.color ||
    purchaseItem?.variant?.color ||
    purchaseItem?.variantSnapshot?.color;
  const isVerifiedPurchase = Boolean(review.orderId || review.order || purchaseItem);

  return { size, color, isVerifiedPurchase };
};

export function ReviewList({ productId, product }: ReviewListProps) {
  const { data: reviewsData, isLoading } = useProductReviews(productId);
  const { user } = useAuthStore();
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const body = reviewsData as any;
  const reviews: Review[] = Array.isArray(body)
    ? body
    : body?.reviews || body?.data || [];
  const total = body?.total || product.reviewCount || reviews.length || 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-44 w-full rounded-2xl bg-white/70" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl bg-white/70" />
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
    <div className="w-full animate-in fade-in duration-700">
      <RatingSummary reviews={reviews} product={product} />

      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h3 className="text-[16px] font-bold text-primary">
            Đánh giá từ khách hàng ({total})
          </h3>
          <p className="text-[12.5px] font-medium text-brand-taupe">
            Những chia sẻ chân thực từ người đã trải nghiệm sản phẩm
          </p>
        </div>

        {user && (
          <Button
            variant="outline"
            size="sm"
            className="h-11 rounded-full border-primary px-7 text-[12px] font-bold text-primary transition-all hover:bg-primary hover:text-white"
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
          {reviews.map((review) => {
            const initial = (review.user?.name || "N")[0].toUpperCase();
            const { size, color, isVerifiedPurchase } = getReviewPurchaseMeta(
              review,
              product
            );
            return (
              <article
                key={review.id}
                className="rounded-2xl border border-brand-sand/30 bg-white/75 p-5 shadow-sm transition-all hover:border-brand-bronze/30 hover:bg-white hover:shadow-md sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-sand/30 bg-brand-ivory text-[13px] font-bold text-brand-bronze">
                    {initial}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-[14px] font-bold text-primary">
                            {review.user?.name || "Người dùng"}
                          </h4>
                          {isVerifiedPurchase && (
                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-600">
                              Đã mua hàng
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11.5px] font-medium text-brand-taupe">
                          <span>{formatDate(review.createdAt)}</span>
                          {(size || color) && (
                            <>
                              <span className="text-brand-sand">|</span>
                              {size && <span>Size: {size}</span>}
                              {color && <span>Màu: {color}</span>}
                            </>
                          )}
                        </div>
                      </div>

                      <Stars rating={review.rating} size={13} />
                    </div>

                    <p className="mt-4 text-[13.5px] leading-7 text-brand-espresso/80">
                      {review.comment}
                    </p>

                    {review.images && review.images.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {review.images.map((img, idx) => {
                          const src = typeof img === "string" ? img : img.url;
                          return (
                            <Image
                              key={(img as any).id || idx}
                              src={src}
                              alt="Ảnh đánh giá"
                              width={80}
                              height={80}
                              className="h-20 w-20 cursor-pointer rounded-xl border border-brand-sand/40 object-cover shadow-sm transition-opacity hover:opacity-90"
                              onClick={() => setPreviewImage(src)}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent
          hideCloseButton
          className="flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-visible border-none bg-transparent p-0 shadow-none"
        >
          <DialogTitle className="sr-only">Xem ảnh</DialogTitle>
          <DialogClose className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20">
            <X className="h-6 w-6" />
          </DialogClose>
          {previewImage && (
            <div className="relative h-[85vh] w-full">
              <Image
                src={previewImage}
                alt="Review preview"
                fill
                className="rounded-none object-contain shadow-md"
                unoptimized
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
