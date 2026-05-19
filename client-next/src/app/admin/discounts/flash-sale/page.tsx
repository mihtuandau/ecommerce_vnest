"use client";

import React from "react";
import { useAdminDiscounts } from "@/features/discounts/hooks";
import { DiscountTable } from "@/features/discounts/components/admin/DiscountTable";
import { DiscountStats } from "@/features/discounts/components/admin/DiscountStats";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCcw, Zap } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { Discount } from "@/types/models";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminFlashSalePage() {
  // Chỉ lấy Flash Sale
  const { data, isLoading, refetch, isFetching } = useAdminDiscounts({
    isFlashSale: true,
  });

  const discounts: Discount[] = Array.isArray(data) ? data : (data as any)?.data || [];

  const stats = React.useMemo(() => {
    const now = new Date();
    return {
      total: discounts.length,
      active: discounts.filter(
        (d) => d.isActive && (!d.endDate || new Date(d.endDate) > now)
      ).length,
      flashSale: discounts.length,
      expired: discounts.filter((d) => d.endDate && new Date(d.endDate) < now).length,
    };
  }, [discounts]);

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
            <Zap className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Flash Sale
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Giảm giá tự động trên sản phẩm — Khách hàng không cần nhập mã
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-slate-200 text-slate-500"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? <Spinner size="sm" /> : <RefreshCcw className="h-4 w-4" />}
          </Button>
          <Button
            asChild
            className="h-9 px-4 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-bold text-xs gap-2"
          >
            <Link href={`${ROUTES.ADMIN_DISCOUNTS}/create?flashSale=true`}>
              <Plus className="h-4 w-4" /> Tạo Flash Sale
            </Link>
          </Button>
        </div>
      </div>

      
      <DiscountStats {...stats} />

      
      <div className="bg-white rounded-xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
              <p className="text-sm font-bold text-slate-400">Đang tải Flash Sale...</p>
            </div>
          </div>
        ) : (
          <DiscountTable data={discounts} />
        )}
      </div>
    </div>
  );
}
