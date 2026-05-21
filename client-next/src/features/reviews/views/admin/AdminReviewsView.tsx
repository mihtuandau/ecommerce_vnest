"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Spinner } from "@/components/ui/Spinner";
import { usePermission } from "@/hooks/usePermission";
import { useAllReviews, useDeleteReview } from "@/features/reviews/hooks";
import { ReviewsStats } from "@/features/reviews/components/admin/ReviewsStats";
import { ReviewsTable } from "@/features/reviews/components/admin/ReviewsTable";
import { ReviewsToolbar } from "@/features/reviews/components/admin/ReviewsToolbar";

function AdminReviewsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightId = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useAllReviews({
    page: 1,
    limit: 1000,
  });
  const deleteMutation = useDeleteReview();

  const handleDeleteReview = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Đã xóa đánh giá khách hàng thành công!");
      if (highlightId && String(id) === highlightId) {
        router.push("/admin/reviews");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Không thể xóa đánh giá này. Vui lòng kiểm tra quyền hạn."
      );
    }
  };

  const filteredReviews = useMemo(() => {
    const reviewsList = data?.reviews || [];

    if (highlightId) {
      const match = reviewsList.find((review: any) => String(review.id) === highlightId);
      return match ? [match] : [];
    }

    return reviewsList.filter((review: any) => {
      if (ratingFilter !== null && Math.round(review.rating) !== ratingFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const productName = review.product?.name?.toLowerCase() || "";
        const comment = review.comment?.toLowerCase() || "";
        const userName = review.user?.name?.toLowerCase() || "";
        const userEmail = review.user?.email?.toLowerCase() || "";
        const orderCode = review.order?.orderCode?.toLowerCase() || "";

        return (
          productName.includes(query) ||
          comment.includes(query) ||
          userName.includes(query) ||
          userEmail.includes(query) ||
          orderCode.includes(query)
        );
      }

      return true;
    });
  }, [data?.reviews, searchQuery, ratingFilter, highlightId]);

  const itemsPerPage = 10;
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  useEffect(() => {
    setPage(1);
  }, [searchQuery, ratingFilter, highlightId]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
            Đối soát và quản lý đánh giá
          </h1>
          <p className="text-slate-500 text-sm">
            Theo dõi ý kiến khách hàng, kiểm duyệt nội dung phản hồi và thống kê
            chỉ số hài lòng.
          </p>
        </div>
      </div>

      {highlightId && (
        <div className="bg-amber-50/70 border border-amber-250/30 p-4 rounded-2xl flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium truncate">
              Đang hiển thị duy nhất đánh giá cần duyệt được chọn từ dashboard
              (mã: #{highlightId}).
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/reviews")}
            className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline cursor-pointer bg-transparent border-0 shrink-0"
          >
            Xem tất cả đánh giá
          </button>
        </div>
      )}

      <ReviewsStats reviews={filteredReviews} total={filteredReviews.length} />

      {!highlightId && (
        <ReviewsToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />
      )}

      <div className="relative">
        <ReviewsTable
          reviews={paginatedReviews}
          isLoading={isLoading}
          isDeleting={deleteMutation.isPending}
          onDelete={handleDeleteReview}
          page={page}
          totalPages={totalPages}
          total={totalItems}
          setPage={setPage}
        />

        {isFetching && !isLoading && (
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-100 flex items-center gap-1.5 shadow-sm">
            <Spinner size="sm" variant="slate" />
            <span className="text-[10px] text-slate-400">Đang cập nhật...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminReviewsView() {
  const { can } = usePermission();

  if (!can("product.manage") && !can("settings.manage")) {
    return <AccessDenied permission="product.manage" />;
  }

  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-xs text-slate-400">
          Đang tải...
        </div>
      }
    >
      <AdminReviewsContent />
    </Suspense>
  );
}
