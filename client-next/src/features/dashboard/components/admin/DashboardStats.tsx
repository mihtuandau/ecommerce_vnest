"use client";

import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import type { DashboardStatsSummary } from "@/features/dashboard/types";

interface DashboardStatsProps {
  summary?: DashboardStatsSummary;
  isLoading: boolean;
}

export function DashboardStats({ summary, isLoading }: DashboardStatsProps) {
  const formatChange = (value?: number) => {
    const change = value || 0;
    return `${change >= 0 ? "+" : ""}${change}%`;
  };

  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(summary?.revenue?.today || 0),
      change: formatChange(summary?.revenue?.change),
      isPositive: (summary?.revenue?.change || 0) >= 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Đơn hàng hôm nay",
      value: String(summary?.orders?.today || 0),
      change: formatChange(summary?.orders?.change),
      isPositive: (summary?.orders?.change || 0) >= 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Khách hàng mới",
      value: String(summary?.users?.new || 0),
      change: formatChange(summary?.users?.change),
      isPositive: (summary?.users?.change || 0) >= 0,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Sản phẩm",
      value: String(summary?.products?.total || 0),
      change: `${summary?.products?.lowStock || 0} sắp hết hàng`,
      isPositive: (summary?.products?.lowStock || 0) === 0,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] bg-white rounded-2xl overflow-hidden"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${stat.isPositive ? "bg-emerald-50 text-emerald-600" : "bg-destructive/10 text-destructive"}`}
              >
                {stat.change}
                {stat.isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
              </div>
            </div>
            <p className="text-xs font-medium text-slate-500 mb-1">{stat.title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
