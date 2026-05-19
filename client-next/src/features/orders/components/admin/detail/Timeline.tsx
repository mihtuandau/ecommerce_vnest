"use client";

import React from "react";
import dayjs from "dayjs";
import { Clock, CheckCircle2, Package, Truck, Home, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/enums";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

export function Timeline({ order }: { order: any }) {
  const events = [
    {
      icon: Clock,
      title: "Đơn hàng được đặt",
      desc: "Khách hàng đã đặt đơn thành công",
      time: order.createdAt,
      done: true,
      color: "text-slate-500",
      bg: "bg-slate-100",
      border: "border-slate-200",
    },
  ];

  if (order.status !== OrderStatus.PENDING) {
    events.push({
      icon: CheckCircle2,
      title: "Đơn hàng xác nhận",
      desc: "Hệ thống xác nhận và bắt đầu xử lý",
      time: order.updatedAt,
      done: true,
      color: "text-blue-500",
      bg: "bg-blue-50",
      border: "border-blue-200",
    });
  }

  if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
    events.push({
      icon: Package,
      title: "Đóng gói hoàn tất",
      desc: "Đã bàn giao cho đơn vị vận chuyển",
      time: order.updatedAt,
      done: true,
      color: "text-amber-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
    });

    events.push({
      icon: Truck,
      title: "Đang vận chuyển",
      desc: "Đơn hàng đang trên đường giao",
      time: order.updatedAt,
      done: order.status === OrderStatus.DELIVERED,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
    });
  }

  if (order.status === OrderStatus.DELIVERED) {
    events.push({
      icon: Home,
      title: "Giao hàng thành công",
      desc: "Khách hàng đã nhận được sản phẩm",
      time: order.deliveredAt || order.updatedAt,
      done: true,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    });
  }

  if (order.status === OrderStatus.CANCELLED) {
    events.push({
      icon: XCircle,
      title: "Đơn hàng đã huỷ",
      desc: order.note ? `Lý do: ${order.note}` : "Khách hoặc hệ thống yêu cầu huỷ",
      time: order.updatedAt,
      done: true,
      color: "text-rose-500",
      bg: "bg-rose-50",
      border: "border-rose-200",
    });
  }

  return (
    <div className={cn(adminUI.card.base, adminUI.card.padding)}>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-slate-500" />
        <h3 className={adminUI.typography.sectionTitle}>Lịch sử xử lý</h3>
      </div>
      <div className="relative pl-4 border-l-2 border-slate-100 space-y-6 ml-2">
        {events.map((event, index) => {
          const Icon = event.icon;
          return (
            <div key={index} className="relative">
              <div
                className={cn(
                  "absolute -left-[29px] top-0 w-7 h-7 rounded-full border-2 flex items-center justify-center bg-white",
                  event.done ? event.border : "border-slate-200",
                  event.done ? event.bg : "bg-slate-50"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    event.done ? event.color : "text-slate-400"
                  )}
                />
              </div>
              <div className="pl-4 -mt-1">
                <p className="text-[13px] font-semibold text-slate-800">
                  {event.title}
                </p>
                <p className="text-[12px] text-slate-500 mt-0.5">{event.desc}</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  {dayjs(event.time).format("HH:mm, DD/MM/YYYY")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
