"use client";

import React, { useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { CartItem } from "@/store/useCartStore";
import { VoucherModal } from "@/features/discounts/components/customer/VoucherModal";
import { cn } from "@/utils/cn";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  const total = subtotal + shippingFee - discountAmount;

  return (
    <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden shadow-sm">
      {/* OS Header */}
      <div className="px-[22px] py-[18px] border-b border-brand-sand flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-primary font-serif">
          Đơn hàng của bạn
        </h2>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[12.5px] font-medium text-brand-bronze hover:underline flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <ChevronUp size={14} /> Ẩn
            </>
          ) : (
            <>
              <ChevronDown size={14} /> Xem
            </>
          )}
        </button>
      </div>

      {/* OS Items */}
      {isExpanded && (
        <div className="px-[22px] py-4 border-b border-brand-sand space-y-5 max-h-[400px] overflow-y-auto animate-in slide-in-from-top-2 duration-300 custom-scrollbar bg-white">
          {(() => {
            const groups = items.reduce(
              (acc: { [key: string]: typeof items }, item) => {
                const key = item.productId || item.name;
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
              },
              {}
            );

            return Object.entries(groups).map(([key, groupItems]) => (
              <div key={key} className="space-y-2.5">
                {/* Group Product Name */}
                <div className="flex items-center gap-2">
                  <div className="w-1 h-3.5 bg-brand-bronze rounded-full" />
                  <p className="text-[13px] font-bold text-primary font-serif truncate">
                    {groupItems[0].name}
                  </p>
                </div>

                {/* Group Variants */}
                <div className="space-y-2 pl-3">
                  {groupItems.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex gap-[12px] items-center group/item"
                    >
                      <div className="w-[48px] h-[58px] rounded-[8px] bg-brand-ivory flex items-center justify-center text-[22px] shrink-0 relative border border-brand-sand/50 overflow-hidden">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform group-hover/item:scale-110 duration-500"
                        />
                        <span className="absolute -top-[4px] -right-[4px] w-4.5 h-4.5 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-1.5 mb-1">
                          {item.color && (
                            <span className="text-[9px] font-bold text-brand-taupe bg-brand-cream border border-brand-sand/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-[9px] font-bold text-brand-taupe bg-brand-cream border border-brand-sand/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {item.size}
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] font-bold text-brand-bronze font-serif">
                          {formatCurrency(
                            (item.discountedPrice || item.price) * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}

      {/* Voucher Modal Toggle */}
      <div className="px-[22px] py-4 border-b border-brand-sand flex items-center justify-between">
        <span className="text-[13px] font-bold text-primary">Mã giảm giá</span>
        <button
          type="button"
          onClick={() => setIsVoucherModalOpen(true)}
          className={cn(
            "text-[12px] font-bold",
            appliedDiscount ? "text-emerald-600" : "text-brand-bronze hover:underline"
          )}
        >
          {appliedDiscount ? appliedDiscount.code : "Chọn hoặc nhập mã"}
        </button>
      </div>

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

      {/* Pricing Rows */}
      <div className="px-[22px] py-4 border-b border-brand-sand space-y-[10px]">
        <div className="flex justify-between text-[13px]">
          <span className="text-brand-taupe">Tạm tính</span>
          <span className="text-primary font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-brand-taupe">Giảm giá</span>
          <span className="text-destructive font-medium">
            -{formatCurrency(discountAmount)}
          </span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-brand-taupe">Vận chuyển</span>
          <span
            className={cn(
              "text-[13px] font-bold",
              shippingFee === 0 ? "text-emerald-600" : "text-primary"
            )}
          >
            {isCalculatingFee ? (
              <Spinner size="sm" />
            ) : shippingFee === 0 ? (
              "Miễn phí"
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>
      </div>

      {/* Total Section */}
      <div className="px-[22px] py-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-[15px] font-bold text-primary">Tổng cộng</span>
          <span className="text-[26px] font-bold text-brand-bronze font-serif">
            {formatCurrency(total)}
          </span>
        </div>
        <p className="text-[11px] text-brand-taupe text-right italic tracking-wider font-bold">
          Đã bao gồm VAT
        </p>
      </div>

      {/* Submit Button */}
      <div className="px-[22px] pb-[14px]">
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="w-full h-[52px] bg-primary hover:bg-black text-brand-cream rounded-full text-[15px] font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Spinner size="sm" variant="white" />
          ) : (
            <>
              <CheckCircle2 size={16} />
              <span>Đặt hàng ngay</span>
            </>
          )}
        </button>
      </div>

      {/* Terms & Badges */}
      <p className="px-[22px] pb-[18px] text-[11px] text-brand-taupe text-center leading-[1.6]">
        Bằng cách đặt hàng, bạn đồng ý với{" "}
        <a href="#" className="text-brand-bronze hover:underline font-bold">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-brand-bronze hover:underline font-bold">
          Chính sách bảo mật
        </a>
        .
      </p>

      <div className="py-[14px] px-[22px] border-t border-brand-sand flex items-center justify-center gap-4 bg-brand-cream/50">
        <div className="flex items-center gap-1 text-[9px] text-brand-taupe font-bold tracking-widest">
          <ShieldCheck size={12} className="text-emerald-600" /> SSL 256-bit
        </div>
        <div className="flex items-center gap-1 text-[9px] text-brand-taupe font-bold tracking-widest">
          <CheckCircle2 size={12} className="text-emerald-600" /> PCI DSS
        </div>
        <div className="flex items-center gap-1 text-[9px] text-brand-taupe font-bold tracking-widest">
          <Truck size={12} className="text-emerald-600" /> Chính hãng
        </div>
      </div>
    </div>
  );
});
