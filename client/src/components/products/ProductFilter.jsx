import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const ProductFilter = ({ 
  categories = [], 
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 100000000 },
  onFilterChange,
  currentFilters = {},
  hideCategories = false
}) => {
  // Debug: Log categories
  useEffect(() => {
    console.log('ProductFilter received categories:', categories);
    console.log('Categories length:', categories?.length);
    console.log('Categories is array?', Array.isArray(categories));
  }, [categories]);

  // Debug: Log priceRange
  useEffect(() => {
    console.log('ProductFilter received priceRange:', priceRange);
  }, [priceRange]);

  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || '',
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || 'newest',
    minRating: currentFilters.minRating || '',
    stockStatus: currentFilters.stockStatus || '',
  });

  // Update filters when currentFilters change
  useEffect(() => {
    setFilters({
      categoryId: currentFilters.categoryId || '',
      minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
      maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
      sortBy: currentFilters.sortBy || 'newest',
      minRating: currentFilters.minRating || '',
      stockStatus: currentFilters.stockStatus || '',
    });
  }, [currentFilters, priceRange]);

  const handleChange = (name, value) => {
    console.log('Filter handleChange:', name, '=', value);
    const newFilters = { ...filters, [name]: value };
    console.log('New filters:', newFilters);
    setFilters(newFilters);
    // Auto-apply for sort, category, rating, and stock (immediate feedback)
    if (name === 'sortBy' || name === 'categoryId' || name === 'minRating' || name === 'stockStatus') {
      console.log('Auto-applying filter:', name, '=', value);
      console.log('Filters to apply:', newFilters);
      onFilterChange(newFilters);
    }
  };

  const handlePriceChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    // Chỉ truyền params khi khác với giá trị mặc định
    const filtersToApply = { ...filters };
    
    // Nếu maxPrice bằng priceRange.maxPrice thì không truyền (lấy tất cả)
    if (filters.maxPrice >= priceRange.maxPrice) {
      filtersToApply.maxPrice = '';
    }
    // Nếu minPrice bằng 0 thì không truyền
    if (filters.minPrice <= priceRange.minPrice) {
      filtersToApply.minPrice = '';
    }
    
    onFilterChange(filtersToApply);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      sortBy: 'newest',
      minRating: '',
      stockStatus: '',
    };
    setFilters(defaultFilters);
    // Không truyền minPrice/maxPrice khi reset (lấy tất cả)
    onFilterChange({
      ...defaultFilters,
      minPrice: '',
      maxPrice: '',
    });
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

      {/* Category - Radio buttons */}
      {!hideCategories && (
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Danh mục {categories && `(${categories.length})`}
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="category"
              value=""
              checked={filters.categoryId === ''}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Tất cả danh mục</span>
          </label>
          {categories && categories.length > 0 ? (
            categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.categoryId == cat.id}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic p-2">Đang tải danh mục...</p>
          )}
        </div>
      </div>
      )}

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

      {/* Rating Filter */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Đánh giá
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value=""
              checked={filters.minRating === ''}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value="5"
              checked={filters.minRating === '5'}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span className="text-yellow-500">★★★★★</span>
              <span>(5 sao)</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value="4"
              checked={filters.minRating === '4'}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span className="text-yellow-500">★★★★</span>
              <span>trở lên</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value="3"
              checked={filters.minRating === '3'}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span className="text-yellow-500">★★★</span>
              <span>trở lên</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value="2"
              checked={filters.minRating === '2'}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span className="text-yellow-500">★★</span>
              <span>trở lên</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="rating"
              value="1"
              checked={filters.minRating === '1'}
              onChange={(e) => handleChange('minRating', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span>trở lên</span>
            </span>
          </label>
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Tình trạng kho
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="stock"
              value=""
              checked={filters.stockStatus === ''}
              onChange={(e) => handleChange('stockStatus', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="stock"
              value="inStock"
              checked={filters.stockStatus === 'inStock'}
              onChange={(e) => handleChange('stockStatus', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span>Còn hàng</span>
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
            <input
              type="radio"
              name="stock"
              value="outOfStock"
              checked={filters.stockStatus === 'outOfStock'}
              onChange={(e) => handleChange('stockStatus', e.target.value)}
              className="w-4 h-4 text-gray-900 focus:ring-gray-900 cursor-pointer"
            />
            <span className="text-sm text-gray-700 flex items-center gap-1">
              <span>Hết hàng</span>
            </span>
          </label>
        </div>
      </div>

      {/* Price Range - Slider */}
      <div className="border-t pt-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Khoảng giá
        </label>
        <div className="text-sm text-gray-900 font-medium mb-4 flex justify-between">
          <span>{filters.minPrice.toLocaleString('vi-VN')}đ</span>
          <span>{filters.maxPrice.toLocaleString('vi-VN')}đ</span>
        </div>
        
        {/* Min Price Slider */}
        <div className="mb-4">
          <label className="text-xs text-gray-600 mb-2 block">Giá tối thiểu</label>
          <input
            type="range"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            step="10000"
            value={filters.minPrice}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value <= filters.maxPrice) {
                handlePriceChange('minPrice', value);
              }
            }}
            onMouseUp={applyPriceFilter}
            onTouchEnd={applyPriceFilter}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
        </div>

        {/* Max Price Slider */}
        <div className="mb-4">
          <label className="text-xs text-gray-600 mb-2 block">Giá tối đa</label>
          <input
            type="range"
            min={priceRange.minPrice}
            max={priceRange.maxPrice}
            step="10000"
            value={filters.maxPrice}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (value >= filters.minPrice) {
                handlePriceChange('maxPrice', value);
              }
            }}
            onMouseUp={applyPriceFilter}
            onTouchEnd={applyPriceFilter}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
        </div>
        
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
