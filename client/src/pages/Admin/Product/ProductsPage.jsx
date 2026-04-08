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
import ProductStats from '../../../components/admin/Product/ProductStats';
import { Filter } from 'lucide-react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
    'createdAt',
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
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Header Setup */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Quản lý sản phẩm</h1>
            <p className="text-gray-500 text-sm">Quản lý toàn bộ sản phẩm trong cửa hàng</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="primary"
              size="large"
              className="bg-blue-600 hover:bg-blue-700 font-medium rounded-lg px-5 h-10 flex items-center"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin-products/create')}
            >
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <ProductStats 
          products={productsData?.products || []} 
          getTotalStock={(p) => p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : (p.stock || 0)} 
        />

        <BulkActionsBar
          selectedCount={selectedProducts.length}
          onBulkDelete={handleBulkActionDelete}
          onBulkStatusChange={handleBulkStatusChange}
          onExport={handleExport}
          onClearSelection={handleClearSelection}
          deleting={deleting}
        />

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Custom Tabs & Search */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-6 text-sm font-medium border-b border-gray-100 pb-2">
                {[
                  { key: '', label: 'Tất cả', count: products.length },
                  { key: 'active', label: 'Đang bán', count: products.filter(p => p.isActive !== false).length },
                  { key: 'inactive', label: 'Đã ẩn', count: products.filter(p => p.isActive === false).length },
                  { key: 'low-stock', label: 'Sắp hết', count: products.filter(p => { const stock = p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : (p.stock || 0); return stock > 0 && stock < 50; }).length },
                  { key: 'out-of-stock', label: 'Hết hàng', count: products.filter(p => { const stock = p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : (p.stock || 0); return stock === 0; }).length },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => updateFilters({ status: tab.key, page: 1 })}
                    className={`pb-3 border-b-2 transition-colors relative top-[9px] -mb-[9px] ${
                      (filters.status || '') === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label} <span className="ml-1 bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md text-xs font-semibold">{tab.count}</span>
                  </button>
                ))}
                
                <div className="ml-auto">
                  <Button 
                    className="flex items-center gap-2 rounded-lg border-gray-200 text-gray-600 font-medium"
                    icon={<Filter size={16} />}
                  >
                    Lọc nâng cao
                  </Button>
                </div>
              </div>

              <div className="mt-2">
                <Input
                  prefix={<SearchOutlined className="text-gray-400" />}
                  placeholder="Tìm theo tên hoặc slug sản phẩm..."
                  value={filters.search}
                  onChange={e => updateFilters({ search: e.target.value, page: 1 })}
                  className="rounded-lg h-10 border-gray-200 text-sm hover:border-blue-400 focus:border-blue-500 w-full"
                />
              </div>
            </div>
          </div>


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