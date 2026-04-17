import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const OrderStatusChart = ({ orderStatusData }) => {
  const totalOrders = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col h-full hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 tracking-tight mb-6 mt-1">Đơn hàng theo trạng thái</h3>
      <div className="flex-grow w-full h-[280px]">
        {orderStatusData && orderStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="45%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={8}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                itemStyle={{ color: '#1F2937', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Không có dữ liệu
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {orderStatusData.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-bold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusChart;






