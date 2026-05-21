"use client";

import React from "react";
import {
  CheckCircle2,
  Truck,
  Home,
  Clock,
  Calendar,
  CheckCircle,
  ClipboardList,
  AlertCircle,
  XCircle,
  X,
  RotateCcw,
} from "lucide-react";
import { OrderStatus, ReturnStatus } from "@/types/enums";
import { cn } from "@/utils/cn";
import { CUSTOMER_ORDER_STATUS_CONFIG } from "../../../constants";

interface DetailStepperProps {
  status: OrderStatus;
  isCancelled: boolean;
  returnStatus?: ReturnStatus;
  updatedAt?: string;
  createdAt?: string;
  deliveredAt?: string;
  userEmail?: string;
}

export function DetailStepper({
  status,
  isCancelled,
  createdAt,
  deliveredAt,
  shippingCode,
  shippingCarrier = "Giao Hàng Nhanh",
  userEmail,
}: DetailStepperProps & { shippingCode?: string; shippingCarrier?: string }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = [
    {
      key: OrderStatus.PENDING,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.PENDING].label,
      icon: <ClipboardList size={18} />,
    },
    {
      key: OrderStatus.PROCESSING,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.PROCESSING].label,
      icon: <CheckCircle size={18} />,
    },
    {
      key: OrderStatus.SHIPPED,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.SHIPPED].label,
      icon: <Truck size={18} />,
    },
    {
      key: OrderStatus.DELIVERED,
      label: CUSTOMER_ORDER_STATUS_CONFIG[OrderStatus.DELIVERED].label,
      icon: <Home size={18} />,
    },
  ];

  const getStatusIndex = (status: string) => {
    if (status === OrderStatus.CANCELLED) return -1;
    if (status === OrderStatus.RETURN_REQUESTED || status === OrderStatus.RETURNED)
      return 3;
    const map: Record<string, number> = {
      [OrderStatus.PENDING]: 0,
      [OrderStatus.PROCESSING]: 1,
      [OrderStatus.SHIPPED]: 2,
      [OrderStatus.DELIVERED]: 3,
    };
    return map[status] ?? 0;
  };

  const currentIndex = getStatusIndex(status);

  return (
    <div className="bg-white border border-[#DDD6C8] rounded-2xl overflow-hidden shadow-sm font-sans-brand animate-in fade-in duration-500">
      <div className="px-[22px] py-[16px] border-b border-[#DDD6C8] flex items-center justify-between">
        <span className="text-[14px] font-bold text-[#3D2B1A] flex items-center gap-2">
          <Truck size={16} className="text-[#C4783A]" /> Theo dõi vận chuyển
        </span>
        <button className="text-[12.5px] text-[#C4783A] hover:underline">
          Xem trên GHN →
        </button>
      </div>

      <div className="p-7 space-y-8">
        
        <div className="relative flex items-center px-4">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIndex || status === OrderStatus.DELIVERED;
            const isActive = idx === currentIndex && status !== OrderStatus.DELIVERED;

            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center gap-2 relative z-10 w-[80px] shrink-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      isDone
                        ? "border-[#3A7D5A] bg-[#E6F3EC] text-[#3A7D5A]"
                        : isActive
                          ? "border-[#C4783A] bg-[#F0D5BB] ring-4 ring-[#F0D5BB]/30 text-[#C4783A]"
                          : "border-[#DDD6C8] bg-white text-[#8A7966]"
                    )}
                  >
                    {isDone ? <CheckCircle2 size={18} /> : step.icon}
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "text-[11px] whitespace-nowrap",
                        isDone
                          ? "text-[#3A7D5A] font-medium"
                          : isActive
                            ? "text-[#C4783A] font-bold"
                            : "text-[#8A7966]"
                      )}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-[3px] -mt-8 mx-[-10px] rounded-full",
                      idx < currentIndex
                        ? "bg-[#3A7D5A]"
                        : idx === currentIndex
                          ? "bg-gradient-to-r from-[#3A7D5A] to-[#DDD6C8]"
                          : "bg-[#DDD6C8]"
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        
        {shippingCode && (
          <div className="bg-[#FAF8F4] border border-[#DDD6C8] rounded-xl p-4 flex flex-wrap items-center gap-x-12 gap-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">
                Đơn vị vận chuyển
              </p>
              <p className="text-[13.5px] font-medium text-[#3D2B1A]">
                {shippingCarrier}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-[#8A7966] uppercase tracking-[0.06em]">
                Mã vận đơn
              </p>
              <p className="text-[13.5px] font-bold text-[#C4783A] font-mono">
                {shippingCode}
              </p>
            </div>
            <div className="ml-auto text-[12px] text-[#3A7D5A] font-medium bg-[#E6F3EC] px-3 py-1 rounded-lg flex items-center gap-2">
              <Calendar size={14} /> Dự kiến:{" "}
              {deliveredAt ? formatDate(deliveredAt) : "16/05 – 17/05/2025"}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="bg-[#FCEAEA] border border-[#F0C0C0] rounded-xl p-4 flex gap-3">
            <AlertCircle size={24} className="text-[#C44040]" />
            <div className="space-y-1">
              <h4 className="text-[13.5px] font-bold text-[#C44040]">
                Đơn hàng đã bị huỷ
              </h4>
              <p className="text-[12.5px] text-[#C44040]/80 leading-relaxed">
                Đơn hàng đã được huỷ theo yêu cầu của bạn.
              </p>
            </div>
          </div>
        )}

        
        <div className="bg-[#FAF8F4] border border-[#DDD6C8] rounded-xl p-5 space-y-4">
          <p className="text-[12px] font-bold text-[#3D2B1A] uppercase tracking-[0.06em]">
            Lịch sử cập nhật
          </p>
          <div className="relative space-y-0">
            <div className="absolute left-[10px] top-[6px] bottom-[6px] w-[2px] bg-[#DDD6C8]" />

            {[
              {
                icon: <ClipboardList size={14} />,
                title: "Đơn hàng đã được đặt",
                desc: userEmail
                  ? `Xác nhận qua email ${userEmail}`
                  : "Đang chờ xác nhận",
                time: formatDate(createdAt),
                done: true,
              },
              {
                icon: <CheckCircle size={14} />,
                title: "Đơn hàng đã xác nhận",
                time: formatDate(createdAt),
                done: currentIndex >= 1 || isCancelled,
              },
              isCancelled
                ? {
                    icon: <XCircle size={14} />,
                    title: "Đơn hàng đã huỷ",
                    desc: "Đơn hàng đã được huỷ theo yêu cầu.",
                    time: formatDate(createdAt),
                    done: true,
                    isCancelStep: true,
                  }
                : null,
              !isCancelled && {
                icon: <Truck size={14} />,
                title: "Đang vận chuyển",
                desc: shippingCode
                  ? `Mã vận đơn: ${shippingCode}`
                  : "Đang bàn giao cho đơn vị vận chuyển",
                active: currentIndex === 2,
                done: currentIndex > 2,
              },
              !isCancelled && {
                icon: <Home size={14} />,
                title: "Giao hàng thành công",
                desc: "Đơn hàng đã được giao đến bạn",
                time: "—",
                done:
                  currentIndex === 3 ||
                  status === OrderStatus.RETURN_REQUESTED ||
                  status === OrderStatus.RETURNED,
              },

              (status === OrderStatus.RETURN_REQUESTED ||
                status === OrderStatus.RETURNED) && {
                icon: <RotateCcw size={14} />,
                title: "Yêu cầu trả hàng",
                desc: "Hệ thống đã ghi nhận yêu cầu trả hàng của bạn.",
                time: formatDate(createdAt),
                done: true,
                isReturnStep: true,
              },

              status === OrderStatus.RETURNED && {
                icon: <CheckCircle size={14} />,
                title: "Hoàn trả thành công",
                desc: "Sản phẩm đã được hoàn trả và hoàn tiền hoàn tất.",
                time: formatDate(createdAt),
                done: true,
                isReturnStep: true,
              },
            ]
              .filter(Boolean)
              .map((log: any, i) => (
                <div key={i} className="relative z-10 flex gap-4 pb-4 last:pb-0">
                  <div
                    className={cn(
                      "w-[22px] h-[22px] rounded-full border-2 bg-white flex items-center justify-center shrink-0",
                      log.isCancelStep
                        ? "border-[#C44040] bg-[#C44040] text-white"
                        : log.isReturnStep
                          ? "border-[#2C5F8A] bg-[#2C5F8A] text-white"
                          : log.done
                            ? "border-[#3A7D5A] bg-[#3A7D5A] text-white"
                            : log.active
                              ? "border-[#C4783A] bg-[#F0D5BB] text-[#C4783A]"
                              : "border-[#DDD6C8] text-[#8A7966]"
                    )}
                  >
                    {log.done ? (
                      log.isCancelStep ? (
                        <X size={12} />
                      ) : log.isReturnStep ? (
                        <RotateCcw size={12} />
                      ) : (
                        <CheckCircle2 size={12} />
                      )
                    ) : (
                      log.icon
                    )}
                  </div>
                  <div className="pt-0.5 space-y-0.5">
                    <p
                      className={cn(
                        "text-[13px] font-medium",
                        log.isCancelStep
                          ? "text-[#C44040]"
                          : log.isReturnStep
                            ? "text-[#2C5F8A]"
                            : "text-[#3D2B1A]"
                      )}
                    >
                      {log.title}
                    </p>
                    {log.desc && (
                      <p
                        className={cn(
                          "text-[12px] leading-relaxed",
                          log.isCancelStep
                            ? "text-[#C44040]/70"
                            : log.isReturnStep
                              ? "text-[#2C5F8A]/70"
                              : "text-[#8A7966]"
                        )}
                      >
                        {log.desc}
                      </p>
                    )}
                    <p className="text-[11px] text-[#8A7966] flex items-center gap-1.5">
                      <Clock size={10} /> {log.time}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
