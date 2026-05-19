"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const paginationRange = React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, "dots", totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, "dots", ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, "dots", ...middleRange, "dots", lastPageIndex];
    }
    
    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  if (totalPages <= 1) return null;

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center gap-1.5 font-sans select-none", className)}
    >
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-sand bg-white text-brand-espresso transition-all hover:bg-brand-cream hover:text-brand-bronze disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        )}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {paginationRange.map((pageNumber, idx) => {
        if (pageNumber === "dots") {
          return (
            <span
              key={`dots-${idx}`}
              className="inline-flex h-9 w-9 items-center justify-center text-brand-taupe"
            >
              <MoreHorizontal size={14} />
            </span>
          );
        }

        const isCurrent = pageNumber === currentPage;

        return (
          <button
            key={pageNumber}
            onClick={() => onPageChange(Number(pageNumber))}
            aria-current={isCurrent ? "page" : undefined}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[13px] font-bold transition-all cursor-pointer",
              isCurrent
                ? "border-brand-espresso bg-brand-espresso text-white shadow-sm"
                : "border-brand-sand bg-white text-brand-taupe hover:bg-brand-cream hover:text-brand-espresso hover:border-brand-taupe"
            )}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-sand bg-white text-brand-espresso transition-all hover:bg-brand-cream hover:text-brand-bronze disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
        )}
        aria-label="Trang tiếp"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
