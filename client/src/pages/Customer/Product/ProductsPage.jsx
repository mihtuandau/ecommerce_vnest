import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTh, FaThLarge, FaList } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import Pagination from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { notify } from '../../../utils/notification';


const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [viewMode, setViewMode] = useState('grid-3'); // grid-3, grid-2, list
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000000 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Get filters from URL
  const getFiltersFromURL = () => ({
    categoryId: searchParams.get('category') || '',
    brandId: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    minRating: searchParams.get('rating') || '',
    stockStatus: searchParams.get('stock') || '',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load categories, brands, and price range
  useEffect(() => {
    const loadFilters = async () => {
      try {
        console.log('Loading filters...');
        const categoriesRes = await categoryService.getAll();
        console.log('Categories API response:', categoriesRes);
        console.log('Categories type:', typeof categoriesRes);
        console.log('Categories is array?', Array.isArray(categoriesRes));
        
        const priceRangeRes = await productService.getPriceRange();
        console.log('Price range API response:', priceRangeRes);
        
        const priceRangeData = priceRangeRes || { minPrice: 0, maxPrice: 10000000 };
        console.log('Price range data:', priceRangeData);
        
        setCategories(categoriesRes || []);
        setPriceRange(priceRangeData);
        console.log('Categories set to state:', categoriesRes);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  // Debug priceRange state
  useEffect(() => {
    console.log('PriceRange state updated:', priceRange);
  }, [priceRange]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = getFiltersFromURL();
      
      // Build API params - only include values that should filter
      const apiParams = {
        page: filters.page,
        limit: pagination.limit,
      };
      
      if (filters.search) apiParams.search = filters.search;
      if (filters.categoryId) apiParams.categoryId = parseInt(filters.categoryId);
      if (filters.minPrice) apiParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) apiParams.maxPrice = parseFloat(filters.maxPrice);
      if (filters.sortBy) apiParams.sortBy = filters.sortBy;
      if (filters.minRating) apiParams.minRating = parseFloat(filters.minRating);
      if (filters.stockStatus === 'inStock') apiParams.inStock = true;
      if (filters.stockStatus === 'outOfStock') apiParams.outOfStock = true;
      
      console.log('Loading products with params:', apiParams);
      const response = await productService.getAll(apiParams);
      console.log('Products API response:', response);

      // Response is already unwrapped: {data: [...], page, limit, total, totalPages}
      const productsData = response.data || [];

      console.log('Products array:', productsData);
      console.log('Products count:', productsData.length);

      setProducts(productsData);
      setPagination({
        ...pagination,
        page: response.page || 1,
        total: response.total || 0,
        totalPages: response.totalPages || 1,
      });
    } catch (error) {notify.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    console.log('ProductsPage handleFilterChange:', filters);
    const params = new URLSearchParams();
    
    // Convert string IDs to numbers and validate
    if (filters.categoryId) {
      const categoryId = parseInt(filters.categoryId);
      if (!isNaN(categoryId)) params.set('category', categoryId);
    }
    // Always add price params to trigger filtering
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) params.set('minPrice', minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) params.set('maxPrice', maxPrice);
    }
    if (filters.sortBy) {
      params.set('sort', filters.sortBy);
    }
    if (filters.minRating) params.set('rating', filters.minRating);
    if (filters.stockStatus) params.set('stock', filters.stockStatus);
    if (filters.search) params.set('search', filters.search);
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Sản phẩm' }
          ]} />

          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tất cả sản phẩm
              </h1>
              <p className="text-gray-600">
                Tìm thấy {pagination.total} sản phẩm
              </p>
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid-3')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid-3'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
                title="3 cột"
              >
                <FaTh size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid-2')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid-2'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
                title="2 cột"
              >
                <FaThLarge size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
                title="Danh sách"
              >
                <FaList size={18} />
              </button>
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters - Left Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Mobile Toggle Button */}
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gray-900 text-white font-medium"
                >
                  <FaFilter size={16} />
                  <span>Bộ lọc</span>
                </button>

                {/* Filter Panel */}
                <div className={`bg-white shadow-sm p-6 ${
                  showFilter ? 'block' : 'hidden lg:block'
                }`}>
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaFilter size={16} />
                    Bộ lọc sản phẩm
                  </h2>
                  <ProductFilter
                    categories={categories}
                    brands={brands}
                    priceRange={priceRange}
                    currentFilters={getFiltersFromURL()}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </div>

            {/* Products Content - Right Side */}
            <div className="lg:col-span-3">
              <div className="min-h-[1400px]">
                <ProductGrid products={products} loading={loading} viewMode={viewMode} />
              </div>

              {/* Pagination */}
              {!loading && products.length > 0 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
