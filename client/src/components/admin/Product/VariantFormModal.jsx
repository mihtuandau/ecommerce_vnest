import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { notify } from '../../../utils/notification';
import productService from '../../../services/productService';
import VariantFormFields from './VariantFormFields';
import VariantImageManager from './VariantImageManager';

const VariantFormModal = ({ isOpen, onClose, variant, productId, onSuccess }) => {
  const [formData, setFormData] = useState({
    size: '',
    color: '',
    sku: '',
    price: 0,
    stock: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingImages, setDeletingImages] = useState([]);
  const [selectedExistingImages, setSelectedExistingImages] = useState([]);
  const [selectedNewImages, setSelectedNewImages] = useState([]);

  // Initialize form data
  useEffect(() => {
    if (variant) {
      setFormData({
        size: variant.size || '',
        color: variant.color || '',
        sku: variant.sku || '',
        price: variant.price || 0,
        stock: variant.stock || 0,
      });
      setExistingImages(variant.images || []);
    } else {
      setFormData({
        size: '',
        color: '',
        sku: '',
        price: 0,
        stock: 0,
      });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setPreviewUrls([]);
    setSelectedExistingImages([]);
    setSelectedNewImages([]);
  }, [variant, isOpen]);

  // Handle file select
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = selectedFiles.length + existingImages.length;
    const availableSlots = 5 - currentTotal;
    
    if (files.length === 0) return;
    
    if (currentTotal >= 5) {
      notify.error('Đã đủ 5 ảnh, vui lòng xóa bớt để thêm mới');
      e.target.value = '';
      return;
    }
    
    if (files.length > availableSlots) {
      notify.warning(`Chỉ có thể thêm ${availableSlots} ảnh nữa (tối đa 5 ảnh)`);
      const allowedFiles = files.slice(0, availableSlots);
      setSelectedFiles(prev => [...prev, ...allowedFiles]);
      const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    } else {
      setSelectedFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      notify.success(`Đã thêm ${files.length} ảnh`);
    }
    
    e.target.value = '';
  };

  // Remove new image
  const handleRemoveNewImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Delete existing image
  const handleDeleteExistingImage = async (imageId) => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;

    setDeletingImages(prev => [...prev, imageId]);
    try {
      await productService.deleteVariantImage(imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      setSelectedExistingImages(prev => prev.filter(id => id !== imageId));
      notify.success('Đã xóa ảnh');
    } catch (error) {
      notify.error('Xóa ảnh thất bại');
    } finally {
      setDeletingImages(prev => prev.filter(id => id !== imageId));
    }
  };

  // Delete selected existing images
  const handleDeleteSelectedExisting = async () => {
    if (selectedExistingImages.length === 0) return;
    if (!window.confirm(`Bạn có chắc muốn xóa ${selectedExistingImages.length} ảnh đã chọn?`)) return;

    setDeletingImages(selectedExistingImages);
    try {
      await Promise.all(
        selectedExistingImages.map(id => productService.deleteVariantImage(id))
      );
      setExistingImages(prev => prev.filter(img => !selectedExistingImages.includes(img.id)));
      notify.success(`Đã xóa ${selectedExistingImages.length} ảnh`);
      setSelectedExistingImages([]);
    } catch (error) {
      notify.error('Có lỗi khi xóa ảnh');
    } finally {
      setDeletingImages([]);
    }
  };

  // Delete selected new images
  const handleDeleteSelectedNew = () => {
    if (selectedNewImages.length === 0) return;
    
    selectedNewImages.forEach(index => {
      URL.revokeObjectURL(previewUrls[index]);
    });
    
    setSelectedFiles(prev => prev.filter((_, i) => !selectedNewImages.includes(i)));
    setPreviewUrls(prev => prev.filter((_, i) => !selectedNewImages.includes(i)));
    setSelectedNewImages([]);
    notify.success(`Đã xóa ${selectedNewImages.length} ảnh`);
  };

  // Toggle select existing image
  const toggleSelectExisting = (imageId) => {
    setSelectedExistingImages(prev =>
      prev.includes(imageId)
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Toggle select new image
  const toggleSelectNew = (index) => {
    setSelectedNewImages(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Select all existing images
  const selectAllExisting = () => {
    if (selectedExistingImages.length === existingImages.length) {
      setSelectedExistingImages([]);
    } else {
      setSelectedExistingImages(existingImages.map(img => img.id));
    }
  };

  // Select all new images
  const selectAllNew = () => {
    if (selectedNewImages.length === selectedFiles.length) {
      setSelectedNewImages([]);
    } else {
      setSelectedNewImages(selectedFiles.map((_, i) => i));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.size || !formData.color) {
      notify.error('Vui lòng nhập size và màu');
      return;
    }

    setLoading(true);
    try {
      let variantId = variant?.id;

      // Create or update variant
      if (variant) {
        await productService.updateVariant(variant.id, formData);
        notify.success('Đã cập nhật biến thể');
      } else {
        const response = await productService.addVariant(productId, formData);
        variantId = response?.data?.id || response?.id;
        notify.success('Đã thêm biến thể');
      }

      // Upload new images if any
      if (selectedFiles.length > 0 && variantId) {
        await productService.uploadVariantImages(variantId, selectedFiles, {
          isPrimary: existingImages.length === 0 && selectedFiles.length === 1,
        });
        notify.success('Đã upload ảnh');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error:', error);
      notify.error(error.response?.data?.message || error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  // Handle form field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {variant ? 'Chỉnh sửa biến thể' : 'Thêm biến thể mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Form Fields */}
          <VariantFormFields formData={formData} onChange={handleChange} />

          {/* Image Manager */}
          <VariantImageManager
            existingImages={existingImages}
            previewUrls={previewUrls}
            selectedExistingImages={selectedExistingImages}
            selectedNewImages={selectedNewImages}
            deletingImages={deletingImages}
            onSelectExisting={toggleSelectExisting}
            onSelectNew={toggleSelectNew}
            onSelectAllExisting={selectAllExisting}
            onSelectAllNew={selectAllNew}
            onDeleteExisting={handleDeleteExistingImage}
            onDeleteSelectedExisting={handleDeleteSelectedExisting}
            onDeleteNew={handleRemoveNewImage}
            onDeleteSelectedNew={handleDeleteSelectedNew}
            onFileSelect={handleFileSelect}
          />

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : variant ? 'Cập nhật' : 'Thêm biến thể'}
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default VariantFormModal;
