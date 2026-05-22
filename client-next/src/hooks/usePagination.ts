"use client";

import { useMemo } from "react";

interface UsePaginationOptions {
  page: number;
  totalPages: number;
  siblingCount?: number;
}

type PaginationItem = number | "ellipsis";

function range(start: number, end: number) {
  const length = Math.max(end - start + 1, 0);
  return Array.from({ length }, (_, index) => start + index);
}

export function usePagination({
  page,
  totalPages,
  siblingCount = 1,
}: UsePaginationOptions) {
  return useMemo<PaginationItem[]>(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);
    const shouldShowLeftEllipsis = leftSiblingIndex > 2;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      return [...range(1, 3 + siblingCount * 2), "ellipsis", totalPages];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      return [1, "ellipsis", ...range(totalPages - (2 + siblingCount * 2), totalPages)];
    }

    return [
      1,
      "ellipsis",
      ...range(leftSiblingIndex, rightSiblingIndex),
      "ellipsis",
      totalPages,
    ];
  }, [page, siblingCount, totalPages]);
}
