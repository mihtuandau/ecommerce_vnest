import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatPrice } from '../../../utils/formatters';

const SalesChart = ({ revenueData }) => {
  const formatCurrency = formatPrice;
  const [timeRange, setTimeRange] = useState('30_days');

  // Helper func to shorten names for display
  const formatYAxis = (tickItem) => {
    if (tickItem >= 1000000) {
      return (tickItem / 1000000) + 'M';
    }
    return tickItem;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full w-[100%] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Doanh thu</h3>
        <div className="flex space-x-1">
          {['7 ngày', '30 ngày', '3 tháng', 'Năm'].map((btn, index) => {
            const keys = ['7_days', '30_days', '3_months', 'year'];
            const isActive = timeRange === keys[index];
            return (
              <button
                key={keys[index]}
                onClick={() => setTimeRange(keys[index])}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex-grow w-full h-[320px]">
        {revenueData && revenueData.chartData && revenueData.chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                tickFormatter={formatYAxis}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(value), 'Doanh thu'];
                  return [value, 'Đơn hàng'];
                }}
                labelStyle={{ color: '#6B7280', marginBottom: '8px' }}
                itemStyle={{ color: '#1F2937', fontWeight: 600 }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                name="revenue"
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