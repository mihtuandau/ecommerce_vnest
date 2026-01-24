import { formatPrice } from '../../../../utils/formatters';

const InfoTab = ({ product, formData, onFormChange, readOnly }) => {
  // Use formData if provided (edit mode), otherwise use product (view mode)
  const data = formData || product || {};

  const inputCls = (extra = '') =>
    `w-full px-4 py-3 border rounded-lg transition-all ${
      readOnly 
        ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-600' 
        : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    } ${extra}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold mb-6 text-gray-900">Thông tin cơ bản</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sản phẩm {!readOnly && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => !readOnly && onFormChange && onFormChange('name', e.target.value)}
            readOnly={readOnly}
            disabled={readOnly}
            className={inputCls()}
            placeholder="Nhập tên sản phẩm"
          />
          <p className="mt-1.5 text-xs text-gray-500">Tên sản phẩm sẽ hiển thị cho khách hàng</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả sản phẩm
          </label>
          <textarea
            value={data.description || ''}
            onChange={(e) => !readOnly && onFormChange && onFormChange('description', e.target.value)}
            readOnly={readOnly}
            disabled={readOnly}
            rows={6}
            className={inputCls('resize-none')}
            placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu..."
          />
          <p className="mt-1.5 text-xs text-gray-500">Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá gốc {!readOnly && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.basePrice || ''}
                onChange={(e) => !readOnly && onFormChange && onFormChange('basePrice', Number(e.target.value))}
                readOnly={readOnly}
                disabled={readOnly}
                className={inputCls('pr-16')}
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
                value={data.originalPrice || ''}
                onChange={(e) => {
                  if (readOnly || !onFormChange) return;
                  const v = Number(e.target.value);
                  if (v > 0 && Number(data.basePrice) > 0 && v <= Number(data.basePrice)) {
                    onFormChange('originalPrice', v);
                    return;
                  }
                  onFormChange('originalPrice', v);
                }}
                readOnly={readOnly}
                disabled={readOnly}
                className={inputCls('pr-16')}
                placeholder="0"
                min="0"
              />
              <span className="absolute right-4 top-3.5 text-gray-500 font-medium">VNĐ</span>
            </div>
            <p className="mt-1 text-xs text-gray-500">Giá trước khuyến mãi (phải lớn hơn giá bán)</p>
          </div>
        </div>

        {Number(data.basePrice) > 0 && Number(data.originalPrice) > 0 && Number(data.originalPrice) > Number(data.basePrice) && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-sm font-semibold text-green-800">
              💰 Giảm giá: <span className="font-bold text-green-900">{formatPrice(Number(data.originalPrice) - Number(data.basePrice))}</span>
              {' '}({Math.round(((Number(data.originalPrice) - Number(data.basePrice)) / Number(data.originalPrice)) * 100)}%)
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="hasVariants"
              checked={(product?.variants?.length || 0) > 0}
              disabled
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasVariants" className="text-sm text-gray-700">
              Sản phẩm này có <span className="font-semibold">{product?.variants?.length || 0}</span> biến thể
            </label>
          </div>
          <p className="mt-1 ml-7 text-xs text-gray-500">Chuyển sang tab "Biến thể" để quản lý</p>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;