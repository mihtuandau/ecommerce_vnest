"use client";

import React from "react";
import { ShieldCheck, Truck, CreditCard } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface CartSummaryProps {
  selectedCount: number;
  selectedTotalPrice: number;
}

export function CartSummary({ selectedCount, selectedTotalPrice }: CartSummaryProps) {
  return (
    <Card className="border border-slate-100 rounded-[2rem] overflow-hidden bg-white">
      <div className="bg-slate-50 p-5 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900 flex items-center gap-3 text-sm">
          <CreditCard className="w-4 h-4 text-primary" />
          Thanh toán
        </h3>
      </div>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-normal">Tạm tính ({selectedCount} sản phẩm)</span>
            <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(selectedTotalPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600 font-normal">Phí giao hàng</span>
            <span className="text-slate-500 font-normal text-[11px] bg-slate-50 px-3 py-1 rounded-lg">Tính ở bước thanh toán</span>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold text-slate-500 tracking-wide">Tổng cộng</span>
            <p className="text-[10px] text-slate-500 font-normal">Đã bao gồm VAT</p>
          </div>
          <p className="text-2xl font-bold text-primary tabular-nums tracking-tighter">{formatCurrency(selectedTotalPrice)}</p>
        </div>
        
        <div className="space-y-4 pt-2">
          <Button 
            asChild 
            className={cn(
              "w-full h-12 rounded-xl text-white text-sm font-semibold transition-all active:scale-[0.98]",
              selectedCount > 0 ? "bg-primary hover:bg-[#0d47a1]" : "bg-slate-300 cursor-not-allowed pointer-events-none"
            )}
          >
            <Link href={selectedCount > 0 ? ROUTES.CHECKOUT : "#"}>
              {selectedCount > 0 ? "Tiến hành đặt hàng" : "Chọn sản phẩm"}
            </Link>
          </Button>
          
          <div className="flex items-center justify-center gap-2 py-2">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <span className="text-[10px] font-normal text-slate-400 tracking-wider">Thanh toán bảo mật</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
          <div className="p-3 bg-slate-50/50 rounded-xl space-y-1.5">
            <Truck className="w-4 h-4 text-slate-500" />
            <p className="text-[9px] font-normal text-slate-600 leading-tight">Giao hàng 2-4 ngày</p>
          </div>
          <div className="p-3 bg-slate-50/50 rounded-xl space-y-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            <p className="text-[9px] font-normal text-slate-600 leading-tight">Đổi trả 30 ngày</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
