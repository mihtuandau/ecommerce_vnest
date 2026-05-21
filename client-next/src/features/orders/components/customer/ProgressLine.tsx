"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { OrderStatus } from "@/types/enums";
import { CUSTOMER_ORDER_STATUS_CONFIG } from "../../constants";

interface ProgressLineProps {
  currentStatus: string;
}

export function ProgressLine({ currentStatus }: ProgressLineProps) {
  const isReturn =
    currentStatus === OrderStatus.RETURN_REQUESTED ||
    currentStatus === OrderStatus.RETURNED;

  const baseSteps = [
    {
      key: OrderStatus.PENDING,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.PENDING].label,
    },
    {
      key: OrderStatus.PROCESSING,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.PROCESSING].label,
    },
    {
      key: OrderStatus.SHIPPED,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.SHIPPED].label,
    },
    {
      key: OrderStatus.DELIVERED,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.DELIVERED].label,
    },
  ];

  const steps = isReturn
    ? [...baseSteps, { key: OrderStatus.RETURN_REQUESTED, label: "Trả hàng" }]
    : baseSteps;

  const getStatusIndex = (status: string) => {
    if (status === OrderStatus.RETURNED) return steps.length - 1;
    if (status === OrderStatus.RETURN_REQUESTED) return steps.length - 1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="relative flex justify-between items-center px-4">
        
        <div className="absolute top-[11px] left-10 right-10 h-[2px] bg-[#DDD6C8]" />
        
        <div
          className="absolute top-[11px] left-10 h-[2px] bg-[#3A7D5A] transition-all duration-700"
          style={{
            width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 20px)`,
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isActive = idx === currentIndex;
          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 w-20"
            >
              <div
                className={cn(
                  "w-[22px] h-[22px] rounded-full flex items-center justify-center border-2 transition-all duration-500 text-[9px]",
                  isCompleted
                    ? "bg-[#3A7D5A] border-[#3A7D5A] text-white"
                    : "bg-white border-[#DDD6C8] text-transparent"
                )}
              >
                {isCompleted && <Check size={10} strokeWidth={3} />}
              </div>
              <span
                className={cn(
                  "text-[12px] mt-2 whitespace-nowrap transition-colors duration-300 font-medium",
                  isCompleted ? "text-[#3A7D5A]" : "text-[#8A7966]",
                  isActive && "font-bold text-[#C4783A]"
                )}
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
