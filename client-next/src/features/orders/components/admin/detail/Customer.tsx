"use client";

import React from "react";
import { User, Phone, MapPin, Mail } from "lucide-react";
import { adminUI } from "@/constants/admin-ui";
import { cn } from "@/utils/cn";

interface CustomerProps {
  order: any;
}

export function Customer({ order }: CustomerProps) {
  const orderAny = order as any;
  const snapshot = orderAny.shippingSnapshot;

  const customerName = snapshot?.fullName || orderAny.user?.name || "Khách vãng lai";
  const customerPhone =
    snapshot?.phone || orderAny.user?.phone || orderAny.guestPhone || "—";

  // Ghép địa chỉ từ snapshot (thông tin lúc đặt hàng)
  const snapshotAddress = snapshot
    ? [snapshot.street, snapshot.ward, snapshot.district, snapshot.province]
        .filter(Boolean)
        .join(", ")
    : "";

  const customerAddress = snapshot?.addressString || snapshotAddress || "—";

  const totalOrders = orderAny.customerStats?.totalOrders || 0;
  const totalSpent = orderAny.customerStats?.totalSpent || 0;

  const formattedTotalSpent =
    totalSpent >= 1000000
      ? `${(totalSpent / 1000000).toFixed(1).replace(".0", "")}tr đ`
      : `${totalSpent.toLocaleString("vi-VN")} đ`;

  return (
    <>
      {/* Thẻ Thông tin khách hàng */}
      <div className={cn(adminUI.card.base, "p-0 overflow-hidden")}>
        <div className="px-5 py-4 border-b border-slate-100 bg-white flex justify-between items-center">
          <h3
            className={cn(adminUI.typography.sectionTitle, "flex items-center gap-2")}
          >
            <User className="h-4 w-4 text-slate-700" fill="currentColor" /> Thông tin
            khách hàng
          </h3>
          <button className="text-[11px] font-medium px-3 py-1 border border-slate-200 rounded text-slate-600 hover:bg-slate-50">
            Xem hồ sơ
          </button>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-[#f3eae1] text-[#a47b59] flex items-center justify-center font-bold text-[15px]">
              {customerName !== "Khách vãng lai"
                ? customerName.substring(0, 2).toUpperCase()
                : "KV"}
            </div>
            <div>
              <div className="font-bold text-slate-800 text-[15px]">{customerName}</div>
              <div className="text-[12px] text-amber-500 font-medium flex items-center gap-1">
                ★ Thành viên Vàng
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 my-4"></div>

          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">
                Email
              </span>
              <span className="text-[13px] font-medium text-slate-800 text-right word-break">
                {orderAny.shippingSnapshot?.email ||
                  orderAny.guestEmail ||
                  orderAny.user?.email ||
                  "—"}
              </span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">SĐT</span>
              <span className="text-[13px] font-medium text-slate-800 text-right">
                {customerPhone}
              </span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">
                Tổng đơn
              </span>
              <span className="text-[13px] font-medium text-slate-800 text-right">
                {totalOrders} đơn hàng
              </span>
            </div>
            <div className="flex justify-between items-start gap-4">
              <span className="text-[13px] text-slate-500 whitespace-nowrap">
                Tổng chi tiêu
              </span>
              <span className="text-[13px] font-medium text-amber-600 text-right">
                {formattedTotalSpent}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thẻ Địa chỉ giao hàng */}
      <div className={cn(adminUI.card.base, "p-0 overflow-hidden")}>
        <div className="px-5 py-4 border-b border-slate-100 bg-white">
          <h3
            className={cn(adminUI.typography.sectionTitle, "flex items-center gap-2")}
          >
            <MapPin className="h-4 w-4 text-rose-500" fill="currentColor" /> Địa chỉ
            giao hàng
          </h3>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start gap-4">
            <span className="text-[13px] text-slate-500 whitespace-nowrap">
              Người nhận
            </span>
            <span className="text-[13px] font-medium text-slate-800 text-right">
              {customerName}
            </span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-[13px] text-slate-500 whitespace-nowrap">
              Địa chỉ
            </span>
            <span className="text-[13px] font-medium text-slate-800 text-right">
              {customerAddress}
            </span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-[13px] text-slate-500 whitespace-nowrap">
              Phương tiện
            </span>
            <span className="text-[13px] font-medium text-slate-800 text-right">
              Giao Hàng Nhanh
            </span>
          </div>
          <div className="flex justify-between items-start gap-4">
            <span className="text-[13px] text-slate-500 whitespace-nowrap">
              Mã vận đơn
            </span>
            <span className="text-[13px] font-medium text-slate-800 text-right font-mono">
              {orderAny.shippingCode || "Chưa tạo mã"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
