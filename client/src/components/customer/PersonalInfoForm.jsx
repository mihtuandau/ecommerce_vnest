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
    
    // Prevent submit if not in editing mode
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
      <div className="space-y-4">
        <Input
          label="Họ và tên"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={!isEditing}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={!isEditing}
          required
        />

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">
            <strong>Lưu ý:</strong> Email được dùng để đăng nhập và nhận thông báo.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {!isEditing ? (
          <Button
            type="button"
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="border-black text-black hover:bg-gray-100"
          >
            Chỉnh sửa
          </Button>
        ) : (
          <>
            <Button
              type="submit"
              loading={loading}
              className="bg-black text-white hover:bg-gray-800"
            >
              Lưu thay đổi
            </Button>
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="border-gray-300"
            >
              Hủy
            </Button>
          </>
        )}
      </div>
    </form>
  );
};

export default PersonalInfoForm;