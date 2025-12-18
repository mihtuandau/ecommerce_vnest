import React from 'react';

const OrderShippingInfo = ({ order }) => {
  const getPaymentMethodText = (method) => {
    const methods = {
      CASH: 'Thanh toán khi nhận hàng (COD)',
      VNPAY: 'VNPay',
      MOMO: 'MoMo',
      CARD: 'Thẻ tín dụng/ghi nợ',
      PAYOS: 'PayOS'
    };
    return methods[method] || method;
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-normal text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Thông Tin Giao Hàng
      </h2>
      
      <div className="space-y-4 text-sm">
        <div className="flex gap-3">
          <span className="text-gray-600 w-32 flex-shrink-0">Người nhận</span>
          <span className="text-gray-900">
            {order.shippingInfo?.fullName || 'Chưa cập nhật'}
          </span>
        </div>
        
        <div className="flex gap-3">
          <span className="text-gray-600 w-32 flex-shrink-0">Số điện thoại</span>
          <span className="text-gray-900">
            {order.shippingInfo?.phone || 'Chưa cập nhật'}
          </span>
        </div>
        
        <div className="flex gap-3">
          <span className="text-gray-600 w-32 flex-shrink-0">Địa chỉ</span>
          <span className="text-gray-900 flex-1">
            {order.shippingAddress || 'Chưa cập nhật'}
          </span>
        </div>

        {order.shippingInfo?.note && (
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <span className="text-gray-600 w-32 flex-shrink-0">Ghi chú</span>
            <span className="text-gray-900 flex-1">{order.shippingInfo.note}</span>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <span className="text-gray-600 w-32 flex-shrink-0">Thanh toán</span>
          <span className="text-gray-900">
            {getPaymentMethodText(order.paymentMethod)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderShippingInfo;
