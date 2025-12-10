import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import Pagination from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
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
    inStock: searchParams.get('inStock') === 'true',
    search: searchParams.get('search') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  // Load categories, brands, and price range
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesRes, brandsRes, priceRangeRes] = await Promise.all([
          categoryService.getAll(),
          productService.getBrands(),
          productService.getPriceRange(),
        ]);
        setCategories(categoriesRes || []);
        setBrands(brandsRes?.data || []);
        setPriceRange(priceRangeRes?.data || { minPrice: 0, maxPrice: 10000000 });
      } catch (error) {}
    };
    loadFilters();
  }, []);

  // Load products
  useEffect(() => {
    loadProducts();
  }, [searchParams]);

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
    } catch (error) {toast.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    
    // Convert string IDs to numbers and validate
    if (filters.categoryId) {
      const categoryId = parseInt(filters.categoryId);
      if (!isNaN(categoryId)) params.set('category', categoryId);
    }
    if (filters.brandId) {
      const brandId = parseInt(filters.brandId);
      if (!isNaN(brandId)) params.set('brand', brandId);
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
    if (filters.inStock) params.set('inStock', 'true');
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
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-gray-900 transition-colors">Trang chủ</a>
            <span>›</span>
            <span className="text-gray-900 font-medium">Sản phẩm</span>
          </nav>

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
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                showFilter 
                  ? 'bg-gray-900 text-white border-gray-900' 
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
              }`}
            >
              <FaFilter size={16} />
              <span className="font-medium">Bộ lọc</span>
            </button>
          </div>

          {/* Filter Section - Collapsible */}
          {showFilter && (
            <div className="mb-6 animate-fadeIn">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <ProductFilter
                  categories={categories}
                  brands={brands}
                  priceRange={priceRange}
                  currentFilters={getFiltersFromURL()}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <ProductGrid products={products} loading={loading} />

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
    </Layout>
  );
};

export default ProductsPage;
