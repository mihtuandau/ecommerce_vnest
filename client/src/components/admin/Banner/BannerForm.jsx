import { useState, useEffect } from 'react';
import { notify } from '../../../utils/notification';
import { X, Upload } from 'lucide-react';
import Button from '../../common/Button';
import Modal from '../../common/Modal';

const BannerFormModal = ({ banner = null, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Mua ngay',
    video: '',
    isActive: true,
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        buttonText: banner.buttonText || 'Mua ngay',
        video: banner.video || '',
        isActive: banner.isActive ?? true,
        order: banner.order || 0,
      });
      setImagePreview(banner.image || '');
    } else {
      setFormData({
        title: '',
        subtitle: '',
        buttonText: 'Mua ngay',
        video: '',
        isActive: true,
        order: 0,
      });
      setImagePreview('');
      setImageFile(null);
    }
  }, [banner]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        notify.error('Vui lòng chọn file ảnh');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      notify.error('Vui lòng nhập tiêu đề banner');
      return;
    }

    if (!banner && !imageFile) {
      notify.error('Vui lòng chọn ảnh banner');
      return;
    }

    try {
      setLoading(true);
      const submitData = new FormData();
      
      submitData.append('title', formData.title);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('buttonText', formData.buttonText);
      submitData.append('video', formData.video);
      submitData.append('isActive', formData.isActive);
      submitData.append('order', formData.order);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      await onSave(submitData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={banner ? 'Sửa Banner' : 'Thêm Banner Mới'}
      variant="admin"
    >
      <form onSubmit={handleSubmit} className="flex flex-col h-full -m-6">
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh Banner <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">Click để chọn ảnh</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG (tối đa 5MB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Nhập tiêu đề banner"
              required
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phụ đề
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Nhập phụ đề"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text nút CTA
            </label>
            <input
              type="text"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="Mua ngay"
            />
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (tùy chọn)
            </label>
            <input
              type="text"
              name="video"
              value={formData.video}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              placeholder="https://example.com/video.mp4"
            />
          </div>

          {}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                min="0"
              />
            </div>

            <div className="flex items-center pt-8">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Banner Active
                </span>
              </label>
            </div>
          </div>
        </div>

        {}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            loading={loading}
          >
            {banner ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default BannerFormModal;
  





