"use client";

import React from "react";
import { Clock } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { adminUI } from "@/constants/admin-ui";
import { OrderStatus, Role } from "@/types/enums";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ADMIN_ORDER_STATUS_CONFIG } from "../../../constants/order-status.constants";

interface StepperProps {
  status: OrderStatus | string;
  isPending: boolean;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  id: string;
}

const statusSteps = [
  {
    key: OrderStatus.PENDING,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.PENDING].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.PENDING].icon,
  },
  {
    key: OrderStatus.PROCESSING,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.PROCESSING].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.PROCESSING].icon,
  },
  {
    key: OrderStatus.SHIPPED,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.SHIPPED].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.SHIPPED].icon,
  },
  {
    key: OrderStatus.DELIVERED,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.DELIVERED].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.DELIVERED].icon,
  },
  {
    key: OrderStatus.RETURN_REQUESTED,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.RETURN_REQUESTED].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.RETURN_REQUESTED].icon,
  },
  {
    key: OrderStatus.RETURNED,
    label: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.RETURNED].label,
    icon: ADMIN_ORDER_STATUS_CONFIG[OrderStatus.RETURNED].icon,
  },
];

export function Stepper({ status, isPending, onUpdateStatus, id }: StepperProps) {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === Role.ADMIN;

  const currentStepIndex = statusSteps.findIndex((s) => s.key === status);
  const isCancelled = status === OrderStatus.CANCELLED;

  // Xác định bước tiếp theo và tên nút tương ứng
  let nextStep: OrderStatus | null = null;
  let nextLabel = "";

  if (status === OrderStatus.PENDING) {
    nextStep = OrderStatus.PROCESSING;
    nextLabel = "Xác nhận đơn hàng";
  } else if (status === OrderStatus.PROCESSING) {
    nextStep = OrderStatus.SHIPPED;
    nextLabel = "Chuyển giao hàng";
  } else if (status === OrderStatus.SHIPPED) {
    nextStep = OrderStatus.DELIVERED;
    nextLabel = "Xác nhận đã giao";
  } else if (status === OrderStatus.RETURN_REQUESTED) {
    nextStep = OrderStatus.RETURNED;
    nextLabel = "Xác nhận đã nhận hàng trả";
  }

  if (isCancelled) return null;

  return (
    <div className={cn(adminUI.card.base, "overflow-hidden p-0")}>
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className={cn(adminUI.typography.sectionTitle, "flex items-center gap-2")}>
          <Clock className="h-5 w-5 text-slate-500" /> Trạng thái đơn hàng
        </h3>
      </div>

      <div className="flex items-start justify-between px-8 py-8 bg-white relative">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const hasLine = index < statusSteps.length - 1;
          const isLineCompleted = index < currentStepIndex;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-2 z-10 flex-shrink-0">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all relative bg-white",
                    isCompleted
                      ? "border-slate-800 text-slate-800 shadow-sm"
                      : "border-slate-200 text-slate-300",
                    isCurrent && "border-slate-800 ring-4 ring-slate-100"
                  )}
                >
                  <step.icon className={cn("h-4 w-4")} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-tight whitespace-nowrap",
                    isCompleted ? "text-slate-800" : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {hasLine && (
                <div className="flex-1 h-[2.5px] bg-slate-100 mt-[17px] mx-1 z-0 relative rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full bg-slate-800 transition-all duration-500 rounded-full"
                    )}
                    style={{ width: isLineCompleted ? "100%" : "0%" }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4 px-6 py-3 bg-slate-50/50 border-t border-slate-100 no-print">
        
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-slate-500">
            Trạng thái hiện tại:
          </span>
          <span className="text-[12px] font-bold text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-sm">
            {statusSteps.find((s) => s.key === status)?.label || status}
          </span>
        </div>

        
        <div className="flex items-center gap-2">
          {nextStep ? (
            <button
              className="h-9 px-5 rounded-lg bg-slate-900 text-white text-[13px] font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              onClick={() => !isPending && onUpdateStatus(id, nextStep!)}
              disabled={isPending}
            >
              {isPending && <Spinner size="sm" />}
              {nextLabel}
            </button>
          ) : (
            <span className="text-[12.5px] font-semibold text-emerald-600">
              ✓ Đơn hàng hoàn tất
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
