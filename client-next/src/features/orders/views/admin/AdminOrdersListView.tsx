"use client";

import React from "react";
import { useOrders, useUpdateOrderStatus } from "../../hooks";
import { OrdersTable } from "../../components/admin/list/OrdersTable";
import { OrdersStats } from "../../components/admin/list/OrdersStats";
import { OrderOrdersToolbar } from "../../components/admin/list/OrdersToolbar";
import { OrderOrdersHeader } from "../../components/admin/list/OrdersHeader";
import { OrderStatus } from "@/types/enums";
import { Spinner } from "@/components/ui/Spinner";

export function AdminOrdersListView() {
  const {
    data: orders = [],
    isLoading,
    refetch,
    isFetching,
  } = useOrders({ limit: 1000 });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [paymentFilter, setPaymentFilter] = React.useState("ALL");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const counts = React.useMemo(
    () => ({
      ALL: orders.length,
      PENDING: orders.filter((o) => o.status === OrderStatus.PENDING).length,
      PROCESSING: orders.filter((o) => o.status === OrderStatus.PROCESSING).length,
      SHIPPED: orders.filter((o) => o.status === OrderStatus.SHIPPED).length,
      DELIVERED: orders.filter((o) => o.status === OrderStatus.DELIVERED).length,
      CANCELLED: orders.filter((o) => o.status === OrderStatus.CANCELLED).length,
      RETURN_REQUESTED: orders.filter((o) => o.status === OrderStatus.RETURN_REQUESTED)
        .length,
      RETURNED: orders.filter((o) => o.status === OrderStatus.RETURNED).length,
    }),
    [orders]
  );

  const filteredOrders = React.useMemo(() => {
    let result = orders;

    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== "ALL") {
      result = result.filter((o) => o.paymentMethod === paymentFilter);
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter((o) => new Date(o.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter((o) => new Date(o.createdAt) <= end);
    }

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderCode?.toLowerCase().includes(lowerSearch) ||
          (o as any).shippingSnapshot?.fullName?.toLowerCase().includes(lowerSearch) ||
          (o as any).user?.name?.toLowerCase().includes(lowerSearch) ||
          (o as any).guestPhone?.includes(searchTerm) ||
          (o as any).shippingSnapshot?.phone?.includes(searchTerm)
      );
    }

    return result;
  }, [orders, statusFilter, paymentFilter, startDate, endDate, searchTerm]);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPaymentFilter("ALL");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-4 pb-10">
      
      <OrderOrdersHeader
        totalOrders={orders.length}
        onRefresh={refetch}
        isFetching={isFetching}
      />

      
      <OrdersStats counts={counts} />

      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
        <OrderOrdersToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onReset={handleReset}
        />

        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-primary">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          ) : (
            <OrdersTable
              data={filteredOrders}
              onUpdateStatus={(id: string, status: OrderStatus) => updateStatus({ id, status })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
