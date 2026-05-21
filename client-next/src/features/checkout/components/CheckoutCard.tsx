"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface CheckoutCardProps {
  step: string | number;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function CheckoutCard({
  step,
  title,
  action,
  children,
  className,
  noPadding = false,
}: CheckoutCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-[16px] border border-brand-sand overflow-hidden shadow-sm",
        className
      )}
    >
      <div className="px-6 py-[18px] border-b border-brand-sand flex items-center justify-between bg-brand-ivory/30">
        <div className="flex items-center gap-[10px]">
          <div className="w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center text-white text-[12px] font-bold animate-in fade-in zoom-in duration-500">
            {step}
          </div>
          <h2 className="text-[15px] font-bold text-primary uppercase tracking-tight">
            {title}
          </h2>
        </div>
        {action}
      </div>
      <div className={cn(!noPadding && "p-6")}>{children}</div>
    </div>
  );
}
