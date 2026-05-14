"use client";

import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ShoppingBag, ShieldCheck, CheckCircle2, Truck, Tag, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { CartItem } from "@/store/useCartStore";
import { VoucherModal } from "@/features/discounts/components/customer/VoucherModal";
import { useState } from "react";

type CheckoutDiscount = {
  id?: number;
  code?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  maxDiscountAmount?: number;
  minOrderAmount?: number;
};

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  isSubmitting: boolean;
  canSubmit: boolean;
  isCalculatingFee?: boolean;
  // Discount props
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: CheckoutDiscount | null;
  discountAmount: number;
  onApplyDiscount: (code: string) => void;
  onRemoveDiscount: () => void;
  isApplyingDiscount?: boolean;
}

export const OrderSummary = React.memo(function OrderSummary({
  items,
  subtotal,
  shippingFee,
  isSubmitting,
  canSubmit,
  isCalculatingFee = false,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  discountAmount,
  onApplyDiscount,
  onRemoveDiscount,
  isApplyingDiscount = false,
}: OrderSummaryProps) {
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  return (
    <div className="lg:sticky lg:top-10 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="px-6 py-5 border-b border-[#F3EFE8] flex items-center gap-3 bg-white">
          <h2 className="text-[16px] font-bold text-[#3D2B1A] font-serif">Đơn hàng của bạn</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Item list */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4 group">
                <div className="h-14 w-14 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500" 
                  />
                  <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center border border-white shadow-sm">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                   <div className="flex justify-between gap-4">
                      <span className="text-xs font-bold text-slate-900 leading-relaxed line-clamp-2 flex-1">
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                      </span>
                   </div>
                   {(item.size || item.color) && (
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">
                      {item.color}{item.size ? ` / ${item.size}` : ""}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Voucher Section */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-700">Mã giảm giá</span>
            <VoucherModal 
              isOpen={isVoucherModalOpen}
              onClose={() => setIsVoucherModalOpen(false)}
              onApply={(code) => {
                onApplyDiscount(code);
                setIsVoucherModalOpen(false);
              }}
              isApplying={!!isApplyingDiscount}
              appliedCode={appliedDiscount?.code}
              cartTotal={subtotal}
            />
            
            {!appliedDiscount ? (
              <button 
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-xs font-bold text-primary transition-colors cursor-pointer hover:underline"
              >
                Chọn hoặc nhập mã
              </button>
            ) : (
              <div 
                onClick={() => setIsVoucherModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <span className="text-xs font-bold text-emerald-600 group-hover:text-emerald-700">{appliedDiscount.code}</span>
                <button
                  type="button"
                  className="p-1 hover:bg-rose-50 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDiscount();
                  }}
                >
                  <X size={12} className="text-slate-400 hover:text-rose-500" />
                </button>
              </div>
            )}
          </div>

          {/* Pricing Totals */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Tạm tính</span>
              <span className="text-slate-900 font-bold tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">Giảm giá</span>
              <span className="text-rose-600 font-bold tabular-nums">
                {discountAmount > 0 ? `-${formatCurrency(discountAmount)}` : "0đ"}
              </span>
            </div>

            <div className="flex justify-between items-start text-xs">
              <span className="text-slate-500 font-medium">Phí vận chuyển</span>
              <div className="text-right">
                {isCalculatingFee ? (
                  <Spinner size="sm" />
                ) : (
                  <span className="text-emerald-600 font-bold tabular-nums uppercase">
                    {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium italic">Giao hàng tiêu chuẩn (2-4 ngày)</p>
              </div>
            </div>

            <div className="pt-6 mt-2 border-t border-[#F3EFE8] flex justify-between items-end">
               <span className="text-[15px] font-bold text-[#3D2B1A] font-serif">Tổng cộng</span>
               <div className="text-right">
                  <span className="text-[28px] font-bold text-[#3D2B1A] tabular-nums tracking-tighter block font-serif">
                    {formatCurrency(subtotal + shippingFee - discountAmount)}
                  </span>
                  <span className="text-[9px] text-[#8A7966] font-bold uppercase mt-1 block tracking-wider">(Đã bao gồm VAT)</span>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !canSubmit}
              className="w-full mt-6 h-14 rounded-full bg-[#3D2B1A] hover:bg-[#C4783A] text-white font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 group shadow-xl shadow-[#3D2B1A]/20 border-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner size="sm" variant="white" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Xác nhận đặt hàng</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-4 font-medium flex items-center justify-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" />
              Thanh toán được mã hoá & bảo mật
            </p>
          </div>
        </div>
      </div>

      {/* Safety Badges */}
      <div className="grid grid-cols-3 gap-2 px-2">
        <div className="flex flex-col items-center gap-2 text-center p-3">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-1 border border-slate-100">
             <ShoppingBag size={14} />
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">Đổi trả 15 ngày</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center p-3">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-1 border border-slate-100">
             <ShieldCheck size={14} />
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">Hàng chính hãng</span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center p-3">
          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-1 border border-slate-100">
             <Truck size={14} />
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">Hỗ trợ 24/7</span>
        </div>
      </div>
    </div>
  );
});
