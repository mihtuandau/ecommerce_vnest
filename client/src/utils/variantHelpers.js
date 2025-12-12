import toast from 'react-hot-toast';

export const validateBulkVariant = (bulkData) => {
  if (!bulkData.color?.trim()) {
    toast.error('Vui lòng nhập màu sắc');
    return false;
  }
  
  if (!bulkData.sizes?.trim()) {
    toast.error('Vui lòng nhập các size (VD: S, M, L, XL)');
    return false;
  }
  
  const sizeList = bulkData.sizes.split(',').map(s => s.trim()).filter(s => s);
  
  if (sizeList.length === 0) {
    toast.error('Không tìm thấy size hợp lệ');
    return false;
  }
  
  return sizeList;
};

export const validateSingleVariant = (variant) => {
  // Size và color đều optional - không bắt buộc
  // Chỉ cần có giá là đủ
  if (!variant.price || variant.price <= 0) {
    toast.error('Vui lòng nhập giá sản phẩm');
    return false;
  }
  return true;
};

export const createBulkVariants = (bulkData, product, existingVariants) => {
  const { color, sizes, price, stock, skuPrefix } = bulkData;
  const sizeList = sizes.split(',').map(s => s.trim()).filter(s => s);
  
  const newVariants = sizeList.map((size) => ({
    size: size,
    color: color.trim(),
    price: price || product?.basePrice || 0,
    stock: stock || 0,
    sku: skuPrefix ? `${skuPrefix}-${size}`.toUpperCase() : ''
  }));
  
  return [...existingVariants, ...newVariants];
};

export const updateSingleVariant = (variant, product, existingVariants, editingVariant) => {
  if (editingVariant) {
    return existingVariants.map(v => 
      v.id === editingVariant.id 
        ? { 
            ...v,
            size: variant.size?.trim() || '',
            color: variant.color?.trim() || '',
            price: variant.price || product?.basePrice || 0,
            stock: variant.stock || 0,
            sku: variant.sku?.trim() || ''
          }
        : v
    );
  } else {
    const newVariant = {
      size: variant.size?.trim() || '',
      color: variant.color?.trim() || '',
      price: variant.price || product?.basePrice || 0,
      stock: variant.stock || 0,
      sku: variant.sku?.trim() || ''
    };
    return [...existingVariants, newVariant];
  }
};
