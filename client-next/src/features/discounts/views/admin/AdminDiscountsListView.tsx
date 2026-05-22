"use client";

import React from "react";
import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";
import { DiscountStats } from "@/features/discounts/components/admin/list/DiscountStats";
import { DiscountTable } from "@/features/discounts/components/admin/list/DiscountTable";
import { useAdminDiscounts } from "@/features/discounts/hooks/queries/useAdminDiscounts";
import {
  getDiscountStats,
  normalizeDiscountList,
} from "@/features/discounts/services";

export function AdminDiscountsListView() {
  const { data, isLoading, refetch, isFetching } = useAdminDiscounts();

  const discounts = React.useMemo(() => normalizeDiscountList(data), [data]);
  const stats = React.useMemo(() => getDiscountStats(discounts), [discounts]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className={adminUI.typography.heading}>Quản lý mã giảm giá</h1>
          <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
            <span>Marketing</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-800">{discounts.length} chương trình</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(adminUI.button.base, adminUI.button.ghost)}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Spinner size="sm" />
            ) : (
              <RefreshCw className={adminUI.icon.action} />
            )}
            {isFetching ? "Đang tải..." : "Làm mới"}
          </Button>

          <Button
            asChild
            size="sm"
            className={cn(adminUI.button.base, adminUI.button.primary)}
          >
            <Link href={ROUTES.ADMIN_DISCOUNTS_CREATE}>
              <Plus className={adminUI.icon.action} /> Tạo mới
            </Link>
          </Button>
        </div>
      </div>

      <DiscountStats {...stats} />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        {isLoading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Spinner size="lg" />
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
