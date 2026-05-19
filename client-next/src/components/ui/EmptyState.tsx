"use client";

import React from "react";
import { LucideIcon, Inbox } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionText,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white border border-brand-sand rounded-2xl shadow-sm max-w-lg mx-auto animate-in fade-in duration-500 font-sans",
        className
      )}
    >
      <div className="h-16 w-16 rounded-2xl bg-brand-cream border border-brand-sand flex items-center justify-center text-brand-bronze mb-6 shadow-sm">
        <Icon size={28} className="stroke-[1.5]" />
      </div>

      <h3 className="text-[17px] font-bold text-brand-espresso mb-2">
        {title}
      </h3>
      <p className="text-[13px] text-brand-taupe font-medium max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <Button
          onClick={onAction}
          className="rounded-full h-11 px-8 text-[12.5px] font-bold bg-brand-espresso text-white hover:bg-brand-espresso/90 shadow-md shadow-brand-espresso/10 transition-all active:scale-98"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
