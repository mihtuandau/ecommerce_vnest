import React from 'react';
import { FaBox, FaTruck, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';
import { formatDateTime } from '../../utils/formatters';

const TrackingTimeline = ({ logs }) => {
  if (!logs || !Array.isArray(logs) || logs.length === 0) return null;

  // Sắp xếp logs từ mới nhất đến cũ nhất
  const sortedLogs = [...logs].sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));

  const getStatusLabel = (status) => {
    const labels = {
      'ready_to_pick': 'Sẵn sàng lấy hàng',
      'picking': 'Chờ shipper lấy hàng',
      'money_collect_picking': 'Shipper đang lấy hàng và thu tiền',
      'picked': 'Đã lấy hàng thành công',
      'storing': 'Đã nhập kho',
      'stored': 'Đã nhập kho',
      'transporting': 'Đang trung chuyển',
      'sorting': 'Đang phân loại',
      'delivering': 'Đang giao hàng',
      'money_collect_delivering': 'Shipper đang giao hàng và thu tiền',
      'delivered': 'Giao hàng thành công',
      'delivery_fail': 'Giao hàng thất bại',
      'waiting_to_return': 'Chờ trả hàng',
      'return': 'Đang trả hàng',
      'returned': 'Đã trả hàng thành công',
      'cancel': 'Đã hủy đơn'
    };
    return labels[status.toLowerCase()] || status;
  };

  const getStatusIcon = (status, isLatest) => {
    const s = status.toLowerCase();
    const color = isLatest ? 'text-orange-500' : 'text-gray-300';
    
    if (s === 'delivered') return <FaCheckCircle className={color} />;
    if (s.includes('deliver') || s.includes('transport')) return <FaTruck className={color} />;
    if (s.includes('pick') || s.includes('store')) return <FaBox className={color} />;
    return <FaMapMarkerAlt className={color} />;
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-4">
      <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
        <FaTruck className="text-orange-500" />
        Hành trình đơn hàng (GHN)
      </h3>
      
      <div className="relative space-y-6">
        {/* Đường kẻ dọc nối các mốc */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

        {sortedLogs.map((log, index) => (
          <div key={index} className="relative flex items-start pl-8 group">
            {/* Icon mốc */}
            <div className={`absolute left-0 top-0.5 z-10 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center ${index === 0 ? 'border-orange-500 scale-110 shadow-sm' : 'border-gray-200'}`}>
              {getStatusIcon(log.status, index === 0)}
            </div>

            <div>
              <div className={`text-sm font-semibold ${index === 0 ? 'text-orange-600' : 'text-slate-700'}`}>
                {getStatusLabel(log.status)}
              </div>
              <div className="text-[11px] text-gray-500 font-inter mt-1">
                {formatDateTime(log.updated_date)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;
