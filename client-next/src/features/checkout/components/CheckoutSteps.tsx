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
    <nav aria-label="Progress" className="w-full lg:max-w-xl">
      <ol role="list" className="flex items-center justify-end">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn(stepIdx !== steps.length - 1 ? "flex-1" : "", "relative")}>
            <div className="group flex items-center">
              <span className="flex items-center shrink-0">
                <span
                  className={cn(
                    "h-9 w-9 flex items-center justify-center rounded-xl border-2 transition-all",
                    step.status === "complete" ? "bg-primary border-primary text-white" : 
                    step.status === "current" ? "border-primary text-primary bg-primary/5 shadow-md shadow-primary/10" : 
                    "border-slate-100 text-slate-300"
                  )}
                >
                  {step.status === "complete" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </span>
                <span className={cn(
                  "ml-3 text-xs font-bold uppercase tracking-wider hidden sm:block",
                  step.status === "current" ? "text-slate-900" : "text-slate-400"
                )}>
                  {step.name}
                </span>
              </span>
              {stepIdx !== steps.length - 1 ? (
                <div className="flex-1 mx-4 hidden sm:block">
                  <div className={cn(
                    "h-[1.5px] w-full rounded-full transition-all duration-500",
                    step.status === "complete" ? "bg-primary" : "bg-slate-100"
                  )} />
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
});
