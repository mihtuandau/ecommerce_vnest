import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "primary" | "white" | "slate" | "slate-600";
}

const sizeMap = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-3",
  xl: "h-14 w-14 border-[3px]",
};

const variantMap = {
  primary: "text-primary",
  white: "text-white",
  slate: "text-slate-400",
  "slate-600": "text-slate-600",
};

export function Spinner({ size = "md", className, variant = "primary" }: SpinnerProps) {
  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeMap[size],
        variantMap[variant],
        className
      )} 
    />
  );
}

export function FullPageLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative">
        <Spinner size="xl" />
        <div className="absolute inset-0 animate-ping opacity-20">
            <Spinner size="xl" />
        </div>
      </div>
      <p className="mt-6 text-sm font-bold text-brand-espresso tracking-tight animate-pulse">
        Đang tải...
      </p>
    </div>
  );
}
