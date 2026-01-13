import { FaTimes } from 'react-icons/fa';

const ActiveFilters = ({ 
  filters, 
  categories, 
  priceRange,
  onRemoveFilter,
  onClearAll 
}) => {
  const activeFilters = [];

  if (filters.categoryId) {
    const category = categories.find(c => c.id == filters.categoryId);
    if (category) {
      activeFilters.push({
        type: 'category',
        label: `Danh mục: ${category.name}`,
        key: 'categoryId'
      });
    }
  }

  if (filters.minPrice || filters.maxPrice) {
    const min = filters.minPrice ? parseFloat(filters.minPrice) : priceRange.minPrice;
    const max = filters.maxPrice ? parseFloat(filters.maxPrice) : priceRange.maxPrice;
    
    if (min > priceRange.minPrice || max < priceRange.maxPrice) {
      activeFilters.push({
        type: 'price',
        label: `Giá sản phẩm: ${min.toLocaleString('vi-VN')}₫ - ${max.toLocaleString('vi-VN')}₫`,
        key: 'price'
      });
    }
  }

  if (filters.minRating) {
    const ratingLabels = {
      '5': '5 sao',
      '4': '4 sao trở lên',
      '3': '3 sao trở lên'
    };
    activeFilters.push({
      type: 'rating',
      label: `Đánh giá: ${ratingLabels[filters.minRating] || filters.minRating}`,
      key: 'minRating'
    });
  }

  if (filters.stockStatus) {
    const stockLabels = {
      'inStock': 'Còn hàng',
      'outOfStock': 'Hết hàng'
    };
    activeFilters.push({
      type: 'stock',
      label: `Tình trạng: ${stockLabels[filters.stockStatus]}`,
      key: 'stockStatus'
    });
  }

  if (filters.sortBy && filters.sortBy !== 'newest') {
    const sortLabels = {
      'price-asc': 'Giá: Thấp → Cao',
      'price-desc': 'Giá: Cao → Thấp',
      'sold': 'Bán chạy',
      'name-asc': 'Tên: A-Z'
    };
    activeFilters.push({
      type: 'sort',
      label: `Sắp xếp: ${sortLabels[filters.sortBy]}`,
      key: 'sortBy'
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg p-4">
      
      
      {activeFilters.map((filter, index) => (
        <button
          key={index}
          onClick={() => onRemoveFilter(filter.key)}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-all duration-200 border border-gray-300"
        >
          <span>{filter.label}</span>
          <FaTimes size={10} className="text-gray-500 hover:text-gray-700" />
        </button>
      ))}

      <button
        onClick={onClearAll}
        className="ml-auto px-4 py-1.5 text-sm font-medium text-red-600 hover:text-red-900 hover:underline transition-colors"
      >
        Xóa hết
      </button>
    </div>
  );
};

export default ActiveFilters;
