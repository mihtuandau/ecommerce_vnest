import { formatPrice } from '../../../../utils/formatters';

const InfoTab = ({ product, formData, onFormChange }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-6 text-gray-900">Thông tin cơ bản</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sản phẩm <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => onFormChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            placeholder="Nhập tên sản phẩm"
          />
          <p className="mt-1 text-xs text-gray-500">Tên sản phẩm sẽ hiển thị cho khách hàng</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả sản phẩm
          </label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => onFormChange('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
            placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu..."
          />
          <p className="mt-1 text-xs text-gray-500">Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá gốc <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.basePrice || ''}
                onChange={(e) => onFormChange('basePrice', Number(e.target.value))}
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="0"
                min="0"
              />
              <span className="absolute right-4 top-3.5 text-gray-500 font-medium">VNĐ</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Giá bán chính thức</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá khuyến mãi
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.originalPrice || ''}
                onChange={(e) => onFormChange('originalPrice', Number(e.target.value))}
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                placeholder="0"
                min="0"
              />
              <span className="absolute right-4 top-3.5 text-gray-500 font-medium">VNĐ</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Giá trước khuyến mãi (nếu có)</p>
          </div>
        </div>

        {formData.basePrice > 0 && formData.originalPrice > 0 && formData.originalPrice > formData.basePrice && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              💰 Giảm giá: <span className="font-bold">{formatPrice(formData.originalPrice - formData.basePrice)}</span>
              {' '}({Math.round(((formData.originalPrice - formData.basePrice) / formData.originalPrice) * 100)}%)
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasVariants"
              checked={product.variants?.length > 0}
              disabled
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasVariants" className="text-sm text-gray-700">
              Sản phẩm này có <span className="font-semibold">{product.variants?.length || 0}</span> biến thể
            </label>
          </div>
          <p className="mt-1 ml-7 text-xs text-gray-500">Chuyển sang tab "Biến thể" để quản lý</p>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;
