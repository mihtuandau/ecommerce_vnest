"use client";

import { OrdersTable } from "@/features/orders/components/admin/list/OrdersTable";
import { Order } from "@/types/models";

interface CustomerOrdersProps {
  orders: Order[];
}

export function CustomerOrders({ orders }: CustomerOrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="font-medium text-slate-400">
          Khách hàng chưa có đơn hàng nào.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 p-4">
        <h3 className="font-semibold text-slate-900">Lịch sử đơn hàng</h3>
      </div>
      <OrdersTable data={orders} />
    </div>
  );
}
