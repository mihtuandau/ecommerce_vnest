const ImagesTab = ({ product }) => {
  const mainImages = product.images?.filter(img => !img.variantId) || [];
  const variantImages = product.variants?.flatMap(v => v.images || []) || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Ảnh sản phẩm</h2>
        <p className="text-sm text-gray-500 mt-1.5">Quản lý hình ảnh hiển thị cho sản phẩm</p>
      </div>
      
      {/* Ảnh chung */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Ảnh chung <span className="text-gray-400">({mainImages.length})</span>
        </h3>
        {mainImages.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {mainImages.map((img, idx) => (
              <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <div className="absolute top-2 left-2 px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded shadow-md">
                    Đại diện
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">Chưa có ảnh chung</p>
          </div>
        )}
      </div>

      {/* Ảnh theo biến thể */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Ảnh theo biến thể <span className="text-gray-400">({variantImages.length})</span>
        </h3>
        {product.variants && product.variants.length > 0 ? (
          <div className="space-y-4">
            {product.variants.map(variant => (
              <div key={variant.id} className="p-5 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {variant.size} - {variant.color}
                  </h4>
                  <span className="text-xs font-medium text-gray-600 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                    {variant.images?.length || 0} ảnh
                  </span>
                </div>
                {variant.images && variant.images.length > 0 ? (
                  <div className="grid grid-cols-4 gap-3">
                    {variant.images.map(img => (
                      <div key={img.id} className="aspect-square rounded-lg overflow-hidden border-2 border-gray-300 hover:border-blue-500 hover:shadow-md transition-all">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">Chưa có ảnh</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-sm">Chưa có biến thể</p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm text-blue-900 font-medium">
          💡 <span className="font-semibold">Mẹo:</span> Ảnh của từng biến thể được quản lý trong tab "Biến thể"
        </p>
      </div>
    </div>
  );
};

export default ImagesTab;
