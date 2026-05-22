"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { usePagination } from "@/hooks";
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
  const paginationRange = usePagination({
    page: currentPage,
    totalPages,
    siblingCount,
  });

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
        if (pageNumber === "ellipsis") {
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
