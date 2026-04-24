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
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatCurrency";

const data = [
  { name: "Th 1", revenue: 4000, orders: 240 },
  { name: "Th 2", revenue: 3000, orders: 139 },
  { name: "Th 3", revenue: 2000, orders: 980 },
  { name: "Th 4", revenue: 2780, orders: 390 },
  { name: "Th 5", revenue: 1890, orders: 480 },
  { name: "Th 6", revenue: 2390, orders: 380 },
  { name: "Th 7", revenue: 3490, orders: 430 },
  { name: "Th 8", revenue: 4200, orders: 550 },
  { name: "Th 9", revenue: 3800, orders: 480 },
  { name: "Th 10", revenue: 5100, orders: 620 },
  { name: "Th 11", revenue: 4600, orders: 580 },
  { name: "Th 12", revenue: 6300, orders: 750 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xl space-y-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold text-slate-900">
            Doanh thu:{" "}
            <span className="text-blue-600">{formatCurrency(payload[0].value)}</span>
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

import { useRevenueReport } from "../hooks";
import { Loader2 } from "lucide-react";

export function RevenueChart({ params }: { params: any }) {
  const { data: reportData, isLoading } = useRevenueReport(params);

  const chartData = reportData?.data || [];
  const periodLabel = params.startDate ? "trong kỳ báo cáo" : "tất cả thời gian";

  if (isLoading) {
    return (
      <Card className="border border-slate-200 shadow-none overflow-hidden h-[516px] flex items-center justify-center bg-white rounded-xl">
        <Loader2 className="h-8 w-8 animate-spin text-slate-200" />
      </Card>
    );
  }

  return (
    <Card className="border border-slate-200 shadow-none overflow-hidden bg-white rounded-xl h-full flex flex-col">
      <CardHeader className="p-7 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Phân tích doanh thu & Đơn hàng
          </CardTitle>
          <p className="text-xl font-bold text-slate-900 mt-1">
            Biểu đồ tăng trưởng {periodLabel}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Doanh thu
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-200" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Đơn hàng
            </span>
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
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
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
