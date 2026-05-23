"use client";

import React from "react";
import { Banknote, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/utils/cn";
import { CheckoutCard } from "./CheckoutCard";

interface PaymentAvailability {
  COD?: boolean;
  VNPAY?: boolean;
}

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  availability?: PaymentAvailability;
  stepNumber?: number | string;
}

export const PaymentMethods = React.memo(function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  availability,
  stepNumber = "4",
}: PaymentMethodsProps) {
  const methods = [
    {
      id: "COD",
      name: "Thanh toán khi nhận hàng (COD)",
      desc: "Kiểm tra hàng trước khi thanh toán",
      icon: Banknote,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      enabled: availability?.COD ?? true,
      disabledReason: "COD đang tạm tắt",
    },
    {
      id: "VNPAY",
      name: "Ví VNPay",
      desc: "Thanh toán nhanh qua ứng dụng VNPay",
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      enabled: availability?.VNPAY ?? true,
      disabledReason: "VNPay đang tạm tắt",
    },
    {
      id: "MOMO",
      name: "Ví MoMo",
      desc: "Thanh toán nhanh, hoàn tiền tức thì",
      icon: CreditCard,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      enabled: true,
      disabledReason: "",
    },
  ];

  return (
    <CheckoutCard
      step={stepNumber}
      title="Phương thức thanh toán"
      action={
        <div className="flex items-center gap-1.5 text-[11.5px] text-brand-taupe">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-emerald-600"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Bảo mật SSL
        </div>
      }
    >
      <div className="space-y-[10px]">
        {methods.map((method) => {
          const isSelected = paymentMethod === method.id;
          const isDisabled = !method.enabled;

          return (
            <div
              key={method.id}
              className={cn(
                "overflow-hidden rounded-[12px] border-[1.5px] transition-all",
                isDisabled
                  ? "border-brand-sand bg-brand-cream/40 opacity-60"
                  : isSelected
                    ? "border-primary"
                    : "border-brand-sand hover:border-brand-taupe/30"
              )}
            >
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-[14px] text-left",
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all",
                    isSelected && !isDisabled
                      ? "border-primary bg-primary"
                      : "border-brand-sand bg-white"
                  )}
                >
                  {isSelected && !isDisabled && (
                    <div className="h-1.5 w-1.5 animate-in rounded-full bg-white duration-200 zoom-in-50" />
                  )}
                </div>
                <div
                  className={cn(
                    "flex h-6 w-9 shrink-0 items-center justify-center rounded-[5px] text-[10px] font-bold tracking-[0.04em]",
                    method.id === "MOMO"
                      ? "bg-[#A50064] text-white"
                      : method.id === "VNPAY"
                        ? "bg-[#005BAA] text-white"
                        : "bg-brand-sand text-primary"
                  )}
                >
                  {method.id === "MOMO"
                    ? "MoMo"
                    : method.id === "VNPAY"
                      ? "VNPAY"
                      : method.id}
                </div>
                <span className="flex-1 text-[13.5px] font-medium text-primary">
                  {method.name}
                </span>
                <span className="text-[12px] text-brand-taupe">
                  {isDisabled ? method.disabledReason : method.desc}
                </span>
              </button>

              {isSelected && !isDisabled && (
                <div className="animate-in border-t border-brand-sand px-4 pb-[18px] pt-4 duration-300 fade-in">
                  {method.id === "MOMO" ? (
                    <div className="rounded-[12px] border border-brand-sand bg-brand-ivory p-5 text-center">
                      <div className="mx-auto mb-3 flex h-[120px] w-[120px] items-center justify-center rounded-[8px] border border-brand-sand bg-white text-[11px] text-brand-taupe">
                        QR Placeholder
                      </div>
                      <p className="text-[12px] text-brand-taupe">
                        Quét mã bằng ứng dụng MoMo
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-[#A50064]">
                        Sử dụng ví MoMo để thanh toán
                      </p>
                    </div>
                  ) : method.id === "VNPAY" ? (
                    <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-4 text-[13px] leading-relaxed text-foreground">
                      Bạn sẽ được chuyển đến cổng VNPAY để hoàn tất thanh toán. Hỗ trợ
                      tất cả thẻ ATM nội địa và ví điện tử liên kết VNPAY.
                    </div>
                  ) : method.id === "COD" ? (
                    <div className="rounded-[10px] bg-brand-ivory p-4 text-[13px] leading-relaxed text-foreground">
                      <strong>Lưu ý khi thanh toán COD:</strong>
                      <br />
                      Vui lòng chuẩn bị đúng số tiền cần thanh toán. Shipper không đổi
                      tiền lẻ.
                      <br />
                      Phí thu hộ: <strong>Miễn phí</strong> cho đơn trên 500k.
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}

        {methods.every((method) => !method.enabled) && (
          <div className="rounded-[12px] border border-amber-200 bg-amber-50 p-4 text-[13px] font-medium text-amber-800">
            Hiện chưa có phương thức thanh toán khả dụng. Vui lòng quay lại sau.
          </div>
        )}
      </div>
    </CheckoutCard>
  );
});
