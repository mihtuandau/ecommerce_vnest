"use client";

import React from "react";
import { useOrders, useUpdateOrderStatus } from "@/features/orders/hooks";
import { OrderTable } from "@/features/orders/components/admin/OrderTable";
import { ShoppingBag, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import { OrderTabs } from "@/features/orders/components/admin/list/Tabs";
import { OrderListToolbar } from "@/features/orders/components/admin/list/ListToolbar";
import { OrderListHeader } from "@/features/orders/components/admin/list/ListHeader";
import { OrderStatus } from "@/types/enums";
import { Spinner } from "@/components/ui/Spinner";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading, refetch, isFetching } = useOrders({ limit: 1000 });
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("ALL");

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
    
    // Tab filter
    if (activeTab !== "ALL") {
      result = result.filter(o => o.status === activeTab);
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
  }, [orders, activeTab, searchTerm]);


  return (
    <div className="space-y-4 pb-10">
      {/* Header Section */}
      <OrderListHeader 
        totalOrders={orders.length} 
        onRefresh={refetch} 
        isFetching={isFetching} 
      />

      {/* Main Table Container - Rounded & Shadow */}
      <div className="bg-white rounded-2xl border-none shadow-sm overflow-hidden">
        <OrderTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          counts={counts} 
        />

        <OrderListToolbar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
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
