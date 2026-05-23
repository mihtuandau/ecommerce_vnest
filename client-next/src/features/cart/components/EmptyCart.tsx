"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/ui";
import { ROUTES } from "@/constants/routes";

export function EmptyCart() {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-brand-cream">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <EmptyState
          icon={ShoppingBag}
          title="Giỏ hàng trống"
          description="Bạn chưa có sản phẩm nào trong giỏ hàng."
          actionText="Khám phá ngay"
          onAction={() => router.push(ROUTES.HOME)}
        />
      </div>
    </div>
  );
}
