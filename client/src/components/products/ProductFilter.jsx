import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import Accordion from '../common/Accordion';

const ProductFilter = ({ 
  categories = [], 
  brands = [],
  priceRange = { minPrice: 0, maxPrice: 100000000 },
  onFilterChange,
  currentFilters = {},
  hideCategories = false
}) => {
  const [filters, setFilters] = useState({
    categoryId: currentFilters.categoryId || '',
    brandId: currentFilters.brandId || '',
    minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
    maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
    sortBy: currentFilters.sortBy || 'newest',
    minRating: currentFilters.minRating || '',
    stockStatus: currentFilters.stockStatus || '',
  });

  useEffect(() => {
    setFilters({
      categoryId: currentFilters.categoryId || '',
      brandId: currentFilters.brandId || '',
      minPrice: parseInt(currentFilters.minPrice) || priceRange.minPrice,
      maxPrice: parseInt(currentFilters.maxPrice) || priceRange.maxPrice,
      sortBy: currentFilters.sortBy || 'newest',
      minRating: currentFilters.minRating || '',
      stockStatus: currentFilters.stockStatus || '',
    });
  }, [currentFilters, priceRange]);

  const handleChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    // Auto-apply for immediate feedback
    if (['sortBy', 'categoryId', 'brandId', 'minRating', 'stockStatus'].includes(name)) {
      onFilterChange(newFilters);
    }
  };

  const handlePriceChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyPriceFilter = () => {
    const filtersToApply = { ...filters };
    if (filters.maxPrice >= priceRange.maxPrice) filtersToApply.maxPrice = '';
    if (filters.minPrice <= priceRange.minPrice) filtersToApply.minPrice = '';
    onFilterChange(filtersToApply);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      brandId: '',
      minPrice: priceRange.minPrice,
      maxPrice: priceRange.maxPrice,
      sortBy: 'newest',
      minRating: '',
      stockStatus: '',
    };
    setFilters(defaultFilters);
    onFilterChange({ ...defaultFilters, minPrice: '', maxPrice: '' });
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price-asc', label: 'Giá: Thấp → Cao' },
    { value: 'price-desc', label: 'Giá: Cao → Thấp' },
    { value: 'sold', label: 'Bán chạy' },
    { value: 'name-asc', label: 'Tên: A-Z' },
  ];

  const ratingOptions = [
    { value: '', label: 'Tất cả', stars: '' },
    { value: '5', label: '5 sao', stars: '★★★★★' },
    { value: '4', label: '4 sao trở lên', stars: '★★★★' },
    { value: '3', label: '3 sao trở lên', stars: '★★★' },
  ];

  return (
    <div className="space-y-4">
      {/* Sort */}
      <Accordion title="Sắp xếp" defaultOpen={true}>
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-sm font-light bg-white"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </Accordion>

      {/* Category */}
      {!hideCategories && categories.length > 0 && (
        <Accordion title={`Danh mục (${categories.length})`} defaultOpen={true}>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
              <input
                type="radio"
                name="category"
                value=""
                checked={filters.categoryId === ''}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-4 h-4 border-gray-300 text-gray-900"
              />
              <span className="text-sm font-light text-gray-700">Tất cả</span>
            </label>
            {categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.categoryId == cat.id}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-4 h-4 border-gray-300 text-gray-900"
                />
                <span className="text-sm font-light text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </Accordion>
      )}

      {/* Brand */}
      {brands.length > 0 && (
        <Accordion title="Thương hiệu" defaultOpen={true}>
          <select
            value={filters.brandId || ''}
            onChange={(e) => handleChange('brandId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 text-sm font-light bg-white"
          >
            <option value="">Tất cả</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </Accordion>
      )}

      {/* Rating */}
      <Accordion title="Đánh giá" defaultOpen={true}>
        <div className="space-y-2">
          {ratingOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
              <input
                type="radio"
                name="rating"
                value={opt.value}
                checked={filters.minRating === opt.value}
                onChange={(e) => handleChange('minRating', e.target.value)}
                className="w-4 h-4 border-gray-300 text-gray-900"
              />
              <span className="text-sm font-light text-gray-700 flex items-center gap-2">
                {opt.stars && <span className="text-yellow-500">{opt.stars}</span>}
                <span>{opt.label}</span>
              </span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* Stock Status */}
      <Accordion title="Tình trạng" defaultOpen={true}>
        <div className="space-y-2">
          {[
            { value: '', label: 'Tất cả' },
            { value: 'inStock', label: 'Còn hàng' },
            { value: 'outOfStock', label: 'Hết hàng' },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors">
              <input
                type="radio"
                name="stock"
                value={opt.value}
                checked={filters.stockStatus === opt.value}
                onChange={(e) => handleChange('stockStatus', e.target.value)}
                className="w-4 h-4 border-gray-300 text-gray-900"
              />
              <span className="text-sm font-light text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </Accordion>

      {/* Price Range */}
      <Accordion title="Khoảng giá" defaultOpen={true}>
        <div className="text-sm font-medium mb-4 flex justify-between text-gray-900">
          <span>{filters.minPrice.toLocaleString('vi-VN')}₫</span>
          <span>{filters.maxPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-light text-gray-600 mb-2 block">Tối thiểu</label>
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="10000"
              value={filters.minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= filters.maxPrice) handlePriceChange('minPrice', value);
              }}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
              className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-gray-900"
            />
          </div>

          <div>
            <label className="text-xs font-light text-gray-600 mb-2 block">Tối đa</label>
            <input
              type="range"
              min={priceRange.minPrice}
              max={priceRange.maxPrice}
              step="10000"
              value={filters.maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= filters.minPrice) handlePriceChange('maxPrice', value);
              }}
              onMouseUp={applyPriceFilter}
              onTouchEnd={applyPriceFilter}
              className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-gray-900"
            />
          </div>
        </div>
        
        <button
          onClick={resetFilters}
          className="w-full mt-4 px-4 py-2 border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-normal transition-colors flex items-center justify-center gap-2"
        >
          <FaTimes size={12} />
          Xóa bộ lọc
        </button>
      </Accordion>
    </div>
  );
};
export default ProductFilter;