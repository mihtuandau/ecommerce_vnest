"use client";

import React from "react";
import { OrdersTable } from "@/features/orders/components/admin/list/OrdersTable";
import { Order } from "@/types/models";

interface CustomerOrdersProps {
  orders: Order[];
}

export function CustomerOrders({ orders }: CustomerOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <p className="text-slate-400 font-bold">Khách hàng chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900">Lịch sử đơn hàng</h3>
      </div>
      <OrdersTable data={orders} />
    </div>
  );
}
