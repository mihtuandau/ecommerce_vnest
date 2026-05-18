"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { OrderStatus } from "@/types/enums";

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  counts: {
    ALL: number;
    PENDING: number;
    PROCESSING: number;
    SHIPPED: number;
    DELIVERED: number;
    CANCELLED: number;
    RETURN_REQUESTED: number;
    RETURNED: number;
  };
}

export function OrderTabs({ activeTab, onTabChange, counts }: OrderTabsProps) {
  const tabItems = [
    { value: "ALL", label: "Tất cả", count: counts.ALL },
    { value: OrderStatus.PENDING, label: "Chờ xử lý", count: counts.PENDING },
    { value: OrderStatus.PROCESSING, label: "Đang xử lý", count: counts.PROCESSING },
    { value: OrderStatus.SHIPPED, label: "Đang giao", count: counts.SHIPPED },
    { value: OrderStatus.DELIVERED, label: "Đã giao", count: counts.DELIVERED },
    { value: OrderStatus.CANCELLED, label: "Đã hủy", count: counts.CANCELLED },
    { value: OrderStatus.RETURN_REQUESTED, label: "Trả hàng", count: counts.RETURN_REQUESTED },
    { value: OrderStatus.RETURNED, label: "Đã trả", count: counts.RETURNED },
  ];

  return (
    <div className="px-6 border-b border-slate-100 bg-white">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start border-none">
          {tabItems.map((item) => (
            <TabsTrigger 
              key={item.value} 
              value={item.value}
              className={cn(
                "px-0 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none transition-all gap-2",
                "text-sm font-bold text-slate-400 hover:text-slate-600 data-[state=active]:text-slate-900",
                "bg-transparent !bg-transparent !shadow-none"
              )}
            >
              <span>{item.label}</span>
              {item.count > 0 && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors",
                  activeTab === item.value 
                    ? "bg-slate-900 text-white" 
                    : "bg-slate-100 text-slate-500"
                )}>
                  {item.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
