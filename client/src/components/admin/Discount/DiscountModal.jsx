import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import { notify } from '../../../utils/notification';
import uploadService from '../../../services/uploadService';

const DiscountModal = ({ isOpen, onClose, discount, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    image: '',
    discountType: 'percentage',
    percentage: '',
    fixedAmount: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (discount) {
      // Edit mode
      setFormData({
        code: discount.code,
        description: discount.description || '',
        image: discount.image || '',
        discountType: discount.percentage ? 'percentage' : 'fixedAmount',
        percentage: discount.percentage || '',
        fixedAmount: discount.fixedAmount || '',
        startDate: discount.startDate ? new Date(discount.startDate).toISOString().slice(0, 16) : '',
        endDate: discount.endDate ? new Date(discount.endDate).toISOString().slice(0, 16) : '',
      });
      setImagePreview(discount.image || null);
    } else {
      // Create mode
      setFormData({
        code: '',
        description: '',
        image: '',
        discountType: 'percentage',
        percentage: '',
        fixedAmount: '',
        startDate: '',
        endDate: '',
      });
      setImagePreview(null);
    }
  }, [discount, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

    try {
      setUploading(true);
      
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const urls = await uploadService.uploadImages(file);
      
      if (urls && urls.length > 0) {
        setFormData((prev) => ({ ...prev, image: urls[0] }));
        notify.success('Tải ảnh lên thành công');
      }
    } catch (error) {
      notify.error('Không thể tải ảnh lên');
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.code.trim()) {
      notify.error('Vui lòng nhập mã giảm giá');
      return;
    }

    if (!formData.startDate) {
      notify.error('Vui lòng chọn ngày bắt đầu');
      return;
    }

    if (formData.discountType === 'percentage') {
      const percentage = parseFloat(formData.percentage);
      if (!percentage || percentage <= 0 || percentage > 100) {
        notify.error('Phần trăm giảm giá phải từ 1-100');
        return;
      }
    } else {
      const fixedAmount = parseFloat(formData.fixedAmount);
      if (!fixedAmount || fixedAmount <= 0) {
        notify.error('Số tiền giảm phải lớn hơn 0');
        return;
      }
    }

    // Prepare data
    const submitData = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description.trim() || undefined,
      image: formData.image || undefined,
      percentage: formData.discountType === 'percentage' ? parseFloat(formData.percentage) : null,
      fixedAmount: formData.discountType === 'fixedAmount' ? parseFloat(formData.fixedAmount) : null,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
    };

    setLoading(true);
    try {
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      notify.error('Có lỗi xảy ra khi lưu mã giảm giá');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={discount ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'} variant="admin">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mã giảm giá */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mã giảm giá <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            placeholder="VD: SUMMER2024"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            disabled={!!discount}
          />
          {discount && (
            <p className="text-xs text-gray-500 mt-1">Mã giảm giá không thể thay đổi</p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả về mã giảm giá..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Ảnh banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ảnh banner khuyến mãi
          </label>
          
          {imagePreview ? (
            <div className="relative">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                disabled={uploading}
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-3"></div>
                    <p className="text-sm text-gray-600">Đang tải lên...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      Click để chọn ảnh hoặc kéo thả
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF tối đa 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Ảnh sẽ hiển thị trên card khuyến mãi ở trang khách hàng</p>
        </div>

        {/* Loại giảm giá */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại giảm giá <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="discountType"
                value="percentage"
                checked={formData.discountType === 'percentage'}
                onChange={handleChange}
                className="mr-2"
              />
              Phần trăm (%)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="discountType"
                value="fixedAmount"
                checked={formData.discountType === 'fixedAmount'}
                onChange={handleChange}
                className="mr-2"
              />
              Số tiền cố định (VNĐ)
            </label>
          </div>
        </div>

        {/* Giá trị */}
        {formData.discountType === 'percentage' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phần trăm giảm <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="percentage"
              value={formData.percentage}
              onChange={handleChange}
              placeholder="VD: 10"
              min="1"
              max="100"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Từ 1% đến 100%</p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số tiền giảm <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="fixedAmount"
              value={formData.fixedAmount}
              onChange={handleChange}
              placeholder="VD: 50000"
              min="1"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Số tiền giảm cố định (VNĐ)</p>
          </div>
        )}

        {/* Ngày bắt đầu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Ngày kết thúc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày kết thúc
          </label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Để trống nếu không giới hạn thời gian</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : discount ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DiscountModal;
