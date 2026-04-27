"use client";

import React from "react";
import { CheckCircle2, RotateCcw, AlertCircle, CheckCircle, XCircle, Package, Truck, ShoppingBag } from "lucide-react";
import { OrderStatus, ReturnStatus } from "@/types/enums";
import { cn } from "@/utils/cn";

interface DetailStepperProps {
  status: OrderStatus;
  isCancelled: boolean;
  returnStatus?: ReturnStatus;
}

const standardSteps = [
  { status: OrderStatus.PENDING, label: "Đã đặt hàng", icon: CheckCircle2 },
  { status: OrderStatus.PROCESSING, label: "Đã xác nhận", icon: CheckCircle2 },
  { status: OrderStatus.SHIPPED, label: "Đang giao", icon: Truck },
  { status: OrderStatus.DELIVERED, label: "Hoàn thành", icon: CheckCircle2 },
];

const returnSteps = [
  { status: ReturnStatus.PENDING, label: "Chờ duyệt", icon: AlertCircle },
  { status: ReturnStatus.APPROVED, label: "Đã duyệt", icon: CheckCircle2 },
  { status: ReturnStatus.RETURNING, label: "Đang trả hàng", icon: Truck },
  { status: ReturnStatus.RECEIVED, label: "Shop đã nhận", icon: ShoppingBag },
  { status: ReturnStatus.COMPLETED, label: "Hoàn tất", icon: RotateCcw },
];

export function DetailStepper({ status, isCancelled, returnStatus }: DetailStepperProps) {
  if (isCancelled) {
    return (
      <div className="bg-rose-50/30 rounded-xl p-6 border border-rose-100/50 flex items-center justify-center gap-3">
        <XCircle className="h-5 w-5 text-rose-500" />
        <span className="text-sm font-semibold text-rose-600">Đơn hàng đã bị hủy</span>
      </div>
    );
  }

  // Determine if we are in a return flow
  const isReturnFlow = status === OrderStatus.RETURN_REQUESTED || status === OrderStatus.RETURNED || !!returnStatus;
  
  // Fallback returnStatus if not provided but in return flow
  let effectiveReturnStatus = returnStatus;
  if (!effectiveReturnStatus && isReturnFlow) {
    if (status === OrderStatus.RETURNED) effectiveReturnStatus = ReturnStatus.COMPLETED;
    else effectiveReturnStatus = ReturnStatus.PENDING;
  }

  if (isReturnFlow && effectiveReturnStatus) {
    const currentStepIndex = returnSteps.findIndex((s) => s.status === effectiveReturnStatus);
    const isRejected = effectiveReturnStatus === ReturnStatus.REJECTED;

    return (
      <div className="bg-slate-50/30 rounded-xl p-6 border border-slate-100/50 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <RotateCcw size={16} className="text-amber-500" />
          <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Tiến trình trả hàng</h3>
        </div>
        
        {isRejected ? (
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-center gap-3">
            <XCircle className="text-rose-500 h-5 w-5 shrink-0" />
            <div className="space-y-0.5">
              <p className="text-[13px] font-bold text-rose-700">Yêu cầu bị từ chối</p>
              <p className="text-[11px] text-rose-600 font-medium italic">Vui lòng kiểm tra ghi chú của quản trị viên để biết thêm chi tiết.</p>
            </div>
          </div>
        ) : (
          <div className="relative overflow-x-auto no-scrollbar pb-2">
            <div className="min-w-[500px] relative flex justify-between">
              <div className="absolute top-[17px] left-0 w-full h-[2px] bg-slate-200 z-0" />
              <div
                className="absolute top-[17px] left-0 h-[2px] bg-amber-500 transition-all duration-1000 z-0 shadow-[0_0_8px_rgba(245,158,11,0.3)]"
                style={{
                  width: `${(currentStepIndex / (returnSteps.length - 1)) * 100}%`,
                }}
              />
              {returnSteps.map((step, idx) => {
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                        isCurrent
                          ? "bg-white border-amber-500 text-amber-500 shadow-sm"
                          : isActive
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "bg-white border-slate-100 text-slate-300"
                      )}
                    >
                      {isActive ? (
                        <Icon className="h-4 w-4" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-200" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-semibold text-center",
                        isActive ? "text-slate-800" : "text-slate-400"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Standard Flow
  const currentStepIndex = standardSteps.findIndex((s) => s.status === status);

  return (
    <div className="bg-slate-50/30 rounded-xl p-6 border border-slate-100/50">
      <div className="relative overflow-x-auto no-scrollbar pb-2">
        <div className="min-w-[400px] relative flex justify-between px-2">
          <div className="absolute top-[17px] left-0 w-full h-[2px] bg-slate-200 z-0" />
          <div
            className="absolute top-[17px] left-0 h-[2px] bg-primary transition-all duration-1000 z-0 shadow-[0_0_8px_rgba(37,99,235,0.2)]"
            style={{
              width: `${(currentStepIndex / (standardSteps.length - 1)) * 100}%`,
            }}
          />
          {standardSteps.map((step, idx) => {
            const isActive = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            
            return (
              <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isCurrent
                      ? "bg-white border-primary text-primary shadow-sm"
                      : isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-white border-slate-100 text-slate-300"
                  )}
                >
                  {isActive ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-200" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold whitespace-nowrap",
                    isActive ? "text-slate-800" : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
