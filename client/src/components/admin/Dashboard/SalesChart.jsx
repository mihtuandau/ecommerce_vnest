import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

const SalesChart = ({ revenueData, topProductsData }) => {
  const formatCurrency = formatPrice;

  return (
    <>
      {/* Revenue & Orders Chart */}
      <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Doanh thu & Đơn hàng
            </h2>
            <p className="text-xs text-gray-500">Năm {revenueData?.year || new Date().getFullYear()}</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData?.chartData || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value, name) => {
                if (name === 'revenue') return [formatCurrency(value), 'Doanh thu'];
                return [value, 'Đơn hàng'];
              }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#6366f1" 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Doanh thu"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Số đơn"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products Bar Chart */}
      {topProductsData && topProductsData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Top Sản phẩm bán chạy
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(value), 'Doanh thu'];
                  return [value, 'Đã bán'];
                }}
              />
              <Legend />
              <Bar dataKey="sold" fill="#6366f1" name="Số lượng bán" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
};

export default SalesChart;