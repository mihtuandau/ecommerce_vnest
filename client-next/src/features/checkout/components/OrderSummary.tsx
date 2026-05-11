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

export function OrderSummary({
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
  const flashSaleDiscount = totalOriginal - subtotal;
  const isVoucherActive = discountChoice === "VOUCHER" && discountAmount > 0;
  
  const displaySubtotal = totalOriginal;
  const displayDiscount = isVoucherActive ? discountAmount : flashSaleDiscount;
  const total = totalOriginal + shippingFee - displayDiscount;

  return (
    <Card className="sticky top-24 border border-slate-100 shadow-sm rounded-3xl overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
        <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
          <ShoppingBag className="h-5 w-5" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Đơn hàng của bạn</h3>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Items List */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar border-b border-slate-50 pb-2">
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
                <span className="block text-sm font-medium text-slate-800 line-clamp-2 leading-snug">{item.name}</span>
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
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500 font-normal">Số lượng: {item.quantity}</span>
                  <div className="text-right flex flex-col items-end">
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

        {/* Discount Section - Clean & Normal Case */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <Tag size={14} className="text-primary" />
             <span className="text-sm font-semibold text-slate-700">Mã giảm giá</span>
          </div>
          
          {appliedDiscount ? (
            <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary">{appliedDiscount.code}</span>
                <span className="text-xs text-primary/80 font-normal">Đã áp dụng giảm {formatCurrency(discountAmount)}</span>
              </div>
              <button 
                type="button"
                onClick={onRemoveDiscount}
                className="h-8 w-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input 
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã tại đây..."
                className="flex-1 h-11 bg-slate-100 border border-slate-200 rounded-2xl px-4 text-sm font-semibold focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600"
              />
              <Button 
                type="button"
                onClick={onApplyDiscount}
                disabled={!discountCode || isApplyingDiscount}
                className="h-11 px-6 rounded-2xl text-sm font-semibold bg-primary hover:bg-slate-900 text-white transition-all shadow-sm"
              >
                {isApplyingDiscount ? <Spinner size="sm" /> : "Áp dụng"}
              </Button>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center text-sm font-normal text-slate-600">
            <span>Tạm tính</span>
            <span className="text-slate-900 font-semibold">{formatCurrency(displaySubtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-sm font-normal text-slate-600">
            <span>Phí vận chuyển</span>
            {isCalculatingFee ? (
              <div className="flex items-center gap-2 text-primary animate-pulse italic">
                <Spinner size="sm" />
                <span className="text-xs">Đang tính...</span>
              </div>
            ) : (
              <span className="text-slate-900 font-semibold">{formatCurrency(shippingFee)}</span>
            )}
          </div>
          {displayDiscount > 0 && (
            <div className="flex justify-between items-center text-sm animate-in slide-in-from-right-4 duration-300">
              <span className="text-primary font-semibold">
                {isVoucherActive ? `Voucher (${appliedDiscount?.code})` : "Giảm giá Flash Sale"}
              </span>
              <span className="font-semibold text-primary">-{formatCurrency(displayDiscount)}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="pt-5 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-slate-900">Tổng cộng</span>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary tabular-nums block leading-none">
                {formatCurrency(total)}
              </span>
              <p className="text-xs text-slate-500 mt-1.5 font-medium">Đã bao gồm VAT</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting || !canSubmit}
          className={cn(
            "w-full h-14 rounded-2xl text-base font-semibold transition-all active:scale-95 shadow-lg",
            !canSubmit ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed" : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
          )}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Spinner size="sm" variant="white" />
              Đang đặt hàng...
            </div>
          ) : (
            "Xác nhận đặt hàng"
          )}
        </Button>

        {/* Trust Badges */}
        <div className="pt-2 space-y-3">
          {[
            { icon: ShieldCheck, text: "Bảo mật thông tin 100%", color: "text-green-600" },
            { icon: CheckCircle2, text: "Hàng chính hãng Minh Tuấn Shop", color: "text-blue-600" },
            { icon: Truck, text: "Giao hàng nhanh toàn quốc", color: "text-slate-500" },
          ].map((info, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
              <info.icon className={cn("h-4 w-4", info.color)} />
              {info.text}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
