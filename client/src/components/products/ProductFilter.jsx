import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ProductFilter = ({ 
  categories = [], 
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 10000000 },
  onFilterChange,
  currentFilters = {}
}) => {
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || '',
    brandId: currentFilters.brandId || '',
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || 'newest',
    inStock: currentFilters.inStock || false,
  });

  // Update filters when currentFilters change
  useEffect(() => {
    setFilters({
      categoryId: currentFilters.categoryId || '',
      brandId: currentFilters.brandId || '',
      minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
      maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
      sortBy: currentFilters.sortBy || 'newest',
      inStock: currentFilters.inStock || false,
    });
  }, [currentFilters, priceRange]);

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Auto-apply for sort and category/brand (immediate feedback)
    if (name === 'sortBy' || name === 'categoryId' || name === 'brandId') {
      onFilterChange(newFilters);
    }
  };

  const handlePriceChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      brandId: '',
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      sortBy: 'newest',
      inStock: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'name-asc', label: 'Tên: A-Z' },
    { value: 'name-desc', label: 'Tên: Z-A' },
    { value: 'sold', label: 'Bán chạy' },
  ];

  return (
    <div className="space-y-4">
      {/* Sort and Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Danh mục
          </label>
          <select
            value={filters.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Tất cả danh mục</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thương hiệu
          </label>
          <select
            value={filters.brandId}
            onChange={(e) => handleChange('brandId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands?.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Khoảng giá
          </label>
          <span className="text-sm text-gray-600">
            {filters.minPrice.toLocaleString('vi-VN')}đ - {filters.maxPrice.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <input
              type="number"
              placeholder="Từ"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', parseInt(e.target.value) || priceRange.minPrice)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={priceRange.minPrice}
              max={filters.maxPrice}
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="Đến"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', parseInt(e.target.value) || priceRange.maxPrice)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              min={filters.minPrice}
              max={priceRange.maxPrice}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={applyPriceFilter}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaSearch size={14} />
            Áp dụng
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaTimes size={14} />
            Xóa lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
