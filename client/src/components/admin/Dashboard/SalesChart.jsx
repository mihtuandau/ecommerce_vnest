import React from 'react';
import { Card, Space, Typography } from 'antd';
import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons';
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
import { formatPrice } from '../../../utils/formatters';

const { Text } = Typography;

const SalesChart = ({ revenueData, topProductsData }) => {
  const formatCurrency = formatPrice;

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* Revenue & Orders Chart */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: '#1890ff', fontSize: 18 }} />
            <div>
              <Text strong style={{ fontSize: 16 }}>Doanh thu & Đơn hàng</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Năm {revenueData?.year || new Date().getFullYear()}
              </Text>
            </div>
          </Space>
        }
        style={{ width: '100%' }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData?.chartData || []}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: 12 }} />
            <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
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
              stroke="#1890ff" 
              fillOpacity={1} 
              fill="url(#colorRevenue)"
              name="Doanh thu"
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#faad14" 
              strokeWidth={2}
              name="Số đơn"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Products Bar Chart */}
      {topProductsData && topProductsData.length > 0 && (
        <Card
          title={
            <Space>
              <LineChartOutlined style={{ color: '#52c41a', fontSize: 18 }} />
              <Text strong style={{ fontSize: 16 }}>Top Sản phẩm bán chạy</Text>
            </Space>
          }
          style={{ width: '100%' }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" style={{ fontSize: 12 }} />
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
              <Bar dataKey="sold" fill="#1890ff" name="Số lượng bán" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}
    </Space>
  );
};

export default SalesChart;