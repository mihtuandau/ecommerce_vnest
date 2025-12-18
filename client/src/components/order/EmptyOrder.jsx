import React from 'react';
import { FaBox, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmptyOrder = ({ type = 'no-orders', onResetFilter }) => {
  const navigate = useNavigate();

  if (type === 'no-orders') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FaBox size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-gray-600 mb-6">
          Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Mua sắm ngay
        </button>
      </div>
    );
  }

  if (type === 'no-filter-results') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <FaClock size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Không tìm thấy đơn hàng
        </h3>
        <p className="text-gray-600 mb-6">
          Không có đơn hàng nào ở trạng thái này.
        </p>
        <button
          onClick={onResetFilter}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Xem tất cả đơn hàng
        </button>
      </div>
    );
  }

  return null;
};

export default EmptyOrder;
