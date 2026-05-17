"use client";

import React from "react";
import { ReviewsContainer } from "@/features/reviews";
import { usePermission } from "@/hooks/usePermission";
import { AccessDenied } from "@/components/ui/AccessDenied";

export default function AdminReviewsPage() {
  const { can } = usePermission();

  // Guard the page with product.manage or settings.manage permission
  if (!can("product.manage") && !can("settings.manage")) {
    return <AccessDenied permission="product.manage" />;
  }

  return (
    <React.Suspense fallback={<div className="p-10 text-center text-xs text-slate-400">Đang tải...</div>}>
      <ReviewsContainer />
    </React.Suspense>
  );
}
