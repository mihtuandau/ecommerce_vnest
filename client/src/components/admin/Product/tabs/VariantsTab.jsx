import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../../utils/formatters';
import { notify } from '../../../../utils/notification';
import productService from '../../../../services/productService';

const VariantsTab = ({ product, onUpdate, readOnly }) => {
  const navigate = useNavigate();

  const goToEditVariants = () => {
    navigate(`/admin-products/${product.id}/edit#variants`);
  };

  const handleAddVariant = () => {
    if (readOnly) return;
    goToEditVariants();
  };

  const handleEditVariant = () => {
    if (readOnly) return;
    goToEditVariants();
  };

  const handleDeleteVariant = async (variant) => {
    if (readOnly) return;
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Biến thể sản phẩm</h2>
              <p className="text-sm text-gray-500 mt-1.5">
                {readOnly ? 'Xem danh sách biến thể' : 'Quản lý màu sắc, kích thước và giá của từng biến thể'}
              </p>
            </div>
            {!readOnly && (
              <button
                onClick={handleAddVariant}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                + Thêm biến thể
              </button>
            )}
          </div>
        </div>
        
        {product.variants && product.variants.length > 0 ? (
          <div className="border-b border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Màu</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Giá</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tồn kho</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ảnh</th>
                    {!readOnly && (
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {product.variants.map((variant) => (
                    <tr key={variant.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{variant.size || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{variant.color || '—'}</td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded font-mono">
                          {variant.sku || '—'}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">{formatPrice(variant.price)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          variant.stock > 10 
                            ? 'bg-green-100 text-green-700' 
                            : variant.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {variant.images && variant.images.length > 0 ? (
                          <div className="flex items-center justify-center gap-1">
                            {variant.images.slice(0, 3).map(img => (
                              <div key={img.id} className="w-10 h-10 rounded border border-gray-300 overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {variant.images.length > 3 && (
                              <span className="text-xs text-gray-500 ml-1">+{variant.images.length - 3}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      {!readOnly && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditVariant(variant)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteVariant(variant)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  Tổng: <span className="font-semibold text-gray-900">{product.variants.length}</span> biến thể
                </span>
                <span className="text-gray-700">
                  Tồn kho: <span className="font-semibold text-gray-900">
                    {product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)}
                  </span> sản phẩm
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có biến thể nào</h3>
            <p className="text-gray-500 mb-6">
              {readOnly ? 'Sản phẩm chưa có biến thể' : 'Thêm biến thể để khách hàng có nhiều lựa chọn hơn'}
            </p>
            {!readOnly && (
              <button
                onClick={handleAddVariant}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                + Thêm biến thể đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default VariantsTab;