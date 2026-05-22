"use client";

import React from "react";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
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
            {isFetching ? <Spinner size="sm" /> : <RefreshCcw className="h-4 w-4" />}
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
