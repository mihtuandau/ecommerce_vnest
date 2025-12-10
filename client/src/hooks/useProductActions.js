import { useState } from 'react';
import toast from 'react-hot-toast';
import productService from '../services/productService';

export const useProductActions = ({ products, loadProducts, selectedProducts = [] }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [managingVariantsProduct, setManagingVariantsProduct] = useState(null);
  const [showVariantManager, setShowVariantManager] = useState(false);

  // Basic actions
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleManageVariants = (product) => {
    setManagingVariantsProduct(product);
    setShowVariantManager(true);
  };

  // API actions
  const handleDuplicate = async (product) => {
    try {
      await productService.create({
        name: `${product.name} (Copy)`,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        brandId: product.brandId,
      });
      toast.success('Đã nhân bản sản phẩm');
      loadProducts();
    } catch (error) {
      toast.error('Không thể nhân bản sản phẩm');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Xóa ${selectedProducts.length} sản phẩm?`)) return;

    try {
      await productService.bulkDelete(selectedProducts);
      toast.success(`Đã xóa ${selectedProducts.length} sản phẩm`);
      loadProducts();
    } catch (error) {
      toast.error('Không thể xóa sản phẩm');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.delete(productToDelete.id);
      toast.success(`Đã xóa "${productToDelete.name}"`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể xóa sản phẩm');
    }
  };

  const handleSaveProduct = async (productData, images) => {
    try {
      // Use the hook's editingProduct state to determine update vs create
      if (editingProduct) {
        await updateProduct(editingProduct, productData, images);
        toast.success('Cập nhật sản phẩm thành công!');
      } else {
        await createProduct(productData, images);
        toast.success('Tạo sản phẩm mới thành công!');
      }

      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lưu sản phẩm thất bại');
      return false;
    }
  };

  const handleSaveVariants = async (productId, variantsData) => {
    try {
      const currentProduct = products.find(p => p.id === productId);
      const existingVariants = currentProduct?.variants || [];
      
      const { toCreate, toUpdate, toDelete } = calculateVariantChanges(existingVariants, variantsData);
      
      await Promise.all([
        ...toDelete.map(v => productService.deleteVariant(v.id)),
        ...toCreate.map(v => createVariant(productId, v, currentProduct)),
        ...toUpdate.map(v => updateVariant(v, currentProduct))
      ]);
      
      toast.success('Đã cập nhật biến thể thành công');
      setShowVariantManager(false);
      setManagingVariantsProduct(null);
      loadProducts();
    } catch (error) {
      toast.error('Không thể lưu biến thể');
    }
  };

  return {
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
    handleSaveProduct,
    handleBulkDelete,
    handleAddProduct,
    confirmDelete,
    
    // Setters
    setDeleteModalOpen,
    setProductToDelete,
    setEditingProduct,
    setShowForm,
    setManagingVariantsProduct,
    setShowVariantManager,
  };
};

// Helper functions
const calculateVariantChanges = (existingVariants, newVariants) => {
  const toCreate = newVariants.filter(v => !v.id);
  const toUpdate = newVariants.filter(v => v.id);
  const toDelete = existingVariants.filter(existing => 
    !newVariants.some(newV => newV.id === existing.id)
  );
  
  return { toCreate, toUpdate, toDelete };
};

const createVariant = async (productId, variant, currentProduct) => {
  const payload = prepareVariantData(variant, currentProduct?.basePrice);
  return await productService.addVariant(productId, {
    productId: Number(productId),
    ...payload
  });
};

const updateVariant = async (variant, currentProduct) => {
  const payload = prepareVariantData(variant, currentProduct?.basePrice);
  return await productService.updateVariant(variant.id, payload);
};

const prepareVariantData = (variant, basePrice = 0) => {
  const price = Math.max(parseFloat(variant.price) || basePrice, 1);
  const stock = Math.max(parseInt(variant.stock) || 1, 0);

  return {
    size: variant.size || undefined,
    color: variant.color || undefined,
    price,
    stock,
    sku: variant.sku || undefined,
  };
};

const updateProduct = async (product, productData, images) => {
  const updatePayload = createProductPayload(productData);
  await productService.update(product.id, updatePayload);
  
  await handleProductVariants(product.id, productData.variants, product.basePrice);
  await handleProductImages(product.id, images);
};

const createProduct = async (productData, images) => {
  const createPayload = createProductPayload(productData);
  const response = await productService.create(createPayload);
  const newProduct = response?.data || response;

  if (newProduct?.id) {
    await handleProductVariants(newProduct.id, productData.variants, productData.basePrice);
    await handleProductImages(newProduct.id, images);
  }
};

const createProductPayload = (productData) => {
  const payload = {};
  if (productData.name) payload.name = productData.name.trim();
  if (productData.description) payload.description = productData.description.trim();
  if (productData.basePrice) payload.basePrice = parseFloat(productData.basePrice);
  if (productData.categoryId) payload.categoryId = parseInt(productData.categoryId);
  if (productData.brandId) payload.brandId = parseInt(productData.brandId);
  
  return payload;
};

const handleProductVariants = async (productId, variants = [], basePrice = 0) => {
  for (const variant of variants) {
    const variantPayload = prepareVariantData(variant, basePrice);
    try {
      await productService.addVariant(productId, variantPayload);
    } catch (error) {}
  }
};

const handleProductImages = async (productId, images = []) => {
  const files = images.map(p => p.file).filter(Boolean);
  if (files.length > 0) {
    try {
      await productService.uploadImages(productId, files);
    } catch (error) {}
  }
};