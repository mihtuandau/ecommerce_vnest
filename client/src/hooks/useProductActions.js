import { useState } from 'react';
import { notify } from '../utils/notification';
import productService from '../services/productService';
import {
  useCreateProduct as useCreateProductMutation,
  useUpdateProduct as useUpdateProductMutation,
  useDeleteProduct as useDeleteProductMutation,
} from './useProducts';

export const useProductActions = ({ refetch, products, selectedProducts = [] }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [managingVariantsProduct, setManagingVariantsProduct] = useState(null);
  const [showVariantManager, setShowVariantManager] = useState(false);

  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

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

  const handleDuplicate = async (product) => {
    try {
      await productService.create({
        name: `${product.name} (Copy)`,
        description: product.description,
        basePrice: product.basePrice,
        categoryId: product.categoryId,
        brandId: product.brandId,
      });
      notify.success('Đã nhân bản sản phẩm');
      refetch();
    } catch (error) {
      notify.error('Không thể nhân bản sản phẩm');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Xóa ${selectedProducts.length} sản phẩm?`)) return;

    try {
      await productService.bulkDelete(selectedProducts);
      notify.success(`Đã xóa ${selectedProducts.length} sản phẩm`);
      refetch();
    } catch (error) {
      notify.error('Không thể xóa sản phẩm');
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    deleteMutation.mutate(productToDelete.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
      }
    });
  };

  const handleSaveProduct = async (productData, images) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct, productData, images);
        notify.success('Cập nhật sản phẩm thành công!');
      } else {
        await createProduct(productData, images);
        notify.success('Tạo sản phẩm mới thành công!');
      }

      setShowForm(false);
      setEditingProduct(null);
      refetch();
      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Lưu sản phẩm thất bại');
      return false;
    }
  };

  const handleSaveVariants = async (productId, variantsData) => {
    try {
      const currentProduct = products.find(p => p.id === productId);
      const existingVariants = currentProduct?.variants || [];
      
      const { toCreate, toUpdate, toDelete } = calculateVariantChanges(existingVariants, variantsData);
      
      // Thực hiện các thao tác và lưu kết quả
      const results = await Promise.all([
        ...toDelete.map(v => productService.deleteVariant(v.id)),
        ...toCreate.map(v => createVariant(productId, v, currentProduct)),
        ...toUpdate.map(v => updateVariant(v, currentProduct))
      ]);
      
      // Lọc ra các variants mới được tạo (bỏ qua kết quả delete)
      const createdVariants = results.slice(toDelete.length, toDelete.length + toCreate.length);
      
      notify.success('Đã cập nhật biến thể thành công');
      setShowVariantManager(false);
      setManagingVariantsProduct(null);
      refetch();
      
      // Trả về danh sách variants vừa tạo (có ID từ backend)
      return createdVariants;
    } catch (error) {
      notify.error('Không thể lưu biến thể');
      throw error;
    }
  };

  return {
    deleteModalOpen,
    productToDelete,
    editingProduct,
    showForm,
    managingVariantsProduct,
    showVariantManager,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleManageVariants,
    handleSaveVariants,
    handleSaveProduct,
    handleBulkDelete,
    handleAddProduct,
    confirmDelete,
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