const OrganizationCard = ({ formData, onFormChange, categories, brands, loadingCategories, loadingBrands }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
      <h3 className="font-semibold mb-4 text-gray-900">Tổ chức</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select 
            value={formData.categoryId || ''}
            onChange={(e) => onFormChange('categoryId', e.target.value)}
            disabled={loadingCategories}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Chọn danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu</label>
          <select 
            value={formData.brandId || ''}
            onChange={(e) => onFormChange('brandId', e.target.value)}
            disabled={loadingBrands}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Chọn thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            placeholder="sport, casual, new..."
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled
          />
          <p className="mt-1 text-xs text-gray-500">Tính năng sắp có</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;
