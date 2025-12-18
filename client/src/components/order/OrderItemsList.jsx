import React from 'react';
import OrderItem from './OrderItem';

const OrderItemsList = ({ items = [] }) => {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-lg font-normal text-gray-900 mb-6 pb-4 border-b border-gray-200">
        Chi Tiết Sản Phẩm
      </h2>
      
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <OrderItem 
              item={item} 
              showReviewButton={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default OrderItemsList;
