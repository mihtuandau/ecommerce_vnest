import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Drawer, Badge, Spin, Empty, Select } from 'antd';
import { Pagination as AntdPagination } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import ActiveFilters from '../../../components/products/ActiveFilters';
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
    const search = searchParams.get('search');
    if (search) params.set('search', search);
    setSearchParams(params);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb items={[
            { label: 'Sản Phẩm', path: '/products' }
            
          ]} />

          <PageTitle 
            subtitle="Bộ sưu tập"
            title="TẤT CẢ SẢN PHẨM"
          />

          <button 
            onClick={() => setShowFilter(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 mb-4 bg-white border border-gray-300 hover:border-[#1a1a1a] w-full justify-center"
          >
            <FilterOutlined />
            <span>Lọc sản phẩm</span>
          </button>

          <Drawer
            title="Bộ lọc"
            placement="right"
            onClose={() => setShowFilter(false)}
            open={showFilter}
            width={320}
          >
            <ProductFilter
              categories={categories}
              brands={brands}
              priceRange={priceRange}
              currentFilters={getFiltersFromURL()}
              onFilterChange={(filters) => {
                handleFilterChange(filters);
                setShowFilter(false);
              }}
              layout="vertical"
            />
          </Drawer>

          <div className="hidden lg:block mb-6">
            <div className=" py-4 p-3">
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

          <ActiveFilters
            filters={getFiltersFromURL()}
            categories={categories}
            priceRange={priceRange}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          <div className="w-full">
            {loading ? (
              <div className="flex justify-center items-center min-h-[600px]">
                <Spin size="large" tip="Đang tải sản phẩm..." />
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center min-h-[600px]">
                <Empty 
                  description="Không tìm thấy sản phẩm nào"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <>
                <ProductGrid products={products} loading={loading} />
                
                {products.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <AntdPagination
                      current={pagination.page}
                      pageSize={pagination.limit}
                      total={pagination.total}
                      onChange={(page) => handlePageChange(page)}
                      showSizeChanger={false}
                      showTotal={(total, range) => `Hiển thị ${range[0]}-${range[1]} / ${total} sản phẩm`}
                      align="end"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
