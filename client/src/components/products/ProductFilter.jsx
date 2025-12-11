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
    <div className="space-y-6">
      {/* Sort By */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Sắp xếp theo
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Danh mục
        </label>
        <select
          value={filters.categoryId}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
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
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Thương hiệu
        </label>
        <select
          value={filters.brandId}
          onChange={(e) => handleChange('brandId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 text-sm"
        >
          <option value="">Tất cả thương hiệu</option>
          {brands?.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Khoảng giá
        </label>
        <div className="text-xs text-gray-600 mb-3">
          {filters.minPrice.toLocaleString('vi-VN')}đ - {filters.maxPrice.toLocaleString('vi-VN')}đ
        </div>
        
        <div className="space-y-3 mb-4">
          <input
            type="number"
            placeholder="Giá tối thiểu"
            value={filters.minPrice}
            onChange={(e) => handlePriceChange('minPrice', parseInt(e.target.value) || priceRange.minPrice)}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            min={priceRange.minPrice}
            max={filters.maxPrice}
          />
          <input
            type="number"
            placeholder="Giá tối đa"
            value={filters.maxPrice}
            onChange={(e) => handlePriceChange('maxPrice', parseInt(e.target.value) || priceRange.maxPrice)}
            className="w-full px-3 py-2 border border-gray-300 text-sm focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            min={filters.minPrice}
            max={priceRange.maxPrice}
          />
        </div>

        <button
          onClick={applyPriceFilter}
          className="w-full px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 mb-3"
        >
          <FaSearch size={14} />
          Áp dụng giá
        </button>
        
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2.5 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FaTimes size={14} />
          Xóa tất cả lọc
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
