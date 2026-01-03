import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spin, Empty, Select } from 'antd';
import Layout from '../../../components/layouts/Layout';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
import ProductGrid from '../../../components/products/ProductGrid';
import Pagination from '../../../components/common/Pagination';
import { productService } from '../../../services/productService';

const BestSellingProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const sortBy = searchParams.get('sort') || 'sold';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Load best selling products
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAll({
          sortBy,
          page: currentPage,
          limit: 12,
        });

        if (response?.data) {
          setProducts(response.data);
          setPagination({
            page: response.page || currentPage,
            limit: response.limit || 12,
            total: response.total || 0,
            totalPages: response.totalPages || 1,
          });
        } else {
          setProducts(response || []);
        }
      } catch (error) {
        console.error('Error loading best selling products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [sortBy, currentPage]);

  const handleSortChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', value);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const breadcrumbItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm bán chạy' },
  ];

  const sortOptions = [
    { value: 'sold', label: 'Bán chạy nhất' },
    { value: 'newest', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá tăng dần' },
    { value: 'price_desc', label: 'Giá giảm dần' },
    { value: 'rating', label: 'Đánh giá cao' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <Breadcrumb items={breadcrumbItems} />

          {/* Header */}
          <div className="mb-10">
            <PageTitle 
              subtitle="Xu hướng"
              title="SẢN PHẨM BÁN CHẠY"
              description="Những sản phẩm được khách hàng tin tưởng và mua nhiều nhất"
            />

            {/* Sort & Count */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <p className="text-sm text-gray-600">
                {loading ? '...' : `${pagination.total} sản phẩm`}
              </p>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                options={sortOptions}
                className="w-40"
                variant="borderless"
              />
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : products.length === 0 ? (
            <Empty
              description="Không tìm thấy sản phẩm nào"
              className="py-20"
            />
          ) : (
            <>
              <ProductGrid products={products} />

              {pagination.totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BestSellingProductsPage;
