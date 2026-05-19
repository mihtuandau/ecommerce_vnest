"use client";

import React from "react";
import Image from "next/image";
import { CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  stepNumber?: number | string;
}

export const PaymentMethods = React.memo(function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
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
    },
    {
      id: "VNPAY",
      name: "Ví VNPay",
      desc: "Thanh toán nhanh qua ứng dụng VNPay",
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      logo: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg",
    },
    {
      id: "MOMO",
      name: "Ví MoMo",
      desc: "Thanh toán nhanh, hoàn tiền tức thì",
      icon: CreditCard,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-brand-sand overflow-hidden">
      <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold">
            {stepNumber}
          </div>
          <h2 className="text-[15px] font-bold text-primary">Phương thức thanh toán</h2>
        </div>
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
      </div>

      <div className="p-6 space-y-[10px]">
        {methods.map((method) => (
          <div
            key={method.id}
            className={cn(
              "border-[1.5px] rounded-[12px] transition-all overflow-hidden",
              paymentMethod === method.id
                ? "border-primary"
                : "border-brand-sand hover:border-brand-taupe/30"
            )}
          >
            <div
              onClick={() => setPaymentMethod(method.id)}
              className="px-4 py-[14px] flex items-center gap-3 cursor-pointer"
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  paymentMethod === method.id
                    ? "border-primary bg-primary"
                    : "border-brand-sand bg-white"
                )}
              >
                {paymentMethod === method.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
                )}
              </div>
              <div
                className={cn(
                  "w-9 h-6 rounded-[5px] flex items-center justify-center text-[10px] font-bold tracking-[0.04em] shrink-0",
                  method.id === "MOMO"
                    ? "bg-[#A50064] text-white"
                    : method.id === "VNPAY"
                      ? "bg-[#005BAA] text-white"
                      : method.id === "COD"
                        ? "bg-brand-sand text-primary"
                        : "bg-slate-200"
                )}
              >
                {method.id === "MOMO"
                  ? "MoMo"
                  : method.id === "VNPAY"
                    ? "VNPAY"
                    : method.id}
              </div>
              <span className="text-[13.5px] font-medium text-primary flex-1">
                {method.name}
              </span>
              <span className="text-[12px] text-brand-taupe">{method.desc}</span>
            </div>

            {/* Expandable Body */}
            {paymentMethod === method.id && (
              <div className="px-4 pb-[18px] pt-4 border-t border-brand-sand animate-in fade-in duration-300">
                {method.id === "MOMO" ? (
                  <div className="bg-brand-ivory border border-brand-sand rounded-[12px] p-5 text-center">
                    <div className="w-[120px] h-[120px] bg-white border border-brand-sand rounded-[8px] mx-auto mb-3 flex items-center justify-center text-[11px] text-brand-taupe">
                      QR Placeholder
                    </div>
                    <p className="text-[12px] text-brand-taupe">
                      Quét mã bằng ứng dụng MoMo
                    </p>
                    <p className="text-[13px] font-bold text-[#A50064] mt-1">
                      Sử dụng ví MoMo để thanh toán
                    </p>
                  </div>
                ) : method.id === "VNPAY" ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4 text-[13px] text-foreground leading-relaxed">
                    Bạn sẽ được chuyển đến cổng VNPAY để hoàn tất thanh toán. Hỗ trợ tất
                    cả thẻ ATM nội địa và ví điện tử liên kết VNPAY.
                  </div>
                ) : method.id === "COD" ? (
                  <div className="bg-brand-ivory rounded-[10px] p-4 text-[13px] text-foreground leading-relaxed">
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
        ))}
      </div>
    </div>
  );
});
