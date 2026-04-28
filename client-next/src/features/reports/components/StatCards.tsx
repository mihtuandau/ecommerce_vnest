"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  trend: "up" | "down";
  trendValue: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function StatCard({
  title,
  value,
  description,
  trend,
  trendValue,
  icon: Icon,
  iconColor,
  iconBg,
}: StatCardProps) {
  const isPositive = trend === "up";
  return (
    <Card className="border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white group hover:border-slate-300 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
              iconBg,
              iconColor
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold",
              isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            )}
          >
            {trendValue}
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value}</h3>
          <p className="text-xs text-slate-400 font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface StatCardsProps {
  summary: any;
}

export function StatCards({ summary }: StatCardsProps) {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(summary?.revenue?.total || 0),
      description: `Lũy kế hệ thống: ${formatCurrency(summary?.revenue?.absoluteTotal || 0)}`,
      trend: (summary?.revenue?.growth >= 0 ? "up" : "down") as const,
      trendValue: `${Math.abs(summary?.revenue?.growth || 0).toFixed(1)}%`,
      icon: DollarSign,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-500/10",
    },
    {
      title: "Đơn hàng thành công",
      value: (summary?.orders?.periodTotal || 0).toLocaleString(),
      description: `Tổng đơn thành công: ${summary?.orders?.total || 0}`,
      trend: (summary?.orders?.growth >= 0 ? "up" : "down") as const,
      trendValue: `${Math.abs(summary?.orders?.growth || 0).toFixed(1)}%`,
      icon: ShoppingBag,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-500/10",
    },
    {
      title: "Khách hàng",
      value: (summary?.users?.periodTotal || 0).toLocaleString(),
      description: `Tổng khách hàng: ${summary?.users?.total || 0}`,
      trend: (summary?.users?.growth >= 0 ? "up" : "down") as const,
      trendValue: `${Math.abs(summary?.users?.growth || 0).toFixed(1)}%`,
      icon: Users,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-500/10",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "3.24%",
      description: "Số đơn hàng / Số lượt truy cập",
      trend: "up" as const,
      trendValue: "1.2%",
      icon: TrendingUp,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
