"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRevenueReport } from "@/features/reports/hooks";
import type { ReportQueryParams } from "@/features/reports/types";
import { Spinner } from "@/components/ui/Spinner";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xl space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-slate-900">
            Doanh thu:{" "}
            <span className="text-primary">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-xs font-medium text-slate-500">
            Đơn hàng:{" "}
            <span className="text-slate-900">{payload[1]?.value || 0} đơn</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({
  params,
}: {
  params?: ReportQueryParams;
}) {
  const { data: reportData, isLoading } = useRevenueReport(params || {});

  const chartData = reportData?.data || [];
  const periodLabel = params?.startDate ? "trong kỳ báo cáo" : "tất cả thời gian";

  if (isLoading) {
    return (
      <Card className="border border-slate-200 shadow-none overflow-hidden h-[516px] flex items-center justify-center bg-white rounded-xl">
        <Spinner size="lg" />
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-none overflow-hidden bg-white rounded-xl h-full flex flex-col">
      <CardHeader className="p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xs font-medium text-slate-500">
            Phân tích doanh thu & Đơn hàng
          </CardTitle>
          <p className="text-xl font-bold text-slate-900 mt-1 tracking-tight">
            Biểu đồ tăng trưởng {periodLabel}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-slate-500">Doanh thu</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="text-xs font-medium text-slate-500">Đơn hàng</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-7 flex-1">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1565C0" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1565C0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1565C0"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#e2e8f0"
                strokeWidth={2}
                fillOpacity={0.1}
                fill="#e2e8f0"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
