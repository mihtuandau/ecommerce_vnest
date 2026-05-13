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
    <div className="lg:sticky lg:top-10 space-y-6">
      <Card className="border border-slate-100 shadow-xl shadow-slate-200/20 rounded-2xl overflow-hidden bg-white">
        <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2.5">
          <ShoppingBag className="h-4 w-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-700">Đơn hàng của bạn</h2>
        </div>

        <CardContent className="p-5 space-y-6">
          {/* Item list */}
          <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
              <div key={item.variantId} className="flex gap-4">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100 relative">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span 
                    className="block text-sm font-semibold text-slate-900 leading-snug overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {item.name}
                  </span>
                  {(item.size || item.color) && (
                    <div className="flex gap-2 mt-1">
                      {item.size && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-medium border border-slate-200">
                          Size: {item.size}
                        </span>
                      )}
                      {item.color && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md font-semibold border border-slate-200">
                          Màu: {item.color}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2">
                    <span className="text-xs text-slate-500 font-medium">Số lượng: {item.quantity}</span>
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end">
                      <span className="text-sm font-bold text-slate-900">
                        {formatCurrency((item.discountedPrice || item.price) * item.quantity)}
                      </span>
                      {(item.discountedPrice || (item.originalPrice && item.originalPrice > item.price)) && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          {formatCurrency((item.originalPrice || item.price) * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Discount Section */}
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

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[15px] font-medium text-slate-600">Mã giảm giá</span>
            
            {!appliedDiscount ? (
              <button 
                type="button"
                onClick={() => setIsVoucherModalOpen(true)}
                className="text-sm font-medium text-green-600  transition-colors cursor-pointer hover:underline"
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
                    onRemoveDiscount();
                  }}
                >
                  <X size={14} className="text-slate-400 hover:text-rose-500" />
                </button>
              </div>
            )}
          </div>

          {/* Pricing Totals */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Tạm tính</span>
              <span className="text-slate-900 font-bold tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Phí vận chuyển</span>
                <Truck size={14} className="text-slate-300" />
              </div>
              {isCalculatingFee ? (
                <Spinner size="sm" />
              ) : (
                <span className="text-slate-900 font-bold tabular-nums">
                  {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                </span>
              )}
            </div>

            {appliedDiscount && discountAmount > 0 && (
              <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-emerald-600 font-semibold flex items-center gap-2">
                  <Tag size={14} className="text-emerald-500" />
                  Mã giảm giá
                </span>
                <span className="text-emerald-600 font-bold tabular-nums">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">
                    {formatCurrency(subtotal + shippingFee - discountAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium italic mt-0.5">Đã bao gồm VAT</span>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !canSubmit}
                className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" variant="white" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Xác nhận đặt hàng"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Badges */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-600 uppercase leading-tight">Thanh toán bảo mật 100%</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
          <Truck className="h-5 w-5 text-blue-500" />
          <span className="text-[10px] font-bold text-slate-600 uppercase leading-tight">Giao hàng nhanh chóng</span>
        </div>
      </div>
    </div>
  );
});
