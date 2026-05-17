"use client";

import React from "react";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/utils/cn";

interface PaymentsToolbarProps {
  status: string;
  setStatus: (val: string) => void;
  method: string;
  setMethod: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setPage: (val: number) => void;
}

export function PaymentsToolbar({
  status,
  setStatus,
  method,
  setMethod,
  searchQuery,
  setSearchQuery,
  setPage,
}: PaymentsToolbarProps) {
  return (
    <>
      {/* Tab Filters */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-200 gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Tất cả", value: "ALL" },
            { label: "Chờ thanh toán", value: "PENDING" },
            { label: "Thành công", value: "SUCCESS" },
            { label: "Thất bại", value: "FAILED" },
            { label: "Đã hoàn tiền", value: "REFUNDED" },
            { label: "Đã hủy", value: "CANCELLED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                status === tab.value
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Method Select representing full Prisma enum */}
          <Select
            value={method}
            onValueChange={(val) => {
              setMethod(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] h-9 text-xs rounded-xl border-slate-200 bg-white">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-slate-400" />
              <SelectValue placeholder="Phương thức" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 admin-theme">
              <SelectItem value="ALL">Tất cả phương thức</SelectItem>
              <SelectItem value="CASH">COD (Tiền mặt)</SelectItem>
              <SelectItem value="VNPAY">Cổng VNPay</SelectItem>
              <SelectItem value="MOMO">Ví điện tử MoMo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/20">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo mã giao dịch, mã đơn hàng, email khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 border-slate-200 rounded-xl bg-white shadow-sm focus:ring-slate-900/5 transition-all text-sm w-full"
          />
        </div>
      </div>
    </>
  );
}
