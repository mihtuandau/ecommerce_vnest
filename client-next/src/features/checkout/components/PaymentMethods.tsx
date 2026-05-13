"use client";

import React from "react";
import Image from "next/image";
import { CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export const PaymentMethods = React.memo(function PaymentMethods({ paymentMethod, setPaymentMethod }: PaymentMethodsProps) {
  const methods = [
    { 
      id: "COD", 
      name: "Thanh toán khi nhận hàng (COD)", 
      desc: "Kiểm tra hàng trước khi thanh toán",
      icon: Banknote,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      id: "VNPAY", 
      name: "Ví VNPay / Thẻ ATM", 
      desc: "Thanh toán nhanh qua ứng dụng VNPay",
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      logo: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
    },
    { 
      id: "MOMO", 
      name: "Ví MoMo", 
      desc: "Thanh toán nhanh, hoàn tiền tức thì",
      icon: CreditCard,
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Phương thức thanh toán</h2>
      </div>

      <div className="p-6 space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => setPaymentMethod(method.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
              paymentMethod === method.id 
                ? "bg-blue-50/30 border-primary/20 ring-1 ring-primary/5" 
                : "bg-transparent border-slate-100 hover:border-slate-200"
            )}
          >
            {/* Radio Circle */}
            <div className={cn(
              "h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
              paymentMethod === method.id ? "border-primary bg-primary" : "border-slate-300"
            )}>
              {paymentMethod === method.id && (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>

            {/* Icon Container */}
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-50 border border-slate-100",
              paymentMethod === method.id ? "border-primary/10 bg-white" : ""
            )}>
              {method.id === "MOMO" ? (
                <div className="h-6 w-6 rounded-md bg-[#A50064] flex items-center justify-center text-white text-[8px] font-bold shadow-sm">MOMO</div>
              ) : method.logo ? (
                <Image 
                  src={method.logo} 
                  alt={method.name} 
                  width={24} 
                  height={24} 
                  className="h-6 w-6 object-contain" 
                />
              ) : (
                <method.icon className={cn("h-5 w-5", method.color)} />
              )}
            </div>
            
            {/* Name & Desc */}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "text-sm font-bold transition-colors",
                paymentMethod === method.id ? "text-slate-900" : "text-slate-600"
              )}>
                {method.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{method.desc}</p>
            </div>

            {/* Status Badge */}
            {paymentMethod === method.id && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 size={10} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Đã chọn</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
