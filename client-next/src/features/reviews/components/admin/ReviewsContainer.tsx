"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAllReviews, useDeleteReview } from "../../hooks";
import { ReviewsStats } from "./ReviewsStats";
import { ReviewsToolbar } from "./ReviewsToolbar";
import { ReviewsTable } from "./ReviewsTable";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export function ReviewsContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightId = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  // Fetch up to 1000 reviews to allow high-accuracy client-side statistics and instant search/filtering
  const { data, isLoading, isFetching } = useAllReviews({
    page: 1,
    limit: 1000,
  });

  const reviewsList = data?.reviews || [];

  // Delete Mutation Hook
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
        error?.response?.data?.message || "Không thể xóa đánh giá này. Vui lòng kiểm tra quyền hạn."
      );
    }
  };

  // Filter reviews based on search query, rating selection or dashboard ID highlight
  const filteredReviews = useMemo(() => {
    if (highlightId) {
      const match = reviewsList.find((r: any) => String(r.id) === highlightId);
      return match ? [match] : [];
    }

    return reviewsList.filter((r: any) => {
      // 1. Filter by star rating
      if (ratingFilter !== null && Math.round(r.rating) !== ratingFilter) {
        return false;
      }

      // 2. Filter by search query (product name, comment, guest email, user name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const productName = r.product?.name?.toLowerCase() || "";
        const comment = r.comment?.toLowerCase() || "";
        const userName = r.user?.name?.toLowerCase() || "";
        const userEmail = r.user?.email?.toLowerCase() || "";
        const orderCode = r.order?.orderCode?.toLowerCase() || "";

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
  }, [reviewsList, searchQuery, ratingFilter, highlightId]);

  // Handle client-side pagination
  const itemsPerPage = 10;
  const totalItems = filteredReviews.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Reset page to 1 if filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, ratingFilter, highlightId]);

  const paginatedReviews = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredReviews, page]);

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-slate-900 mb-1">
            Đối soát và quản lý đánh giá
          </h1>
          <p className="text-slate-500 text-sm">
            Theo dõi ý kiến khách hàng, kiểm duyệt nội dung phản hồi và thống kê chỉ số hài lòng.
          </p>
        </div>
      </div>

      {/* Specific Review Focused Warning Bar */}
      {highlightId && (
        <div className="bg-amber-50/70 border border-amber-250/30 p-4 rounded-2xl flex items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800 font-medium truncate">
              Đang hiển thị duy nhất đánh giá cần duyệt được chọn từ dashboard (mã: #{highlightId}).
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

      {/* Statistics Cards */}
      <ReviewsStats reviews={filteredReviews} total={filteredReviews.length} />

      {/* Search and Filters Toolbar (Only show if not focusing a highlighted ID) */}
      {!highlightId && (
        <ReviewsToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />
      )}

      {/* Data Table */}
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
        
        {/* Subtle fetching overlay */}
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
