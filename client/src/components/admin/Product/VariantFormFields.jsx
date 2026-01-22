const VariantFormFields = ({ formData, onChange }) => {
  return (
    <>
      {/* Size & Color */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(e) => onChange('size', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="S, M, L, XL..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Màu sắc <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Đen, Trắng, Xanh..."
            required
          />
        </div>
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SKU
        </label>
        <input
          type="text"
          value={formData.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Mã SKU tự động hoặc tùy chỉnh"
        />
      </div>

      {/* Price & Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giá <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={formData.price}
              onChange={(e) => onChange('price', Number(e.target.value))}
              className="w-full px-4 py-2.5 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              required
            />
            <span className="absolute right-4 top-3 text-gray-500">VNĐ</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tồn kho <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.stock}
            onChange={(e) => onChange('stock', Number(e.target.value))}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
            min="0"
            required
          />
        </div>
      </div>
    </>
  );
};

export default VariantFormFields;
