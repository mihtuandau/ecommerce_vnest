import { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';

const ProductForm = ({ product, categories, brands, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    stock: '',
    description: '',
    categoryId: '',
    brandId: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        basePrice: product.basePrice || '',
        stock: product.stock || '',
        description: product.description || '',
        categoryId: product.categoryId ? String(product.categoryId) : '',
        brandId: product.brandId ? String(product.brandId) : '',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Convert string IDs to numbers before submitting
      const submitData = {
        ...formData,
        categoryId: formData.categoryId ? Number(formData.categoryId) : null,
        brandId: formData.brandId ? Number(formData.brandId) : null,
        basePrice: Number(formData.basePrice),
        stock: Number(formData.stock) || 0,
      };
      await onSave(submitData);
    } catch (error) {
      // Error handled by parent component
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={product ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Tên sản phẩm */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên sản phẩm"
              />
            </div>

            {/* Giá và tồn kho */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.basePrice}
                  onChange={(e) => handleChange('basePrice', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tồn kho
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Danh mục và thương hiệu */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục *
                </label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled hidden>Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thương hiệu
                </label>
                <select
                  value={formData.brandId}
                  onChange={(e) => handleChange('brandId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Không có</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Mô tả sản phẩm..."
              />
            </div>
          </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={loading}
          >
            {product ? 'Cập nhật' : 'Tạo sản phẩm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;