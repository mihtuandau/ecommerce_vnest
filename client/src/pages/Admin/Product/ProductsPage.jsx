import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProducts, useCategories, useBrands } from '../../../hooks/useProducts';
import { useProductActions } from '../../../hooks/useProductActions';
import { PageHeader } from '../../../components/common/PageHeader';
import { QueryListWrapper } from '../../../components/common/QueryWrapper';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    brandId: '',
    status: '', // active | inactive | draft
    minPrice: '',
    maxPrice: '',
    // Backend chỉ hỗ trợ 1 param sortBy: newest|oldest|price-asc|price-desc|name-asc|name-desc|sold|rating
    sortBy: 'newest',
    page: 1,
    limit: 10
  });

  const { data: productsData, isLoading, refetch, error } = useProducts(filters);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const [selectedProducts, setSelectedProducts] = useState([]);

  const {
    deleteModalOpen,
    productToDelete,
    deleting,
    handleDelete,
    handleBulkDelete,
    confirmDelete,
    setDeleteModalOpen,
    setProductToDelete,
  } = useProductActions({ refetch, products, selectedProducts });

  const handleSelectAll = (checked) => {
    setSelectedProducts(checked ? products.map((p) => p.id) : []);
  };

  const handleSelectProduct = (productId, checked) => {
    setSelectedProducts((prev) =>
      checked ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <PageHeader
          title="Quản lý sản phẩm"
          subtitle={`Tổng số sản phẩm: ${pagination.total ?? products.length}`}
          showRefresh
          onRefresh={refetch}
          refreshing={isLoading}
          actions={
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin-products/create')}
            >
              + Thêm sản phẩm mới
            </Button>
          }
        />

      <ProductToolbar
        search={filters.search}
        setSearch={(value) => updateFilters({ search: value, page: 1 })}
        selectedCategory={filters.categoryId}
        setSelectedCategory={(value) => updateFilters({ categoryId: value, page: 1 })}
        categories={categories}
        selectedBrand={filters.brandId}
        setSelectedBrand={(value) => updateFilters({ brandId: value, page: 1 })}
        brands={brands}
        status={filters.status}
        setStatus={(value) => updateFilters({ status: value, page: 1 })}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        setPriceRange={({ minPrice, maxPrice }) => updateFilters({ minPrice, maxPrice, page: 1 })}
        sortBy={filters.sortBy}
        setSort={({ sortBy }) => updateFilters({ sortBy, page: 1 })}
        onResetFilters={() =>
          setFilters((prev) => ({
            ...prev,
            search: '',
            categoryId: '',
            brandId: '',
            status: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
            page: 1,
          }))
        }
        selectedProducts={selectedProducts}
        onBulkDelete={handleBulkDelete}
      />

      <QueryListWrapper
        isLoading={isLoading}
        error={error}
        data={products}
        onRetry={refetch}
        emptyMessage="Chưa có sản phẩm nào. Thêm sản phẩm đầu tiên!"
      >
        <ProductTable
          products={products}
          loading={false}
          total={pagination.total ?? products.length}
          totalPages={pagination.totalPages || 1}
          currentPage={filters.page}
          onPageChange={(page) => updateFilters({ page })}
          onView={(product) => navigate(`/admin-products/${product.id}`)}
          onEdit={(product) => navigate(`/admin-products/${product.id}/edit`)}
          onDelete={handleDelete}
          onManageVariants={(product) => navigate(`/admin-products/${product.id}/edit#variants`)}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
        />
      </QueryListWrapper>

      </div>

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa sản phẩm"
        message="Hành động này không thể hoàn tác."
        itemName={productToDelete?.name}
        loading={deleting}
      />
    </div>
  );
};

export default ProductsPage;