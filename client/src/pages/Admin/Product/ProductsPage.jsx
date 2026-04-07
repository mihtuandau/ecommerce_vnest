import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useProducts, useCategories, useBrands } from '../../../hooks/useProducts';
import { useProductActions } from '../../../hooks/useProductActions';
import { PageHeader } from '../../../components/common/PageHeader';
import { QueryListWrapper } from '../../../components/common/QueryWrapper';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import BulkActionsBar from '../../../components/admin/Product/BulkActionsBar';
import ColumnCustomizer from '../../../components/admin/Product/ColumnCustomizer';
import { exportSelectedProductsToCSV } from '../../../utils/exportUtils';
import productService from '../../../services/productService';

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

  const [visibleColumns, setVisibleColumns] = useState([
    'select',
    'product',
    'sku',
    'category',
    'price',
    'stock',
    'sold',
    'rating',
    'status',
    'variants',
    'actions',
  ]);

  const [bulkStatusLoading, setBulkStatusLoading] = useState(false);

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

  const handleBulkStatusChange = async (newStatus) => {
    if (selectedProducts.length === 0) return;

    setBulkStatusLoading(true);
    try {
      const isActive = newStatus === 'active';
      
      // Gọi API để update status của tất cả sản phẩm được chọn
      await Promise.all(
        selectedProducts.map(id =>
          productService.update(id, { isActive })
        )
      );

      message.success(`Đã cập nhật trạng thái cho ${selectedProducts.length} sản phẩm`);
      setSelectedProducts([]);
      refetch();
    } catch (err) {
      message.error(err?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setBulkStatusLoading(false);
    }
  };

  const handleBulkActionDelete = async () => {
    if (selectedProducts.length === 0) return;
    await handleBulkDelete();
    setSelectedProducts([]);
  };

  const handleExport = () => {
    if (selectedProducts.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm để xuất');
      return;
    }
    try {
      exportSelectedProductsToCSV(
        selectedProducts,
        products,
        `products-${new Date().getTime()}.csv`
      );
      message.success('Đang tải file...');
    } catch (err) {
      message.error('Có lỗi xảy ra khi xuất dữ liệu');
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-full w-full ">
        <PageHeader
          title="Quản lý sản phẩm"
          subtitle={`Tổng số sản phẩm: ${pagination.total ?? products.length}`}
          showRefresh
          onRefresh={refetch}
          refreshing={isLoading}
          actions={
            <div className="flex gap-2">
              <ColumnCustomizer
                visibleColumns={visibleColumns}
                onColumnsChange={setVisibleColumns}
              />
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => navigate('/admin-products/create')}
              >
                + Thêm sản phẩm mới
              </Button>
            </div>
          }
        />

      <BulkActionsBar
        selectedCount={selectedProducts.length}
        onBulkDelete={handleBulkActionDelete}
        onBulkStatusChange={handleBulkStatusChange}
        onExport={handleExport}
        onClearSelection={handleClearSelection}
        deleting={deleting}
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
          visibleColumns={visibleColumns}
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