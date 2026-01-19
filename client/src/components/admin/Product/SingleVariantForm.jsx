const SingleVariantForm = ({ 
  variant, 
  product, 
  onChange, 
  onImageSelect,
  editingVariant,
  replaceImages,
  setReplaceImages,
  onDeleteImage,
  deletingImageId,
  selectedImages
}) => {
  
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kích Thước <span className="text-gray-400 text-xs">(Tùy chọn)</span>
        </label>
        <input
          type="text"
          value={variant.size}
          onChange={(e) => onChange('size', e.target.value)}
          placeholder="S, M, L, XL..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Màu Sắc <span className="text-gray-400 text-xs">(Tùy chọn)</span>
        </label>
        <input
          type="text"
          value={variant.color}
          onChange={(e) => onChange('color', e.target.value)}
          placeholder="Đỏ, Xanh, Đen..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá (₫) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          value={variant.price}
          onChange={(e) => onChange('price', e.target.value)}
          placeholder={product?.basePrice || '0'}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tồn Kho
        </label>
        <input
          type="number"
          value={variant.stock}
          onChange={(e) => onChange('stock', e.target.value)}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* SKU */}
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SKU (Mã SP)
        </label>
        <input
          type="text"
          value={variant.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          placeholder="VD: PRD-S-RED-001"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Image Upload - Only show when editing existing variant */}
      {editingVariant?.id && (
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ảnh Variant
          </label>
          
          {/* DEBUG: Hiển thị dữ liệu variant */}
          {console.log('🔍 Editing Variant:', editingVariant)}
          {console.log('📸 Variant Images:', editingVariant.images)}
          
          {/* Hiển thị ảnh hiện tại */}
          {editingVariant.images && editingVariant.images.length > 0 ? (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2 font-medium">
                Ảnh hiện tại ({editingVariant.images.length} ảnh):
              </p>
              <div className="flex flex-wrap gap-2">
                {editingVariant.images.map((img, idx) => {
                  const isDeleting = deletingImageId === img.id;
                  return (
                    <div 
                      key={idx} 
                      className={`relative group transition-all ${
                        isDeleting ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <img 
                        src={img.url} 
                        alt={`Variant ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 group-hover:border-gray-300 transition-all"
                      />
                      
                      {/* Badge ảnh chính */}
                      <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                        img.isThumbnail 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-800 bg-opacity-60 text-white'
                      }`}>
                        {img.isThumbnail ? 'Chính' : idx + 1}
                      </span>
                      
                      {/* Nút X xóa - hiện khi hover */}
                      <button
                        type="button"
                        onClick={() => onDeleteImage(img.id)}
                        disabled={isDeleting}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100 hover:bg-red-600 disabled:bg-gray-400"
                        title="Click để xóa ảnh"
                      >
                        {isDeleting ? (
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Variant này chưa có ảnh. Tải ảnh lên bên dưới.
              </p>
            </div>
          )}
          
          {/* Upload ảnh mới */}
          <div>
            {/* Checkbox thay thế ảnh */}
            {editingVariant.images && editingVariant.images.length > 0 && (
              <div className="mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceImages}
                    onChange={(e) => setReplaceImages(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    Thay thế ảnh cũ (xóa tất cả ảnh hiện tại)
                  </span>
                </label>
              </div>
            )}
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onImageSelect}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-900 hover:file:bg-blue-100"
            />
            {selectedImages.length > 0 && (
              <p className="text-xs text-blue-600 mt-1 font-medium">
                ✓ Đã chọn {selectedImages.length} ảnh mới 
                {replaceImages ? ' (sẽ thay thế ảnh cũ)' : ' (sẽ thêm vào ảnh hiện tại)'}
              </p>
            )}
            {!selectedImages.length && (
              <p className="text-xs text-gray-500 mt-1">
                {replaceImages ? 'Chọn ảnh mới để thay thế' : 'Chọn ảnh để thêm vào hoặc bỏ trống để giữ nguyên'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleVariantForm;

