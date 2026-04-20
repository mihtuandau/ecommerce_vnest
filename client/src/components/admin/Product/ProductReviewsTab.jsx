import React from 'react';
import { MessageSquare } from 'lucide-react';

const ProductReviewsTab = () => {
  return (
    <div className="animate-fade-in">
      <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
        <div className="w-1.5 h-4 bg-gray-400 rounded-sm"></div>
        PHẢN HỒI KHÁCH HÀNG
      </h3>
      <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
        <h4 className="text-sm font-bold text-gray-700 mb-1">Chưa có đánh giá</h4>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">Chưa có khách hàng nào để lại đánh giá cho sản phẩm này.</p>
      </div>
    </div>
  );
};

export default ProductReviewsTab;
