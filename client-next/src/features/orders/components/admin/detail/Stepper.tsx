"use client";

import React from "react";
import { Clock, Package, Truck, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface StepperProps {
  status: string;
  isPending: boolean;
  onUpdateStatus: (id: string, status: string) => void;
  id: string;
}

const statusSteps = [
  { key: "PENDING", label: "Chờ xử lý", icon: Clock },
  { key: "PROCESSING", label: "Đang xử lý", icon: Package },
  { key: "SHIPPED", label: "Đang giao", icon: Truck },
  { key: "DELIVERED", label: "Đã giao", icon: CheckCircle2 },
];

export function Stepper({ status, isPending, onUpdateStatus, id }: StepperProps) {
  const currentStepIndex = statusSteps.findIndex(s => s.key === status);
  const isCancelled = status === "CANCELLED";

  if (isCancelled) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8">
       <div className="flex items-center justify-between max-w-4xl mx-auto relative px-4">
              <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 z-0" />
          <div 
             className="absolute top-5 left-0 h-[2px] bg-primary z-0 transition-all duration-500" 
             style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}
          />
          
          {statusSteps.map((step, index) => {
             const isCompleted = index <= currentStepIndex;
             const isCurrent = index === currentStepIndex;
             return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-3">
                   <button 
                    onClick={() => !isPending && onUpdateStatus(id, step.key)}
                    disabled={isPending || isCompleted}
                    className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all relative",
                        isCompleted 
                          ? "bg-primary border-primary text-white shadow-sm" 
                          : "bg-white border-slate-200 text-slate-300 hover:border-slate-400",
                        isCurrent && "border-primary ring-2 ring-primary/10"
                    )}
                   >
                      {isPending && isCurrent ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <step.icon className={cn("h-5 w-5", isCompleted ? "text-white" : "text-slate-300")} />
                      )}
                   </button>
                   <span className={cn(
                        "text-[11px] font-bold uppercase tracking-tight", 
                        isCompleted ? "text-primary" : "text-slate-400"
                    )}>
                        {step.label}
                   </span>
                </div>
             );
          })}
       </div>
    </div>
  );
}
