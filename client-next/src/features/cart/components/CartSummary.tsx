"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, RotateCcw, Lock, Tag, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import { CheckoutDiscount } from "@/store/useCartStore";
import { VoucherModal } from "@/features/discounts/components/customer/VoucherModal";

interface CartSummaryProps {
  selectedCount: number;
  selectedTotalPrice: number;
  appliedDiscount?: CheckoutDiscount | null;
  discountAmount?: number;
  isApplyingDiscount?: boolean;
  onApplyDiscount?: (code: string) => void;
  onRemoveDiscount?: () => void;
}

export const CartSummary = React.memo(function CartSummary({ 
  selectedCount, 
  selectedTotalPrice, 
  appliedDiscount,
  discountAmount = 0,
  isApplyingDiscount,
  onApplyDiscount,
  onRemoveDiscount
}: CartSummaryProps) {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const total = Math.max(0, selectedTotalPrice - discountAmount);

  const handleApply = (code: string) => {
    onApplyDiscount?.(code);
    setIsVoucherModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <VoucherModal 
        isOpen={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        onApply={handleApply}
        isApplying={!!isApplyingDiscount}
        appliedCode={appliedDiscount?.code}
        cartTotal={selectedTotalPrice}
      />

      <div className="bg-white rounded-[24px] p-6 border border-[#DDD6C8] shadow-sm">
        <h2 className="text-lg font-bold text-[#3D2B1A] mb-6 font-serif">Tóm tắt đơn hàng</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[14px]">
            <span className="text-[#8A7966] font-medium">Tạm tính ({selectedCount} sản phẩm)</span>
            <span className="font-bold text-[#3D2B1A] tabular-nums">{formatCurrency(selectedTotalPrice)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[#F3EFE8]">
            <span className="text-[#8A7966] font-medium text-[14px]">Mã giảm giá</span>
            {!appliedDiscount ? (
              <button 
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-[13px] font-bold text-[#C4783A] hover:underline"
              >
                Chọn mã
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-bold text-[#C4783A] uppercase tracking-wider">{appliedDiscount.code}</span>
                <button onClick={onRemoveDiscount} className="p-1 hover:bg-red-50 rounded-full transition-colors">
                  <X size={12} className="text-red-500" />
                </button>
              </div>
            )}
          </div>

          {appliedDiscount && discountAmount > 0 && (
            <div className="flex justify-between items-center text-[14px] animate-in fade-in slide-in-from-top-1 duration-300">
              <span className="text-[#C4783A] font-bold flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-[#C4783A]" />
                Giảm giá voucher
              </span>
              <span className="font-bold text-[#C4783A] tabular-nums">- {formatCurrency(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pb-3">
            <span className="text-[#8A7966] font-medium text-[14px]">Phí vận chuyển</span>
            <span className="font-bold text-[#27AE60] text-[13px] italic">Miễn phí</span>
          </div>

          <div className="pt-5 border-t border-[#F3EFE8] flex flex-col gap-1">
            <div className="flex justify-between items-end">
              <span className="text-base font-bold text-[#3D2B1A] font-serif">Tổng cộng</span>
              <div className="text-[24px] font-bold text-[#3D2B1A] tabular-nums leading-none font-serif">
                {formatCurrency(total)}
              </div>
            </div>
            <div className="text-right text-[10px] text-[#8A7966] font-bold uppercase tracking-widest mt-1">
              Đã bao gồm VAT
            </div>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button 
              asChild 
              disabled={selectedCount === 0}
              className={cn(
                "w-full h-12 rounded-xl text-white text-sm font-bold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2",
                selectedCount > 0 ? "bg-[#3D2B1A] hover:bg-[#2A1D11]" : "bg-[#DDD6C8] cursor-not-allowed pointer-events-none"
              )}
            >
              <Link href={selectedCount > 0 ? ROUTES.CHECKOUT : "#"}>
                <Lock size={16} />
                Thanh toán ngay
              </Link>
            </Button>
            
            <Link 
              href={ROUTES.HOME}
              className="flex items-center justify-center gap-2 text-[13px] font-bold text-[#8A7966] hover:text-[#3D2B1A] transition-colors py-1"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {["VNPAY", "MoMo", "Visa", "COD"].map(pay => (
              <div key={pay} className="px-2 py-1 rounded bg-[#FAF8F4] text-[9px] font-black text-[#8A7966] border border-[#DDD6C8] uppercase tracking-tighter">
                {pay}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-5 border border-[#DDD6C8] shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><Lock size={16} /></div>
          <div>
            <h4 className="text-[12px] font-bold text-[#3D2B1A]">Bảo mật</h4>
            <p className="text-[10px] text-[#8A7966]">SSL 256-bit</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><RotateCcw size={16} /></div>
          <div>
            <h4 className="text-[12px] font-bold text-[#3D2B1A]">30 ngày đổi trả</h4>
            <p className="text-[10px] text-[#8A7966]">Miễn phí hoàn trả</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><Truck size={16} /></div>
          <div>
            <h4 className="text-[12px] font-bold text-[#3D2B1A]">Giao nhanh</h4>
            <p className="text-[10px] text-[#8A7966]">Dự kiến 2-3 ngày</p>
          </div>
        </div>
      </div>
    </div>
  );
});
