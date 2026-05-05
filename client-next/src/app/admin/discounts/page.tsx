"use client";

import React from "react";
import { useAdminDiscounts } from "@/features/discounts/hooks";
import { DiscountTable } from "@/features/discounts/components/admin/DiscountTable";
import { DiscountStats } from "@/features/discounts/components/admin/DiscountStats";
import { Button } from "@/components/ui/Button";
import { Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { Discount } from "@/types/models";

export default function AdminDiscountsPage() {
  // Lấy TẤT CẢ (cả voucher + flash sale)
  const { data, isLoading, refetch, isFetching } = useAdminDiscounts();

  const discounts: Discount[] = Array.isArray(data) ? data : (data as any)?.data || [];

  const stats = React.useMemo(() => {
    const now = new Date();
    return {
      total: discounts.length,
      active: discounts.filter(
        (d) => d.isActive && (!d.endDate || new Date(d.endDate) > now)
      ).length,
      flashSale: discounts.filter((d) => d.isFlashSale).length,
      expired: discounts.filter((d) => d.endDate && new Date(d.endDate) < now).length,
    };
  }, [discounts]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Mã giảm giá
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Quản lý mã giảm giá và Flash Sale
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-slate-200 text-slate-500"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
          <Button
            asChild
            className="h-9 px-4 rounded-lg bg-primary text-white hover:bg-slate-800 font-bold text-xs gap-2"
          >
            <Link href={`${ROUTES.ADMIN_DISCOUNTS}/create`}>
              <Plus className="h-4 w-4" /> Tạo mới
            </Link>
          </Button>
        </div>
      </div>

      <DiscountStats {...stats} />

      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm font-bold text-slate-400">Đang tải...</p>
            </div>
          </div>
        ) : (
          <DiscountTable data={discounts} />
        )}
      </div>
    </div>
  );
}
