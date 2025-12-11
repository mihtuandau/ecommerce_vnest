const SingleVariantForm = ({ variant, product, handleVariantChange, selectedImages, handleImageSelect, editingVariant }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Kích Thước
        </label>
        <input
          type="text"
          value={variant.size}
          onChange={(e) => handleVariantChange('size', e.target.value)}
          placeholder="S, M, L, XL..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Màu Sắc
        </label>
        <input
          type="text"
          value={variant.color}
          onChange={(e) => handleVariantChange('color', e.target.value)}
          placeholder="Đỏ, Xanh, Đen..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giá (₫)
        </label>
        <input
          type="number"
          value={variant.price}
          onChange={(e) => handleVariantChange('price', e.target.value)}
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
          onChange={(e) => handleVariantChange('stock', e.target.value)}
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
          onChange={(e) => handleVariantChange('sku', e.target.value)}
          placeholder="VD: PRD-S-RED-001"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
      </div>

      {/* Image Upload - Only show when editing existing variant */}
      {editingVariant?.id && (
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh Variant
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-900 hover:file:bg-gray-100"
          />
          {selectedImages.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Đã chọn {selectedImages.length} ảnh
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleVariantForm;

