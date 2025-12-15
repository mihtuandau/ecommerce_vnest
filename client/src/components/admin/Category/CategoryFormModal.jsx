import { useState, useEffect } from 'react';
import { notify } from '../../../utils/notification';
import { X, Upload } from 'lucide-react';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

const CategoryFormModal = ({ isOpen, onClose, onSubmit, category = null }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(category?.image || null);

  // Reset form when category changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: category?.name || '',
        image: null,
      });
      setImagePreview(category?.image || null);
    }
  }, [category, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        notify.error('Vui lòng chọn file ảnh');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notify.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name.trim());
    
    if (formData.image) {
      data.append('image', formData.image);
    }
    
    onSubmit(data);
  };

  const handleClose = () => {
    setFormData({ name: '', image: null });
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      size="md"
      title={category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full -m-6">
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh danh mục
              </label>
              
              {imagePreview ? (
                <div className="relative inline-block">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-medium">Nhấn để tải ảnh</span> hoặc kéo thả
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
          <Button type="button" onClick={handleClose} variant="secondary">
            Hủy
          </Button>
          <Button type="submit" variant="primary">
            {category ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryFormModal;
