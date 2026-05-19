"use client";

import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { STATUS_MAP } from "../constants";

interface OrderStatusChartProps {
  data: any[];
  isLoading: boolean;
}

export function OrderStatusChart({ data, isLoading }: OrderStatusChartProps) {
  const statusData = useMemo(() => {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      const keys = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
        "returning",
      ];
      return keys
        .map((key) => {
          const status = key.toUpperCase();
          const statusInfo = STATUS_MAP[status];
          return {
            name: statusInfo?.label || status,
            value: (data as any)[key] || 0,
            color: statusInfo?.hex || "#CBD5E1",
          };
        })
        .filter((item) => item.value > 0);
    }

    if (!Array.isArray(data)) return [];

    return data
      .map((item) => {
        const statusInfo = STATUS_MAP[item.status];
        return {
          name: statusInfo?.label || item.status,
          value: item._count?.id || 0,
          color: statusInfo?.hex || "#CBD5E1",
        };
      })
      .filter((item) => item.value > 0);
  }, [data]);

  return (
    <Card className="border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] bg-white rounded-2xl overflow-hidden h-full flex flex-col">
      <CardHeader className="border-b border-slate-50 px-6 py-4">
        <CardTitle className="text-base font-semibold text-slate-900">
          Trạng thái đơn hàng
        </CardTitle>
        <CardDescription className="text-xs font-medium text-slate-500">
          Phân bổ đơn hàng theo trạng thái hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="h-[400px] w-full flex flex-col">
          {isLoading ? (
            <div className="h-full w-full bg-slate-50 animate-pulse rounded-xl" />
          ) : statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  itemStyle={{ fontSize: "12px", fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-slate-700 tracking-tight">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-dashed" />
              </div>
              <p className="text-xs font-medium italic">Chưa có đơn hàng</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
