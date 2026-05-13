"use client";

import React from "react";
import { ShieldCheck, Truck, Tag, MoveUpRight, Lock, CheckCircle2, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { CheckoutDiscount } from "@/store/useCartStore";
import { Spinner } from "@/components/ui/Spinner";
import { VoucherModal } from "@/features/discounts/components/customer/VoucherModal";
import { useState } from "react";

interface CartSummaryProps {
  selectedCount: number;
  selectedTotalPrice: number;
  selectedTotalSavings: number;
  discountCode?: string;
  setDiscountCode?: (code: string) => void;
  appliedDiscount?: CheckoutDiscount | null;
  discountAmount?: number;
  isApplyingDiscount?: boolean;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
}

export const CartSummary = React.memo(function CartSummary({ 
  selectedCount, 
  selectedTotalPrice, 
  selectedTotalSavings,
  discountCode = "",
  setDiscountCode,
  appliedDiscount,
  discountAmount = 0,
  isApplyingDiscount,
  onApplyDiscount,
  onRemoveDiscount
}: CartSummaryProps) {
  const totalSavings = selectedTotalSavings; 
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const handleApply = (code: string) => {
    onApplyDiscount?.(code);
    setIsVoucherModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <VoucherModal 
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onApply={handleApply}
        isApplying={!!isApplyingDiscount}
        appliedCode={appliedDiscount?.code}
        cartTotal={selectedTotalPrice}
      />
      {/* Savings Banner */}
      {selectedCount > 0 && totalSavings > 0 && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <div className="mt-0.5"><Tag size={16} className="text-emerald-600" /></div>
          <p className="text-sm font-medium text-slate-700 leading-snug">
            Bạn đang tiết kiệm <span className="text-emerald-600 font-bold">{formatCurrency(totalSavings)}</span> từ các chương trình khuyến mãi!
          </p>
        </div>
      )}

      {/* Main Summary Block */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-[15px] font-bold text-slate-800 mb-6 uppercase tracking-wider">Tóm tắt đơn hàng</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-slate-600 font-medium">Tạm tính ({selectedCount} sp)</span>
            <span className="font-bold text-slate-900 tabular-nums">{formatCurrency(selectedTotalPrice)}</span>
          </div>

          <div className="flex justify-between items-center text-[15px]">
            <span className="text-slate-600 font-medium">Phí vận chuyển</span>
            <span className="font-bold text-slate-900">Miễn phí</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[15px] font-medium text-slate-600">Mã giảm giá</span>
            
            {!appliedDiscount ? (
              <button 
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-sm font-medium text-green-600  transition-colors hover:cursor-pointer hover:underline"
              >
                Chọn hoặc nhập mã
              </button>
            ) : (
              <div 
                onClick={() => setIsVoucherModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <span className="text-sm font-bold text-emerald-600 group-hover:text-emerald-700">{appliedDiscount.code}</span>
                <button
                  type="button"
                  className="p-1 hover:bg-rose-50 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDiscount?.();
                  }}
                >
                  <X size={14} className="text-slate-400 hover:text-rose-500" />
                </button>
              </div>
            )}
          </div>

          {appliedDiscount && discountAmount > 0 && (
            <div className="flex justify-between items-center text-[15px] animate-in fade-in duration-300">
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Voucher giảm giá
              </span>
              <span className="font-bold text-emerald-600 tabular-nums">- {formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="pt-5 mt-2 border-t border-slate-100 flex flex-col gap-1">
            <div className="flex justify-between items-end gap-4">
              <span className="text-[17px] font-bold text-slate-800">Tổng cộng</span>
              <span className="text-2xl font-bold text-primary tabular-nums leading-none">
                {formatCurrency(Math.max(0, selectedTotalPrice - discountAmount))}
              </span>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-medium mt-1">
              (Đã bao gồm VAT)
            </div>
          </div>
          
          <div className="pt-5">
            <Button 
              asChild 
              disabled={selectedCount === 0}
              className={cn(
                "w-full h-12 rounded-xl text-white text-[15px] font-bold shadow-lg shadow-primary/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group",
                selectedCount > 0 ? "bg-primary hover:bg-primary/90" : "bg-slate-300 cursor-not-allowed pointer-events-none"
              )}
            >
              <Link href={selectedCount > 0 ? ROUTES.CHECKOUT : "#"}>
                Tiến hành thanh toán <MoveUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Button>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400">
              <Lock size={12} />
              Thanh toán an toàn & bảo mật
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Offers Block */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-[14px] font-bold text-slate-800 mb-4 uppercase tracking-wider">Ưu đãi vận chuyển</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <div className="mt-0.5 text-emerald-500"><Truck size={15} /></div>
            Miễn phí ship cho đơn từ 500k
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <div className="mt-0.5 text-amber-500"><Truck size={15} /></div>
            Giao nhanh 2h cho khu vực nội thành
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-600 font-medium">
            <div className="mt-0.5 text-blue-500"><ShieldCheck size={15} /></div>
            Đổi trả miễn phí trong 15 ngày
          </li>
        </ul>
      </div>
    </div>
  );
});
