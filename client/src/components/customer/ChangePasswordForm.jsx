import React, { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { notify } from '../../utils/notification';
import authService from '../../services/authService';

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
    } catch (error) {
      notify.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative">
          <Input
            label="Mật khẩu hiện tại"
            type={showPasswords.current ? 'text' : 'password'}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('current')}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.current ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Mật khẩu mới"
            type={showPasswords.new ? 'text' : 'password'}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('new')}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.new ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Xác nhận mật khẩu mới"
            type={showPasswords.confirm ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => toggleShowPassword('confirm')}
            className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
          >
            {showPasswords.confirm ? '🙈' : '👁️'}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-sm text-yellow-800">
            <strong>💡 Lưu ý:</strong>
          </p>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
            <li>Mật khẩu phải có ít nhất 6 ký tự</li>
            <li>Bạn sẽ cần đăng nhập lại sau khi đổi mật khẩu</li>
          </ul>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        Đổi mật khẩu
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
