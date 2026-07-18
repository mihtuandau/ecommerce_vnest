"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "row" | "card";
  className?: string;
}

export function InfoCard({
  icon: Icon,
  title,
  description,
  variant = "row",
  className,
}: InfoCardProps) {
  if (variant === "card") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-brand-sand/30 bg-brand-ivory/45 p-5",
          className
        )}
      >
        <div className="mb-2 flex items-center gap-3 text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-bronze shadow-sm">
            <Icon size={17} />
          </span>
          <h4 className="text-[14px] font-bold">{title}</h4>
        </div>
        <p className="text-[13px] leading-6 text-brand-espresso/70">{description}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-5 group", className)}>
      <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 bg-brand-linen border border-brand-ivory text-brand-accent transition-all duration-300 group-hover:bg-brand-espresso group-hover:text-white group-hover:border-brand-espresso">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-brand-espresso leading-tight">
          {title}
        </span>
        <span className="text-[12px] font-medium text-brand-taupe mt-1">
          {description}
        </span>
      </div>
    </div>
  );
}
