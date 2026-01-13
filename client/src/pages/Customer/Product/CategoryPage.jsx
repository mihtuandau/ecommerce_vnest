import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
import ProductGrid from '../../../components/products/ProductGrid';
import ProductFilter from '../../../components/products/ProductFilter';
import ActiveFilters from '../../../components/products/ActiveFilters';
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
  const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 10000000 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const getFiltersFromURL = () => ({
    brandId: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sort') || 'newest',
    minRating: searchParams.get('rating') || '',
    stockStatus: searchParams.get('stock') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const categories = await categoryService.getAll();
        const found = categories.find(cat => cat.id === parseInt(id));
        setCategory(found);
      } catch (error) {
        notify.error('Không tìm thấy danh mục');
      }
    };
    loadCategory();
  }, [id]);
  useEffect(() => {
    const loadBrandsAndPrice = async () => {
      try {
        const [brandsRes, priceRangeRes] = await Promise.all([
          productService.getBrands(),
          productService.getPriceRange(),
        ]);
        setBrands(brandsRes?.data || []);
        setPriceRange(priceRangeRes?.data || { minPrice: 0, maxPrice: 10000000 });
      } catch (error) {
      }
    };
    loadBrandsAndPrice();
  }, []);

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
      const apiParams = {
        page: filters.page,
        limit: pagination.limit,
        categoryId: category.id,
      };
      
      if (filters.brandId) apiParams.brandId = parseInt(filters.brandId);
      if (filters.minPrice) apiParams.minPrice = parseFloat(filters.minPrice);
      if (filters.maxPrice) apiParams.maxPrice = parseFloat(filters.maxPrice);
      if (filters.sortBy) apiParams.sortBy = filters.sortBy;
      if (filters.minRating) apiParams.minRating = parseFloat(filters.minRating);
      if (filters.stockStatus === 'inStock') apiParams.inStock = true;
      if (filters.stockStatus === 'outOfStock') apiParams.outOfStock = true;
      
      const response = await productService.getAll(apiParams);

      const productsData = response.data?.data || response.data || [];
      const pageInfo = response.data;

      setProducts(productsData);
      setPagination({
        ...pagination,
        page: pageInfo?.page || 1,
        total: pageInfo?.total || 0,
        totalPages: pageInfo?.totalPages || 1,
      });
    } catch (error) {
      notify.error('Lỗi tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    const params = new URLSearchParams();
    
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
    if (filters.minRating) params.set('rating', filters.minRating);
    if (filters.stockStatus) params.set('stock', filters.stockStatus);
    
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
    
    if (filterKey === 'brandId') {
      params.delete('brand');
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
    setSearchParams(new URLSearchParams());
  };

  if (!category && !loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy danh mục
          </h1>
          <a href="/products" className="text-[#00a85a] hover:underline">
            Xem tất cả sản phẩm
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb items={[
            { label: 'Sản Phẩm', path: '/products' },
            { label: category?.name || 'Danh mục' }
          ]} />

          {category && (
            <PageTitle
              subtitle="Danh mục"
              title={category.name.toUpperCase()}
              description={category.description}
              className="mt-6"
            />
          )}

          <div className="sticky top-16 z-10 mb-6">
            <div className="p-3">
              <ProductFilter
                brands={brands}
                priceRange={priceRange}
                currentFilters={getFiltersFromURL()}
                onFilterChange={handleFilterChange}
                hideCategories={true}
                layout="horizontal"
              />
            </div>
          </div>

          <ActiveFilters
            filters={getFiltersFromURL()}
            categories={[]}
            brands={brands}
            priceRange={priceRange}
            onRemoveFilter={handleRemoveFilter}
            onClearAll={handleClearAllFilters}
          />

          <div className="w-full">
            <div className="min-h-[600px]">
              <ProductGrid products={products} loading={loading} />
            </div>

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

export default CategoryPage;