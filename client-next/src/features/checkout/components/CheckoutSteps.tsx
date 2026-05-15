"use client";

import React from "react";
import { Check, MapPin, CreditCard, PackageCheck, ChevronLeft } from "lucide-react";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, name: "Giỏ hàng", icon: MapPin, status: "complete" },
  { id: 2, name: "Thanh toán", icon: CreditCard, status: "current" },
  { id: 3, name: "Hoàn tất", icon: PackageCheck, status: "upcoming" },
];

export const CheckoutSteps = React.memo(function CheckoutSteps() {
  return (
    <nav aria-label="Progress" className="w-full max-w-[520px] mx-auto mb-12">
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step, stepIdx) => (
          <React.Fragment key={step.name}>
            <li className="flex flex-col items-center gap-1.5 relative z-10">
              <span
                className={cn(
                  "h-[32px] w-[32px] flex items-center justify-center rounded-full text-[12px] font-bold transition-all duration-500 border-2",
                  step.status === "complete" ? "bg-[#3A7D5A] border-[#3A7D5A] text-white" : 
                  step.status === "current" ? "bg-[#3D2B1A] border-[#3D2B1A] text-white shadow-lg shadow-[#3D2B1A]/10" : 
                  "bg-white border-[#DDD6C8] text-[#8A7966]"
                )}
              >
                {step.status === "complete" ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : (
                  step.id
                )}
              </span>
              <span className={cn(
                "whitespace-nowrap text-[11.5px] font-bold uppercase tracking-widest transition-colors",
                step.status === "complete" ? "text-[#3A7D5A]" :
                step.status === "current" ? "text-[#3D2B1A]" : 
                "text-[#8A7966]"
              )}>
                {step.name}
              </span>
            </li>
            {stepIdx !== steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-[#DDD6C8] mb-6 mx-[-1px] relative z-0">
                <div className={cn(
                  "h-full transition-all duration-1000",
                  step.status === "complete" ? "bg-[#3A7D5A]" : "bg-transparent"
                )} />
              </div>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
});
