import { useState, useEffect } from 'react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import BulkVariantForm from './BulkVariantForm';
import SingleVariantForm from './SingleVariantForm';
import VariantSummary from './VariantSummary';
import { notify } from '../../../utils/notification';
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
        notify.success(`Đã thêm ${sizeList.length} variants!`);
      } else {
        const variant = variants[0];
        
        if (!validateSingleVariant(variant)) {
          setLoading(false);
          return;
        }
        
        allVariants = updateSingleVariant(variant, product, existingVariants, editingVariant);
        notify.success(editingVariant ? 'Đã cập nhật variant!' : 'Đã thêm variant mới!');
      }
      
      await onSave(product.id, allVariants);
      
      if (selectedImages.length > 0 && editingVariant?.id) {
        await onImagesUploaded?.(editingVariant.id, selectedImages);
      }
      
      onClose();
    } catch (error) {
      notify.error(error?.message || 'Không thể lưu variant');
    } finally {
      setLoading(false);
    }
  };

  const currentVariant = variants[0] || { size: '', color: '', price: '', stock: '', sku: '' };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={editingVariant ? 'Sửa Variant' : 'Thêm Variant'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Mode Toggle - Only show when adding new */}
        {!editingVariant && (
          <div className="flex gap-2">
            <button
              onClick={() => setBulkMode(false)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                !bulkMode 
                  ? 'bg-[#00a85a] text-white hover:bg-[#008f4d]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đơn Lẻ
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                bulkMode 
                  ? 'bg-[#00a85a] text-white hover:bg-[#008f4d]' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hàng Loạt
            </button>
          </div>
        )}

        {/* Variant Form */}
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
            onClick={handleSave}
            loading={loading}
          >
            {editingVariant ? 'Lưu' : bulkMode ? 'Thêm Hàng Loạt' : 'Thêm Variant'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default VariantModal;