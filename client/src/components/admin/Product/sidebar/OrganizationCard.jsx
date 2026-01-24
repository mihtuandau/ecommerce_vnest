const OrganizationCard = ({ formData, product, onFormChange, categories, brands, loadingCategories, loadingBrands, readOnly }) => {
  // Use formData if provided (edit mode), otherwise use product (view mode)
  const data = formData || product || {};
  
  const selectCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-600';
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg mb-5 text-gray-900">Tổ chức</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select 
            value={data.categoryId || ''}
            onChange={(e) => !readOnly && onFormChange && onFormChange('categoryId', e.target.value)}
            disabled={loadingCategories || readOnly}
            className={selectCls}
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
            value={data.brandId || ''}
            onChange={(e) => !readOnly && onFormChange && onFormChange('brandId', e.target.value)}
            disabled={loadingBrands || readOnly}
            className={selectCls}
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
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 cursor-not-allowed text-gray-600"
            disabled
          />
          <p className="mt-1.5 text-xs text-gray-500">Tính năng sắp có</p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationCard;