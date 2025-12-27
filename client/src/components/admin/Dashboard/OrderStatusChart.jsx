import React from 'react';
import { Card, Space, Typography, List } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const { Text } = Typography;

const OrderStatusChart = ({ orderStatusData }) => {
  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      title={
        <Space>
          <PieChartOutlined style={{ color: '#722ed1', fontSize: 18 }} />
          <Text strong style={{ fontSize: 16 }}>Trạng thái đơn hàng</Text>
        </Space>
      }
      style={{ height: '100%' }}
    >
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={orderStatusData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {orderStatusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend with counts */}
      <List
        size="small"
        dataSource={orderStatusData}
        style={{ marginTop: 16 }}
        renderItem={(item) => (
          <List.Item style={{ padding: '8px 0', borderBottom: 'none' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space>
                <div 
                  style={{ 
                    width: 12, 
                    height: 12, 
                    backgroundColor: item.color, 
                    borderRadius: 2 
                  }} 
                />
                <Text style={{ fontSize: 13 }}>{item.name}</Text>
              </Space>
              <Text strong>{item.value}</Text>
            </Space>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OrderStatusChart;
