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
  const InfoIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );

  return (
    <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100">
      <h2 className="text-lg font-semibold text-slate-900 mb-8">Tóm tắt đơn hàng</h2>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500 font-medium">Tạm tính</span>
          <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(selectedTotalPrice)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm border-t border-slate-100/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Phí vận chuyển dự kiến</span>
            <InfoIcon />
          </div>
          <span className="font-semibold text-slate-900 tabular-nums text-emerald-600">Miễn phí</span>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-slate-100/60 pt-6">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Thuế dự kiến</span>
            <InfoIcon />
          </div>
          <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(0)}</span>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-slate-200/60">
          <span className="text-base font-semibold text-slate-900">Tổng cộng đơn hàng</span>
          <span className="text-lg font-semibold text-primary tabular-nums">
            {formatCurrency(selectedTotalPrice)}
          </span>
        </div>
        
        <div className="pt-4">
          <Button 
            asChild 
            disabled={selectedCount === 0}
            className={cn(
              "w-full h-14 rounded-xl text-white text-sm font-semibold shadow-xl shadow-primary/10 transition-all active:scale-[0.98]",
              selectedCount > 0 ? "bg-primary hover:brightness-110" : "bg-slate-300 cursor-not-allowed pointer-events-none"
            )}
          >
            <Link href={selectedCount > 0 ? ROUTES.CHECKOUT : "#"}>
              Thanh toán
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
