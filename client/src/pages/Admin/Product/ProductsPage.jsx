import { useState } from 'react';
import { useProducts, useCategories, useBrands } from '../../../hooks/useProducts';
import { useProductActions } from '../../../hooks/useProductActions';
import { PageHeader } from '../../../components/common/PageHeader';
import { QueryListWrapper } from '../../../components/common/QueryWrapper';
import ProductStats from '../../../components/admin/Product/ProductStats';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import ProductForm from '../../../components/admin/Product/ProductForm';
import VariantManager from '../../../components/admin/Product/VariantModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import { formatPrice, getTotalStock } from '../../../utils/formatters';

const ProductsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    page: 1,
    limit: 10
  });

  const { data: productsData, isLoading, refetch, error } = useProducts(filters);
  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();

  const products = productsData?.products || [];
  const pagination = productsData?.pagination || {};

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  
  const {
    // States
    deleteModalOpen,
    productToDelete,
    editingProduct,
    showForm,
    managingVariantsProduct,
    showVariantManager,
    
    // Handlers
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleManageVariants,
    handleSaveVariants,
    handleBulkDelete,
    handleSaveProduct,
    confirmDelete,
    
    // Setters
    setDeleteModalOpen,
    setProductToDelete,
    setEditingProduct,
    setShowForm,
    setManagingVariantsProduct,
    setShowVariantManager
  } = useProductActions({ refetch, products });

  // Selection handlers
  const handleSelectAll = (e) => {
    setSelectedProducts(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Update filters helper
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Products Management"
        subtitle="Manage your product inventory and details"
        showRefresh
        onRefresh={refetch}
        refreshing={isLoading}
      />

      {/* Stats */}
      <ProductStats 
        products={products}
        formatPrice={formatPrice}
        getTotalStock={getTotalStock}
      />

      {/* Toolbar */}
      <ProductToolbar
        search={filters.search}
        setSearch={(value) => updateFilters({ search: value, page: 1 })}
        selectedCategory={filters.categoryId}
        setSelectedCategory={(value) => updateFilters({ categoryId: value, page: 1 })}
        categories={categories}
        selectedProducts={selectedProducts}
        onBulkDelete={handleBulkDelete}
        onAddProduct={() => {
          setEditingProduct(null);
          setShowForm(true);
        }}
      />

      {/* Products Table */}
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
          totalPages={pagination.totalPages || 1}
          currentPage={filters.page}
          onPageChange={(page) => updateFilters({ page })}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onManageVariants={(product, variant) => {
            setManagingVariantsProduct(product);
            setEditingVariant(variant || null);
            setShowVariantManager(true);
          }}
          onRefresh={refetch}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
        />
      </QueryListWrapper>

      {/* Modals */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          brands={brands}
          onSave={handleSaveProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* Variant Manager Modal */}
      {showVariantManager && managingVariantsProduct && (
        <VariantManager
          product={managingVariantsProduct}
          editingVariant={editingVariant}
          onClose={() => {
            setShowVariantManager(false);
            setManagingVariantsProduct(null);
            setEditingVariant(null);
          }}
          onSave={handleSaveVariants}
          onImagesUploaded={async (variantId, images) => {
            // Upload images for this variant
            const productService = (await import('../../../services/productService')).default;
            await productService.uploadImages(managingVariantsProduct.id, images, { variantId });
            refetch();
          }}
        />
      )}

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        productToDelete={productToDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ProductsPage;