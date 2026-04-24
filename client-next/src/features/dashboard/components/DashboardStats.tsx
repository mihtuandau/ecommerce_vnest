"use client";

import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";

interface DashboardStatsProps {
  summary: any;
  isLoading: boolean;
}

export function DashboardStats({ summary, isLoading }: DashboardStatsProps) {
  const stats = [
    {
      title: "Doanh thu hôm nay",
      value: formatCurrency(summary?.revenue?.today || 0),
      change: `${summary?.revenue?.change >= 0 ? "+" : ""}${summary?.revenue?.change || 0}%`,
      isPositive: (summary?.revenue?.change || 0) >= 0,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Đơn hàng hôm nay",
      value: String(summary?.orders?.today || 0),
      change: `${summary?.orders?.change >= 0 ? "+" : ""}${summary?.orders?.change || 0}%`,
      isPositive: (summary?.orders?.change || 0) >= 0,
      icon: ShoppingCart,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Khách hàng mới",
      value: String(summary?.users?.new || 0),
      change: `${summary?.users?.change >= 0 ? "+" : ""}${summary?.users?.change || 0}%`,
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
        <Card key={index} className="border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${stat.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-destructive/10 text-destructive'}`}>
                {stat.change}
                {stat.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-lg" />
            ) : (
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
