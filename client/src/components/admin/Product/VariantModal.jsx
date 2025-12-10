import { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import BulkVariantForm from './BulkVariantForm';
import SingleVariantForm from './SingleVariantForm';
import VariantSummary from './VariantSummary';
import toast from 'react-hot-toast';
import {
  validateBulkVariant,
  validateSingleVariant,
  createBulkVariants,
  updateSingleVariant
} from '../../../utils/variantHelpers';

const VariantModal = ({ product, onClose, onSave, onImagesUploaded, editingVariant }) => {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState({
    color: '',
    sizes: '',
    price: '',
    stock: '',
    skuPrefix: ''
  });

  useEffect(() => {
    // Nếu đang edit variant, load data variant đó
    // Nếu không, tạo form trống
    if (editingVariant) {
      setVariants([{
        id: editingVariant.id,
        size: editingVariant.size || '',
        color: editingVariant.color || '',
        price: editingVariant.price || product?.basePrice || '',
        stock: editingVariant.stock || '',
        sku: editingVariant.sku || ''
      }]);
      setBulkMode(false);
    } else {
      setVariants([{ size: '', color: '', price: product?.basePrice || '', stock: '', sku: '' }]);
    }
    setSelectedImages([]);
  }, [product, editingVariant]);

  // Xử lý variants
  const handleVariantChange = (field, value) => {
    setVariants([{ ...variants[0], [field]: value }]);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const existingVariants = product.variants || [];
      let allVariants;
      
      if (bulkMode && !editingVariant) {
        const sizeList = validateBulkVariant(bulkData);
        if (!sizeList) {
          setLoading(false);
          return;
        }
        
        allVariants = createBulkVariants(bulkData, product, existingVariants);
        toast.success(`Đã thêm ${sizeList.length} variants!`);
      } else {
        const variant = variants[0];
        
        if (!validateSingleVariant(variant)) {
          setLoading(false);
          return;
        }
        
        allVariants = updateSingleVariant(variant, product, existingVariants, editingVariant);
        toast.success(editingVariant ? 'Đã cập nhật variant!' : 'Đã thêm variant mới!');
      }
      
      await onSave(product.id, allVariants);
      
      if (selectedImages.length > 0 && editingVariant?.id) {
        await onImagesUploaded?.(editingVariant.id, selectedImages);
      }
      
      onClose();
    } catch (error) {
      toast.error(error?.message || 'Không thể lưu variant');
    } finally {
      setLoading(false);
    }
  };

  const currentVariant = variants[0] || { size: '', color: '', price: '', stock: '', sku: '' };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={
        <div>
          <div className="text-xl font-semibold text-gray-900">Quản Lý Biến Thể</div>
          <p className="text-sm text-gray-600 mt-1">
            {product?.name} - {product?.sku || 'No SKU'}
          </p>
        </div>
      }
      size="2xl"
    >
      <div className="space-y-4">
        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-900">
            💡 <strong>Lưu ý:</strong> {editingVariant ? 'Chỉnh sửa thông tin variant và upload ảnh riêng cho variant này.' : bulkMode ? 'Nhập nhiều size cách nhau bằng dấu phẩy (VD: S, M, L, XL) để tạo nhiều variants cùng lúc cho một màu.' : 'Sau khi thêm, variant sẽ hiển thị ở bảng sản phẩm bên dưới. Click mũi tên xuống ở hàng sản phẩm để xem tất cả variants.'}
          </p>
        </div>

        {/* Mode Toggle - Only show when adding new */}
        {!editingVariant && (
          <div className="flex gap-2 border-b pb-3">
            <button
              onClick={() => setBulkMode(false)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                !bulkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ➕ Thêm Đơn Lẻ
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                bulkMode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ⚡ Thêm Hàng Loạt
            </button>
          </div>
        )}

        {/* Variant Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-base font-semibold text-gray-900">
            {editingVariant ? '✏️ Chỉnh Sửa Variant' : bulkMode ? '⚡ Thêm Nhiều Size Cùng Lúc' : '➕ Thêm Biến Thể Mới'}
          </h3>
          
          {bulkMode && !editingVariant ? (
            <BulkVariantForm 
              product={product}
              bulkData={bulkData}
              setBulkData={setBulkData}
            />
          ) : (
            <>
              <SingleVariantForm
                variant={currentVariant}
                product={product}
                handleVariantChange={handleVariantChange}
                selectedImages={selectedImages}
                handleImageSelect={handleImageSelect}
                editingVariant={editingVariant}
              />
              {!editingVariant && <VariantSummary product={product} />}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2"
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            loading={loading}
            className="px-5 py-2"
          >
            {editingVariant ? '💾 Lưu Thay Đổi' : bulkMode ? '⚡ Thêm Hàng Loạt' : '➕ Thêm Variant'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VariantModal;