"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatCurrency";

interface RelatedOrderCardProps {
  order: any;
  orderId: number | string;
}

export function RelatedOrderCard({ order, orderId }: RelatedOrderCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <ShoppingBag size={16} className="text-slate-700" />
        <h3 className="text-sm font-semibold text-slate-900">
          Đơn hàng liên quan
        </h3>
      </div>
      <div className="space-y-3.5">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">Mã đơn:</span>
          <span className="text-sm font-semibold text-slate-800">
            #{order?.orderCode}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            Tổng thanh toán:
          </span>
          <span className="text-sm font-semibold text-slate-900">
            {formatCurrency(order?.total)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">
            Ngày đặt:
          </span>
          <span className="text-xs font-semibold text-slate-900">
            {new Date(order?.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <Button
          asChild
          variant="outline"
          className="w-full rounded-xl h-10 text-xs font-semibold mt-2 border-slate-200 hover:bg-slate-50 transition-all"
        >
          <Link href={`/admin/orders/${orderId}`}>
            Xem toàn bộ đơn hàng
          </Link>
        </Button>
      </div>
    </div>
  );
}
