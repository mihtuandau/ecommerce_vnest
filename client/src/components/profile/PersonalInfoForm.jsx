import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';

const PersonalInfoForm = ({ currentUser, onSubmit, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
    });
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditing) return;
    if (!validateForm()) return;
    
    const success = await onSubmit(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Họ và tên <span className="text-gray-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-normal text-gray-900 mb-2">
            Email <span className="text-gray-400">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-900 transition-colors disabled:bg-gray-100 disabled:text-gray-500"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="border border-gray-300 p-4 bg-gray-50">
          <p className="text-sm text-gray-600">
            Email được dùng để đăng nhập và nhận thông báo
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 border border-[#00a85a] hover:bg-[#00a85a] hover:text-white text-[#00a85a] transition-colors"
          >
            Chỉnh sửa
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#00a85a] hover:bg-[#008f4d] text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 hover:border-[#00a85a] text-gray-900 transition-colors"
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </form>
  );
};
export default PersonalInfoForm;