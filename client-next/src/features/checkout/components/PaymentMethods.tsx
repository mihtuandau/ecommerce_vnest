"use client";

import React from "react";
import { CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

interface PaymentMethodsProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
}

export function PaymentMethods({ paymentMethod, setPaymentMethod }: PaymentMethodsProps) {
  const methods = [
    { 
      id: "COD", 
      name: "Thanh toán khi nhận hàng (COD)", 
      icon: Banknote,
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    { 
      id: "VNPAY", 
      name: "Thanh toán Online (VNPay / Thẻ ATM / QR Code)", 
      icon: Wallet,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      logo: "https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
    }
  ];

  return (
    <Card className="border border-slate-100 shadow-none rounded-2xl overflow-hidden bg-white">
      <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2.5">
        <CreditCard className="h-4 w-4 text-slate-400" />
        <h2 className="text-sm font-bold text-slate-700">Phương thức thanh toán</h2>
      </div>

      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={cn(
                "flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors group",
                paymentMethod === method.id ? "bg-blue-50/30" : "hover:bg-slate-50/50"
              )}
            >
              {/* Radio Circle */}
              <div className={cn(
                "h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all",
                paymentMethod === method.id 
                  ? "border-[#1565C1] bg-[#1565C1]" 
                  : "border-slate-300 bg-white group-hover:border-slate-400"
              )}>
                {paymentMethod === method.id && (
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </div>

              {/* Icon Container */}
              <div className={cn(
                "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-100 bg-white",
                paymentMethod === method.id ? "border-blue-100 shadow-sm" : ""
              )}>
                {method.logo ? (
                  <img src={method.logo} alt={method.name} className="h-5 w-5 object-contain" />
                ) : (
                  <method.icon className={cn("h-5 w-5", method.color)} />
                )}
              </div>
              
              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-semibold transition-colors",
                  paymentMethod === method.id ? "text-[#1565C1]" : "text-slate-600"
                )}>
                  {method.name}
                </p>
              </div>

              {/* Status Badge */}
              {paymentMethod === method.id && (
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-100 text-[#1565C1]">
                  <CheckCircle2 size={10} />
                  <span className="text-xs font-bold">Đã chọn</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
