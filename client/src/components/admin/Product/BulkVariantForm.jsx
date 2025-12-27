import { useState } from 'react';
import { notify } from '../../../utils/notification';

const BulkVariantForm = ({ product, bulkData, setBulkData }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Màu Sắc <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={bulkData.color}
          onChange={(e) => setBulkData({ ...bulkData, color: e.target.value })}
          placeholder="VD: Đen, Trắng, Xanh..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Các Size (cách nhau bằng dấu phẩy) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={bulkData.sizes}
          onChange={(e) => setBulkData({ ...bulkData, sizes: e.target.value })}
          placeholder="VD: S, M, L, XL, XXL hoặc 29, 30, 31, 32, 33"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Mỗi size sẽ tạo thành 1 variant riêng với màu đã chọn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giá (₫)
          </label>
          <input
            type="number"
            value={bulkData.price}
            onChange={(e) => setBulkData({ ...bulkData, price: e.target.value })}
            placeholder={product?.basePrice || '0'}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tồn Kho (mỗi size)
          </label>
          <input
            type="number"
            value={bulkData.stock}
            onChange={(e) => setBulkData({ ...bulkData, stock: e.target.value })}
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SKU Prefix (tùy chọn)
        </label>
        <input
          type="text"
          value={bulkData.skuPrefix}
          onChange={(e) => setBulkData({ ...bulkData, skuPrefix: e.target.value })}
          placeholder="VD: PRD-DEN → sẽ tạo PRD-DEN-S, PRD-DEN-M..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Preview */}
      {bulkData.color && bulkData.sizes && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-900 mb-2">
            📋 Sẽ tạo {bulkData.sizes.split(',').filter(s => s.trim()).length} variants:
          </p>
          <div className="flex flex-wrap gap-2">
            {bulkData.sizes.split(',').map((size, idx) => {
              const trimmedSize = size.trim();
              if (!trimmedSize) return null;
              return (
                <span key={idx} className="inline-flex items-center px-2 py-1 bg-white text-green-700 text-xs rounded border border-green-300">
                  Size {trimmedSize} - {bulkData.color}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkVariantForm;
