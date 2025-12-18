import React from 'react';
import { formatPrice } from '../../utils/formatters';

const OrderPriceSummary = ({ order }) => {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-normal text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Tổng Thanh Toán
      </h2>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Tạm tính</span>
          <span className="text-gray-900">{formatPrice(order.total - (order.shippingFee || 0))}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">
            {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee || 0)}
          </span>
        </div>

        {order.discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-gray-900">-{formatPrice(order.discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-normal pt-3 border-t border-gray-200">
          <span className="text-gray-900">Tổng cộng</span>
          <span className="text-gray-900">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderPriceSummary;
