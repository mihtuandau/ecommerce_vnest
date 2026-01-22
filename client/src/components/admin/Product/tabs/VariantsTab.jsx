import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../../utils/formatters';
import { notify } from '../../../../utils/notification';
import productService from '../../../../services/productService';
import VariantFormModal from '../VariantFormModal';

const VariantsTab = ({ product, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);

  const handleAddVariant = () => {
    setEditingVariant(null);
    setShowModal(true);
  };

  const handleEditVariant = (variant) => {
    setEditingVariant(variant);
    setShowModal(true);
  };

  const handleDeleteVariant = async (variant) => {
    if (!window.confirm(`Bạn có chắc muốn xóa biến thể "${variant.size} - ${variant.color}"?`)) return;

    try {
      await productService.deleteVariant(variant.id);
      notify.success('Đã xóa biến thể');
      await onUpdate();
    } catch (error) {
      notify.error(error.message || 'Xóa thất bại');
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Biến thể sản phẩm</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý màu sắc, kích thước và giá của từng biến thể</p>
          </div>
          <button 
            onClick={handleAddVariant}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Thêm biến thể
          </button>
        </div>
        
        {product.variants && product.variants.length > 0 ? (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Màu</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Giá</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Tồn kho</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ảnh</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{variant.size || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{variant.color || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 font-mono">{variant.sku || '—'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-right text-emerald-600">{formatPrice(variant.price)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          variant.stock > 10 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : variant.stock > 0
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {variant.images && variant.images.length > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {variant.images.slice(0, 3).map(img => (
                              <div key={img.id} className="w-8 h-8 rounded border border-gray-300 overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {variant.images.length > 3 && (
                              <span className="text-xs text-gray-500">+{variant.images.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditVariant(variant)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVariant(variant)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tổng: <span className="font-semibold text-gray-900">{product.variants.length}</span> biến thể</span>
                <span className="text-gray-600">
                  Tồn kho: <span className="font-semibold text-gray-900">
                    {product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
                  </span> sản phẩm
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có biến thể nào</h3>
            <p className="text-gray-500 mb-4">Thêm biến thể để khách hàng có nhiều lựa chọn hơn</p>
            <button 
              onClick={handleAddVariant}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              + Thêm biến thể đầu tiên
            </button>
          </div>
        )}
      </div>

      <VariantFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingVariant(null);
        }}
        variant={editingVariant}
        productId={product.id}
        onSuccess={onUpdate}
      />
    </>
  );
};

export default VariantsTab;
