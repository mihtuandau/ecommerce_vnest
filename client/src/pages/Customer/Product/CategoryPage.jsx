import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { FaFilter, FaTh, FaThLarge, FaList } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import Pagination from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import { notify } from '../../../utils/notification';

const CategoryPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
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
    brandId: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    inStock: searchParams.get('inStock') === 'true',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load category info
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categories = await categoryService.getAll();
        const found = categories.find(cat => cat.id === parseInt(id));
        setCategory(found);
      } catch (error) {notify.error('Không tìm thấy danh mục');
      }
    };
    loadCategory();
  }, [id]);

  // Load brands and price range
  useEffect(() => {
    const loadBrandsAndPrice = async () => {
      try {
        const [brandsRes, priceRangeRes] = await Promise.all([
          productService.getBrands(),
          productService.getPriceRange(),
        ]);
        setBrands(brandsRes?.data || []);
        setPriceRange(priceRangeRes?.data || { minPrice: 0, maxPrice: 10000000 });
      } catch (error) {}
    };
    loadBrandsAndPrice();
  }, []);

  // Load products
  useEffect(() => {
    if (category) {
      loadProducts();
    }
  }, [category, searchParams]);

  const loadProducts = async () => {
    if (!category) return;

    try {
      setLoading(true);
      const filters = getFiltersFromURL();
      
      // Build API params - only include values that should filter
      const apiParams = {
        page: filters.page,
        limit: pagination.limit,
        categoryId: category.id,
      };
      
      if (filters.brandId) apiParams.brandId = parseInt(filters.brandId);
      if (filters.minPrice) apiParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) apiParams.maxPrice = parseFloat(filters.maxPrice);
      if (filters.sortBy) apiParams.sortBy = filters.sortBy;
      if (filters.inStock) apiParams.inStock = filters.inStock;
      
      const response = await productService.getAll(apiParams);

      // Fix: axios response có cấu trúc { data: { data: [], page, total, totalPages } }
      const productsData = response.data?.data || response.data || [];
      const pageInfo = response.data;

      setProducts(productsData);
      setPagination({
        ...pagination,
        page: pageInfo?.page || 1,
        total: pageInfo?.total || 0,
        totalPages: pageInfo?.totalPages || 1,
      });
    } catch (error) {notify.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    
    // Convert string IDs to numbers and validate
    if (filters.brandId) {
      const brandId = parseInt(filters.brandId);
      if (!isNaN(brandId)) params.set('brand', brandId);
    }
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      const minPrice = parseFloat(filters.minPrice);
      if (!isNaN(minPrice)) params.set('minPrice', minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      const maxPrice = parseFloat(filters.maxPrice);
      if (!isNaN(maxPrice)) params.set('maxPrice', maxPrice);
    }
    if (filters.sortBy) params.set('sort', filters.sortBy);
    if (filters.inStock) params.set('inStock', 'true');
    
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!category && !loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy danh mục
          </h1>
          <a href="/products" className="text-blue-600 hover:underline">
            Xem tất cả sản phẩm
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-10">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Sản phẩm', path: '/products' },
            { label: category?.name || 'Danh mục' }
          ]} />

          {/* Category Header */}
          {category && (
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-gray-600 mb-2">{category.description}</p>
                )}
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
          )}

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
              <ProductGrid products={products} loading={loading} viewMode={viewMode} />

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

export default CategoryPage;
