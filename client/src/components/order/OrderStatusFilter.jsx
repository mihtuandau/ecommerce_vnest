import React from "react";

const OrderStatusFilter = ({
  activeStatus,
  onStatusChange,
  statusCounts = {},
}) => {
  const filters = [
    { value: "ALL", label: "Tất cả" },
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "PROCESSING", label: "Đang xử lý" },
    { value: "SHIPPED", label: "Đang giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex overflow-x-auto flex-nowrap scrollbar-hide">
        {filters.map((filter) => {
          const isActive = activeStatus === filter.value;
          const count = statusCounts[filter.value] || 0;

          return (
            <button
              key={filter.value}
              onClick={() => onStatusChange(filter.value)}
              className={`
                relative flex-1 min-w-[100px] sm:min-w-0 py-3 sm:py-4 text-center transition-all cursor-pointer
                ${isActive ? "text-black" : "text-gray-500 hover:text-black"}
              `}
            >
              <div className="flex items-center justify-center gap-1.5">
                <span className={`text-[12px] sm:text-[13px] whitespace-nowrap font-medium ${isActive ? 'font-bold' : ''}`}>
                  {filter.label}
                </span>
                {count > 0 && (
                  <span className={`text-[9px] font-bold ${isActive ? 'text-black' : 'text-gray-300'}`}>
                    ({count})
                  </span>
                )}
              </div>
              
              {/* Shopee-style Active Underline */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusFilter;
