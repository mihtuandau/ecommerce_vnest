import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import { useProductActions } from '../../../hooks/useProductActions';
import ProductStats from '../../../components/admin/Product/ProductStats';
import ProductToolbar from '../../../components/admin/Product/ProductToolbar';
import ProductTable from '../../../components/admin/Product/ProductTable';
import ProductForm from '../../../components/admin/Product/ProductForm';
import VariantManager from '../../../components/admin/Product/VariantModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirm';
import { formatPrice, getTotalStock } from '../../../utils/formatters';

const ProductsPage = () => {
  const {
    products,
    categories,
    brands,
    loading,
    filters,
    totalPages,
    loadProducts,
    updateFilters
  } = useProducts();

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
  } = useProductActions({ loadProducts, products });

  // Selection handlers
  const handleSelectAll = (e) => {
    setSelectedProducts(e.target.checked ? products.map(p => p.id) : []);
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products Management</h1>
        <p className="text-gray-600">Manage your product inventory and details</p>
      </div>

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
      <ProductTable
        products={products}
        loading={loading}
        totalPages={totalPages}
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
        onRefresh={loadProducts}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
      />

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
            loadProducts();
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