import React from 'react';

const OrderStatusFilter = ({ activeStatus, onStatusChange, statusCounts = {} }) => {
  const filters = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'PENDING', label: 'Chờ xác nhận' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPED', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const isActive = activeStatus === filter.value;
        const count = statusCounts[filter.value] || 0;

        return (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`
              px-4 py-2 text-sm font-normal transition-colors
              ${isActive 
                ? 'bg-[#00a85a] text-white' 
                : 'border border-gray-300 text-gray-900 hover:border-[#00a85a]'
              }
            `}
          >
            {filter.label} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilter;
