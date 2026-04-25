"use client";

import React from "react";
import { RefreshCw, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import Link from "next/link";

interface OrderListHeaderProps {
  totalOrders: number;
  onRefresh: () => void;
  isFetching: boolean;
}

export function OrderListHeader({ totalOrders, onRefresh, isFetching }: OrderListHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Quản lý đơn hàng</h1>
        <p className="text-slate-500 text-sm">
          Tổng cộng {totalOrders} đơn hàng trong hệ thống
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="font-bold gap-2 text-slate-500 hover:text-primary hover:bg-slate-50"
          onClick={onRefresh}
          disabled={isFetching}
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          {isFetching ? "Đang tải..." : "Làm mới"}
        </Button>
        <Button variant="outline" size="sm" className="font-bold gap-2 border-slate-200 hover:bg-slate-50">
          <Download className="h-4 w-4 text-slate-400" /> Xuất Excel
        </Button>
        <Link href="/admin/orders/create">
          <Button size="sm" className="font-bold gap-2 bg-primary text-white hover:bg-slate-800 shadow-sm">
            <Plus className="h-4 w-4" /> Tạo đơn mới
          </Button>
        </Link>
      </div>
    </div>
  );
}
