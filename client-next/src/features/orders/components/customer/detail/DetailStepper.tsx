"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { OrderStatus } from "@/types/enums";

interface DetailStepperProps {
  status: OrderStatus;
  isCancelled: boolean;
}

const steps = [
  { status: OrderStatus.PENDING, label: "Đã đặt hàng" },
  { status: OrderStatus.PROCESSING, label: "Đã xác nhận" },
  { status: OrderStatus.SHIPPED, label: "Đang giao" },
  { status: OrderStatus.DELIVERED, label: "Hoàn thành" },
];

export function DetailStepper({ status, isCancelled }: DetailStepperProps) {
  if (isCancelled) {
    return null;
  }

  const currentStepIndex = steps.findIndex((s) => s.status === status);

  return (
    <div className="bg-slate-50/30 rounded-xl p-6 border border-slate-100/50">
      <div className="relative flex justify-between">
        <div className="absolute top-[17px] left-0 w-full h-[2px] bg-slate-200 z-0" />
        <div
          className="absolute top-[17px] left-0 h-[2px] bg-primary/40 transition-all duration-1000 z-0"
          style={{
            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
          }}
        />
        {steps.map((step, idx) => {
          const isActive = idx <= currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step.status}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isCurrent
                    ? "bg-white border-primary text-primary shadow-sm"
                    : isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-slate-100 text-slate-300"
                }`}
              >
                {isActive ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-slate-200" />
                )}
              </div>
              <span
                className={`text-xs font-medium ${isActive ? "text-slate-800" : "text-slate-400"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
