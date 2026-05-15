"use client";

import React from "react";
import { CheckCircle2, RotateCcw, AlertCircle, CheckCircle, XCircle, Package, Truck, ShoppingBag, Clock } from "lucide-react";
import { OrderStatus, ReturnStatus } from "@/types/enums";
import { cn } from "@/utils/cn";

interface DetailStepperProps {
  status: OrderStatus;
  isCancelled: boolean;
  returnStatus?: ReturnStatus;
  updatedAt?: string;
  createdAt?: string;
  deliveredAt?: string;
}

export function DetailStepper({ 
  status, 
  isCancelled, 
  returnStatus, 
  updatedAt, 
  createdAt,
  deliveredAt
}: DetailStepperProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isReturning = status === OrderStatus.RETURN_REQUESTED || returnStatus === ReturnStatus.RETURNING;
  const isReturned = status === OrderStatus.RETURNED || returnStatus === ReturnStatus.COMPLETED;

  const steps = [
    {
      id: "PENDING",
      title: "Chờ xác nhận",
      time: formatDate(createdAt),
      icon: CheckCircle2,
      isActive: true,
      isCompleted: status !== OrderStatus.PENDING || isCancelled || isReturning || isReturned,
    },
    {
      id: "PROCESSING",
      title: isCancelled ? "Đơn hàng đã hủy" : "Đang xử lý",
      time: (status !== OrderStatus.PENDING) ? formatDate(updatedAt) : "",
      icon: isCancelled ? XCircle : CheckCircle2,
      isActive: status !== OrderStatus.PENDING,
      isCompleted: ![OrderStatus.PENDING, OrderStatus.PROCESSING].includes(status) || isCancelled || isReturning || isReturned,
      isError: isCancelled
    },
    {
      id: "SHIPPING_OR_DELIVERED",
      title: (isReturning || isReturned) ? "Giao hàng thành công" : "Đang giao hàng",
      time: (isReturning || isReturned || status === OrderStatus.DELIVERED) ? formatDate(deliveredAt || updatedAt) : (status === OrderStatus.SHIPPED ? "Dự kiến trong ngày" : ""),
      icon: (isReturning || isReturned || status === OrderStatus.DELIVERED) ? CheckCircle2 : Truck,
      isActive: [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.RETURN_REQUESTED, OrderStatus.RETURNED].includes(status) && !isCancelled,
      isCompleted: [OrderStatus.DELIVERED, OrderStatus.RETURN_REQUESTED, OrderStatus.RETURNED].includes(status) && !isCancelled,
    },
    {
      id: "RETURN_PROCESS",
      title: isReturned ? "Đã trả hàng" : (isReturning ? "Yêu cầu trả hàng" : "Giao thành công"),
      time: (isReturned || status === OrderStatus.DELIVERED) ? formatDate(deliveredAt || updatedAt) : "",
      icon: isReturned ? RotateCcw : (isReturning ? Clock : Package),
      isActive: status === OrderStatus.DELIVERED || isReturning || isReturned,
      isCompleted: status === OrderStatus.DELIVERED || isReturned,
      isWarning: isReturning,
      isSuccess: isReturned
    },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 lg:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
          <Clock size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">Tiến độ giao hàng</h3>
      </div>

      <div className="space-y-0 ml-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-6 pb-10 last:pb-0">
              {!isLast && (
                <div 
                  className={cn(
                    "absolute left-[17px] top-[34px] bottom-0 w-[2px] bg-slate-100 transition-colors duration-500",
                    step.isCompleted && "bg-emerald-200"
                  )} 
                />
              )}

              <div className="relative z-10">
                <div 
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                    step.isCompleted 
                      ? (step.isError ? "bg-rose-50 border-rose-500 text-rose-600" : 
                         step.isSuccess ? "bg-purple-50 border-purple-500 text-purple-600" :
                         "bg-emerald-50 border-emerald-500 text-emerald-600")
                      : step.isActive 
                        ? (step.isWarning ? "bg-amber-50 border-amber-500 text-amber-600 ring-4 ring-amber-50" : "bg-blue-50 border-blue-500 text-blue-600 ring-4 ring-blue-50")
                        : "bg-slate-50 border-slate-200 text-slate-300"
                  )}
                >
                  {step.isCompleted ? (
                    step.isError ? <XCircle className="h-4 w-4" /> : 
                    step.isSuccess ? <RotateCcw className="h-4 w-4" /> :
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-1">
                <h4 
                  className={cn(
                    "text-sm font-bold transition-colors duration-500",
                    step.isActive ? "text-slate-900" : "text-slate-400"
                  )}
                >
                  {step.title}
                </h4>
                {step.time && (
                  <p className="text-[11px] text-slate-400 font-medium">
                    {step.time}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
