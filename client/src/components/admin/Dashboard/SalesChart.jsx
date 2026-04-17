import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "../../../utils/formatters";

const SalesChart = ({ revenueData, onFilterChange }) => {
  const formatCurrency = formatPrice;
  const [timeRange, setTimeRange] = useState("30_days"); // Hiển thị text nút đang active

  // Dữ liệu hiển thị lấy từ revenueData.data nếu có, không thì lấy từ monthly/daily mặc định
  const getChartData = () => {
    if (revenueData.type === "daily" || revenueData.type === "monthly") {
      return revenueData.data;
    }
    // Mặc định ban đầu (summary) - Backend đã trả về label rồi
    return timeRange === "năm" ? revenueData.monthly : revenueData.daily;
  };

  const chartData = getChartData();

  const handleRangeChange = (range) => {
    setTimeRange(range);
    const now = new Date();

    switch (range) {
      case "7_days": {
        const start = new Date();
        start.setDate(now.getDate() - 7);
        onFilterChange({
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        });
        break;
      }
      case "30_days": {
        const start = new Date();
        start.setDate(now.getDate() - 30);
        onFilterChange({
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        });
        break;
      }
      case "3_months": {
        const start = new Date();
        start.setMonth(now.getMonth() - 3);
        onFilterChange({
          startDate: start.toISOString(),
          endDate: now.toISOString(),
        });
        break;
      }
      case "năm": {
        onFilterChange({ year: now.getFullYear() });
        break;
      }
      default:
        break;
    }
  };

  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) return tickItem / 1000000 + "Tr";
    if (tickItem >= 1000) return tickItem / 1000 + "K";
    return tickItem;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full w-[100%] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">
          Doanh thu
        </h3>
        <div className="flex space-x-1">
          {[
            { label: "7 ngày", value: "7_days" },
            { label: "30 ngày", value: "30_days" },
            { label: "3 tháng", value: "3_months" },
            { label: "Năm nay", value: "năm" },
          ].map((btn) => {
            const isActive = timeRange === btn.value;
            return (
              <button
                key={btn.value}
                onClick={() => handleRangeChange(btn.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-grow w-full h-[320px]">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 10 }}
                dy={10}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                tickFormatter={formatYAxis}
              />
              <Tooltip
                contentStyle={{
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [formatCurrency(value), "Doanh thu"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={timeRange === "năm"}
                activeDot={{
                  r: 6,
                  fill: "#3B82F6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
