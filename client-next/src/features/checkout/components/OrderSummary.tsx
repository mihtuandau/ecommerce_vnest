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
  totalOriginal: number;
  discountChoice: "FLASH_SALE" | "VOUCHER";
  // Discount props
  discountCode: string;
  setDiscountCode: (code: string) => void;
  appliedDiscount: CheckoutDiscount | null;
  discountAmount: number;
  onApplyDiscount: () => void;
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
  totalOriginal,
  discountChoice,
  discountCode,
  setDiscountCode,
  appliedDiscount,
  discountAmount,
  onApplyDiscount,
  onRemoveDiscount,
  isApplyingDiscount = false,
}: OrderSummaryProps) {
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
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 mb-1">
              <Tag size={16} className="text-primary" />
              <span className="text-sm font-bold uppercase tracking-wider">Mã giảm giá</span>
            </div>
            
            {!appliedDiscount ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập mã tại đây..."
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                />
                <Button 
                  onClick={onApplyDiscount}
                  disabled={!discountCode || isApplyingDiscount}
                  className="h-11 px-6 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
                >
                  {isApplyingDiscount ? <Spinner size="sm" variant="white" /> : "Áp dụng"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-tighter">Đã áp dụng mã</p>
                    <p className="text-sm font-black text-emerald-600">{appliedDiscount.code}</p>
                  </div>
                </div>
                <button 
                  onClick={onRemoveDiscount}
                  className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-400 hover:text-emerald-600 transition-colors"
                >
                  <X size={18} />
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
                <span className="text-slate-900 font-bold tabular-nums">{formatCurrency(shippingFee)}</span>
              )}
            </div>

            {appliedDiscount && discountAmount > 0 && discountChoice === "VOUCHER" && (
              <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
                <span className="text-emerald-600 font-bold flex items-center gap-2 italic">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Mã giảm giá
                </span>
                <span className="text-emerald-600 font-bold tabular-nums">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            {discountChoice === "FLASH_SALE" && (totalOriginal - subtotal) > 0 && (
               <div className="flex justify-between items-center text-sm animate-in fade-in slide-in-from-right-4 duration-300">
               <span className="text-primary font-bold flex items-center gap-2 italic">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                 Giảm giá Flash Sale
               </span>
               <span className="text-primary font-bold tabular-nums">-{formatCurrency(totalOriginal - subtotal)}</span>
             </div>
            )}

            <div className="pt-5 mt-2 border-t border-slate-100 flex justify-between items-end">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tổng cộng</p>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-primary tabular-nums tracking-tighter">
                    {formatCurrency(subtotal + shippingFee - (discountChoice === "VOUCHER" ? discountAmount : 0))}
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
