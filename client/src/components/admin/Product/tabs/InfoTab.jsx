import { formatPrice } from '../../../../utils/formatters';
import { BadgePercent } from 'lucide-react';

const CARD_CLASS = 'shadow-none border border-[#E6E8EC] rounded-xl overflow-hidden bg-white';

const InfoTab = ({ product, formData, onFormChange, readOnly }) => {
  // Use formData if provided (edit mode), otherwise use product (view mode)
  const data = formData || product || {};

  const inputCls = (extra = '') =>
    `w-full px-4 py-3 border rounded-lg transition-all text-sm ${
      readOnly 
        ? 'bg-gray-50 border-[#E6E8EC] cursor-not-allowed text-gray-600' 
        : 'bg-white border-[#E6E8EC] focus:border-[#37A76B] focus:ring-2 focus:ring-green-100'
    } ${extra}`;

  return (
    <div className="w-full max-w-[1600px] mx-auto py-6 bg-white">
      <div className={`${CARD_CLASS} p-6 mb-6`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Thông tin cơ bản</h2>
        <p className="text-sm text-gray-500">Chỉnh sửa thông tin chi tiết sản phẩm</p>
      </div>
      
      <div className={`${CARD_CLASS} p-6`}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Tên sản phẩm {!readOnly && <span className="text-red-500 font-bold">*</span>}
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
            <p className="mt-2 text-xs text-gray-500">Tên sản phẩm sẽ hiển thị cho khách hàng trên toàn bộ website</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Mô tả sản phẩm
            </label>
            <textarea
              value={data.description || ''}
              onChange={(e) => !readOnly && onFormChange && onFormChange('description', e.target.value)}
              readOnly={readOnly}
              disabled={readOnly}
              rows={6}
              className={inputCls('resize-none')}
              placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu, hướng dẫn bảo quản..."
            />
            <p className="mt-2 text-xs text-gray-500">Mô tả chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Giá bán {!readOnly && <span className="text-red-500 font-bold">*</span>}
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
                <span className="absolute right-4 top-3.5 text-gray-600 font-medium text-sm">VNĐ</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Giá bán chính thức cho sản phẩm</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Giá niêm yết
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
                <span className="absolute right-4 top-3.5 text-gray-600 font-medium text-sm">VNĐ</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">{'Giá gốc trước khuyến mãi (phải >= giá bán)'}</p>
            </div>
          </div>

          {Number(data.basePrice) > 0 && Number(data.originalPrice) > 0 && Number(data.originalPrice) > Number(data.basePrice) && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-[#37A76B] rounded-lg">
              <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                <BadgePercent size={16} className="text-green-700" />
                <span>Giảm giá: <span className="font-bold text-green-900">{formatPrice(Number(data.originalPrice) - Number(data.basePrice))}</span>
                {' '}({Math.round(((Number(data.originalPrice) - Number(data.basePrice)) / Number(data.originalPrice)) * 100)}%)
                </span>
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-[#E6E8EC]">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="hasVariants"
                checked={(product?.variants?.length || 0) > 0}
                disabled
                className="w-4 h-4 text-[#37A76B] border-[#E6E8EC] rounded focus:ring-[#37A76B] mt-1"
              />
              <div>
                <label htmlFor="hasVariants" className="text-sm font-medium text-gray-800">
                  Sản phẩm này có <span className="font-bold text-[#37A76B]">{product?.variants?.length || 0}</span> biến thể
                </label>
                <p className="mt-1 text-xs text-gray-500">Chuyển sang tab "Biến thể" để quản lý size, màu và giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoTab;