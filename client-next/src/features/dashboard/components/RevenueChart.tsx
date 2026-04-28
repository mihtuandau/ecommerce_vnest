"use client";

import { TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenueReport } from "@/features/reports/hooks";
import { formatCurrency } from "@/utils/formatCurrency";
import dayjs from "@/lib/dayjs";

interface RevenueChartProps {
  data: any[];
  isLoading: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const [timeRange, setTimeRange] = useState("30_days");

  const params = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case "7_days": {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        return { startDate: start.toISOString(), endDate: now.toISOString() };
      }
      case "30_days": {
        const start = new Date();
        start.setDate(now.getDate() - 30);
        return { startDate: start.toISOString(), endDate: now.toISOString() };
      }
      case "3_months": {
        const start = new Date();
        start.setMonth(now.getMonth() - 3);
        return { startDate: start.toISOString(), endDate: now.toISOString() };
      }
      case "năm": {
        return { year: now.getFullYear() };
      }
      default:
        return {};
    }
  }, [timeRange]);

  const { data: filteredData, isLoading: isFilteredLoading } = useRevenueReport(params);

  const getChartData = () => {
    const rawData =
      filteredData?.data || filteredData?.monthly || filteredData?.daily || [];
    return Array.isArray(rawData) ? rawData : [];
  };

  const chartData = getChartData().map((item: any) => ({
    name: item.date || item.label,
    total: item.revenue || 0,
  }));

  const displayLoading = isLoading || isFilteredLoading;

  return (
    <Card className="lg:col-span-2 border border-slate-200 shadow-none rounded-xl overflow-hidden bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-slate-800">
            Biểu đồ doanh thu
          </CardTitle>
          <CardDescription className="text-xs font-medium text-slate-600">
            Theo dõi tăng trưởng doanh thu
          </CardDescription>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
          {[
            { label: "7 ngày", value: "7_days" },
            { label: "30 ngày", value: "30_days" },
            { label: "Năm", value: "năm" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setTimeRange(btn.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                timeRange === btn.value
                  ? "bg-white shadow-none border border-slate-200 text-indigo-600"
                  : "text-slate-600 hover:text-slate-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[350px] w-full">
          {displayLoading ? (
            <div className="h-full w-full bg-muted/20 animate-pulse rounded-2xl flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary/30" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fontWeight: 600, fill: "#64748b" }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${value / 1000000}Tr`;
                    if (value >= 1000) return `${value / 1000}K`;
                    return value;
                  }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: 700, color: "#6366f1" }}
                  formatter={(value: any) => [formatCurrency(value), "Doanh thu"]}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-muted/20 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500">
              <AlertCircle className="h-8 w-8 opacity-20" />
              <p className="text-xs font-medium">Chưa có dữ liệu cho thời gian này</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
