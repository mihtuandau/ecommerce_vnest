import { Package, Layers, Edit2, Trash2 } from 'lucide-react';
import { formatPrice } from '../../../utils/formatters';

const ProductDetails = ({ product, onEditVariant, onDeleteVariant }) => {

  const mainImages = product.images?.filter(img => !img.variantId) || [];

  return (
    <tr className="bg-slate-50">
      <td colSpan="7" className="px-4 py-3">
        <div className="space-y-3 text-sm">
          {/* Row 1: Info & Main Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* Info */}
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-1">Tên / Danh mục</p>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-600 mt-1">{product.category?.name || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-2 leading-tight">
                {product.description ? product.description.substring(0, 80) + '...' : 'N/A'}
              </p>
            </div>

            {/* Main Images */}
            <div className="bg-white p-3 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-600 font-semibold uppercase mb-2">Ảnh chung</p>
              <div className="flex gap-2 flex-wrap">
                {mainImages.slice(0, 4).map(img => (
                  <div key={img.id} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                  </div>
                ))}
                {mainImages.length === 0 && (
                  <span className="text-xs text-gray-400 italic">Không có</span>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Variants Table */}
          <div className="bg-white p-3 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-600 font-semibold uppercase">
                Biến thể ({product.variants?.length || 0})
              </p>
              {onEditVariant && (
                <button
                  onClick={() => onEditVariant(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                >
                  <Layers size={14} />
                  Thêm biến thể
                </button>
              )}
            </div>
            
            {product.variants && product.variants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-700">Size</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-700">Màu</th>
                      <th className="px-2 py-1.5 text-left font-semibold text-gray-700">SKU</th>
                      <th className="px-2 py-1.5 text-right font-semibold text-gray-700">Giá</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700">Tồn</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700">Ảnh</th>
                      <th className="px-2 py-1.5 text-center font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {product.variants.map((variant) => {
                      const variantImages = product.images?.filter(img => img.variantId === variant.id) || [];
                      console.log(`🔍 Variant ${variant.id}:`, {
                        variantId: variant.id,
                        productImages: product.images,
                        filteredImages: variantImages
                      });
                      // Gắn images vào variant để dùng khi edit
                      const variantWithImages = { ...variant, images: variantImages };
                      
                      return (
                        <tr key={variant.id} className="hover:bg-gray-50">
                          <td className="px-2 py-2">
                            <span className="font-medium text-gray-900">{variant.size || '—'}</span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="text-gray-700">{variant.color || '—'}</span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="text-gray-500 text-xs">{variant.sku || '—'}</span>
                          </td>
                          <td className="px-2 py-2 text-right">
                            <span className="font-bold text-emerald-600">{formatPrice(variant.price)}</span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              variant.stock > 0 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {variant.stock}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            {variantImages.length > 0 ? (
                              <div className="flex justify-center gap-0.5">
                                {variantImages.slice(0, 2).map(img => (
                                  <div key={img.id} className="w-8 h-8 rounded border border-violet-200 overflow-hidden">
                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                                {variantImages.length > 2 && (
                                  <div className="w-8 h-8 rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-600 font-medium">
                                    +{variantImages.length - 2}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-2 py-2">
                            <div className="flex items-center justify-center gap-1">
                              {onEditVariant && (
                                <button
                                  onClick={() => onEditVariant(variantWithImages)}
                                  className="text-[#1890ff] hover:text-[#40a9ff] hover:bg-blue-50 p-1 rounded transition-colors"
                                  title="Sửa"
                                >
                                  <Edit2 size={13} />
                                </button>
                              )}
                              {onDeleteVariant && (
                                <button
                                  onClick={() => onDeleteVariant(variant)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                                  title="Xóa"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                <Layers size={32} className="mx-auto mb-2 text-gray-300" />
                <p>Chưa có biến thể nào</p>
                <p className="text-xs mt-1">Click "Thêm biến thể" để bắt đầu</p>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

export default ProductDetails;