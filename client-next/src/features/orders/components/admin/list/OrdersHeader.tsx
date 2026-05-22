"use client";

import React from "react";
import Link from "next/link";
import { Download, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { ROUTES } from "@/constants/routes";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface OrderOrdersHeaderProps {
  totalOrders: number;
  onRefresh: () => void;
  isFetching: boolean;
}

export function OrderOrdersHeader({
  totalOrders,
  onRefresh,
  isFetching,
}: OrderOrdersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className={adminUI.typography.heading}>Quản lý đơn hàng</h1>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
          <span>Bán hàng</span>
          <span className="text-[10px]">/</span>
          <span className="text-slate-800">{totalOrders} đơn hàng</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          className={cn(adminUI.button.base, adminUI.button.ghost)}
          onClick={onRefresh}
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
          variant="outline"
          className={cn(adminUI.button.base, adminUI.button.secondary)}
        >
          <Download className={adminUI.icon.action} /> Xuất Excel
        </Button>

        <Button asChild className={cn(adminUI.button.base, adminUI.button.primary)}>
          <Link href={ROUTES.ADMIN_ORDERS_CREATE}>
            <Plus className={adminUI.icon.action} /> Tạo đơn mới
          </Link>
        </Button>
      </div>
    </div>
  );
}
