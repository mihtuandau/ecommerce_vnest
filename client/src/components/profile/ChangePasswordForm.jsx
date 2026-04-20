import React, { useState } from 'react';
import { notify } from '../../utils/notification';
import authService from '../../services/authService';
import { FiEye, FiEyeOff } from 'react-icons/fi'; 

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      notify.success('Đổi mật khẩu thành công');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-6">
        {}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <input
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-4 py-3.5 pr-12 border border-gray-300 focus:outline-none focus:border-gray-900 transition-all"
            placeholder="Nhập mật khẩu hiện tại"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('current')}
            className="absolute right-3 top-12 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label={showPasswords.current ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPasswords.current ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
          {errors.currentPassword && (
            <p className="text-xs text-red-600 mt-2">{errors.currentPassword}</p>
          )}
        </div>

        {}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <input
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-4 py-3.5 pr-12 border border-gray-300 focus:outline-none focus:border-gray-900 transition-all"
            placeholder="Nhập mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('new')}
            className="absolute right-3 top-12 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label={showPasswords.new ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPasswords.new ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
          {errors.newPassword && (
            <p className="text-xs text-red-600 mt-2">{errors.newPassword}</p>
          )}
        </div>

        {}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <input
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-3.5 pr-12 border border-gray-300 focus:outline-none focus:border-gray-900 transition-all"
            placeholder="Nhập lại mật khẩu mới"
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('confirm')}
            className="absolute right-3 top-12 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label={showPasswords.confirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPasswords.confirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
          </button>
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-2">{errors.confirmPassword}</p>
          )}
        </div>

        {}
        <div className="p-5 bg-gray-50 border border-gray-200 ">
          <p className="text-sm font-medium text-gray-900 mb-2">Lưu ý:</p>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Mật khẩu phải có ít nhất 6 ký tự</li>
            <li>Bạn sẽ cần đăng nhập lại trên các thiết bị khác sau khi đổi</li>
          </ul>
        </div>
      </div>

      {}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 bg-black text-white font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
      </button>
    </form>
  );
};

export default ChangePasswordForm;





