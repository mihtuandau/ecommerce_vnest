import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import ActiveFilters from '../../../components/products/ActiveFilters';
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
        const categoriesRes = await categoryService.getAll();
        
        const priceRangeRes = await productService.getPriceRange();
        
        const priceRangeData = priceRangeRes || { minPrice: 0, maxPrice: 10000000 };
        
        setCategories(categoriesRes || []);
        setPriceRange(priceRangeData);
      } catch (error) {
      }
    };
    loadFilters();
  }, []);
  useEffect(() => {
    loadProducts();
  }, [searchParams]);

  useEffect(() => {
    console.log('PriceRange state updated:', priceRange);
  }, [priceRange]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = getFiltersFromURL();

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
      
      const response = await productService.getAll(apiParams);
      const productsData = response.data || [];


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
    const params = new URLSearchParams();

    if (filters.categoryId) {
      const categoryId = parseInt(filters.categoryId);
      if (!isNaN(categoryId)) params.set('category', categoryId);
    }
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

  const handleRemoveFilter = (filterKey) => {
    const params = new URLSearchParams(searchParams);
    
    if (filterKey === 'categoryId') {
      params.delete('category');
    } else if (filterKey === 'price') {
      params.delete('minPrice');
      params.delete('maxPrice');
    } else if (filterKey === 'minRating') {
      params.delete('rating');
    } else if (filterKey === 'stockStatus') {
      params.delete('stock');
    } else if (filterKey === 'sortBy') {
      params.delete('sort');
    }
    
    setSearchParams(params);
  };

  const handleClearAllFilters = () => {
    const params = new URLSearchParams();
    // Keep search query if exists
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Breadcrumb items={[
              { label: 'Sản phẩm' }
            ]} />
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Tất cả sản phẩm
            </h1>
            <p className="text-sm text-gray-600">
              Tìm thấy {pagination.total} sản phẩm
            </p>
          </div>

          {/* Filter Bar - Sticky */}
          <div className="sticky top-16 z-10 mb-6">
            <div className="bg-gray-50 rounded-lg">
              <ProductFilter
                categories={categories}
                brands={brands}
                priceRange={priceRange}
                currentFilters={getFiltersFromURL()}
                onFilterChange={handleFilterChange}
                layout="horizontal"
              />
            </div>
          </div>

          {/* Active Filters */}
          <ActiveFilters
            filters={getFiltersFromURL()}
            categories={categories}
            priceRange={priceRange}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          {/* Products Grid */}
          <div className="w-full">
            <div className="min-h-[600px]">
              <ProductGrid products={products} loading={loading} />
            </div>

            {/* Pagination */}
            {!loading && products.length > 0 && (
              <div className="mt-8 flex justify-center">
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
    </Layout>
  );
};

export default ProductsPage;
