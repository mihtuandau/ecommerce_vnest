"use client";

import React from "react";
import { RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { adminUI } from "@/constants/admin-ui";
import Link from "next/link";

interface OrderListHeaderProps {
  totalOrders: number;
  onRefresh: () => void;
  isFetching: boolean;
}

export function OrderListHeader({ totalOrders, onRefresh, isFetching }: OrderListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div>
        <h1 className={adminUI.typography.heading}>Quản lý đơn hàng</h1>
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 mt-1">
          <span>Bán hàng</span>
          <span className="text-[10px]">›</span>
          <span className="text-slate-800">Đơn hàng</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          className={cn(adminUI.button.base, adminUI.button.ghost)}
          onClick={onRefresh}
          disabled={isFetching}
        >
          {isFetching ? <Spinner size="sm" /> : <RefreshCw className={adminUI.icon.action} />}
        </Button>
        <Button variant="outline" className={cn(adminUI.button.base, adminUI.button.secondary)}>
          <Download className={cn(adminUI.icon.action, "mr-2")} /> Xuất Excel
        </Button>
        <Link href="/admin/orders/create">
          <Button className={cn(adminUI.button.base, adminUI.button.primary)}>
            <Plus className={cn(adminUI.icon.action, "mr-2")} /> Tạo đơn mới
          </Button>
        </Link>
      </div>
    </div>
  );
}
