"use client";

import React from "react";
import { useOrders, useUpdateOrderStatus } from "@/features/orders/hooks";
import { OrderTable } from "@/features/orders/components/admin/OrderTable";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import { OrderStats } from "@/features/orders/components/admin/list/OrderStats";
import { OrderListToolbar } from "@/features/orders/components/admin/list/ListToolbar";
import { OrderListHeader } from "@/features/orders/components/admin/list/ListHeader";
import { OrderStatus } from "@/types/enums";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, refetch, isFetching } = useOrders({ limit: 1000 });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [paymentFilter, setPaymentFilter] = React.useState("ALL");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  const counts = React.useMemo(() => ({
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === OrderStatus.PENDING).length,
    PROCESSING: orders.filter(o => o.status === OrderStatus.PROCESSING).length,
    SHIPPED: orders.filter(o => o.status === OrderStatus.SHIPPED).length,
    DELIVERED: orders.filter(o => o.status === OrderStatus.DELIVERED).length,
    CANCELLED: orders.filter(o => o.status === OrderStatus.CANCELLED).length,
    RETURN_REQUESTED: orders.filter(o => o.status === OrderStatus.RETURN_REQUESTED).length,
    RETURNED: orders.filter(o => o.status === OrderStatus.RETURNED).length,
  }), [orders]);

  const filteredOrders = React.useMemo(() => {
    let result = orders;
    
    // Status filter
    if (statusFilter !== "ALL") {
      result = result.filter(o => o.status === statusFilter);
    }

    // Payment method filter
    if (paymentFilter !== "ALL") {
      result = result.filter(o => o.paymentMethod === paymentFilter);
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      result = result.filter(o => new Date(o.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      result = result.filter(o => new Date(o.createdAt) <= end);
    }

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(o => 
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
      {/* Header Section */}
      <OrderListHeader 
        totalOrders={orders.length} 
        onRefresh={refetch} 
        isFetching={isFetching} 
      />

      {/* Statistics Cards */}
      <OrderStats 
        counts={counts} 
      />

      {/* Main Table Container - Rounded & Shadow */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <OrderListToolbar 
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
        
        {/* Table Content */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-primary">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : (
            <OrderTable 
              data={filteredOrders} 
              onUpdateStatus={(id, status) => updateStatus({ id, status })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
