import React from 'react';
import { TrendingUp } from 'lucide-react';

const TopProducts = ({ products }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Sản phẩm bán chạy
          </h2>
        </div>
        {products.length > 5 && (
          <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            Top 5/{products.length}
          </span>
        )}
      </div>

      {/* Scrollable container with fixed height */}
      <div className="overflow-y-auto max-h-[400px] space-y-3 pr-2 custom-scrollbar">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
        ) : (
          products.slice(0, 5).map((item, index) => (
            <div
              key={item.product.id}
              className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-semibold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate text-sm">{item.product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {item.product.category?.name}
                  </span>
                  {item.product.brand?.name && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs text-gray-500">
                        {item.product.brand.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-gray-900">{item.totalSold}</p>
                <p className="text-xs text-gray-500">Đã bán</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {products.length > 5 && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
            Xem tất cả {products.length} sản phẩm →
          </button>
        </div>
      )}
    </div>
  );
};

export default TopProducts;
