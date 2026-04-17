import { useState } from 'react';

export const useUserForm = (initialData = null) => {
  const [formData, setFormData] = useState(initialData || {
    email: '',
    password: '',
    name: '',
    role: 'CUSTOMER',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!initialData && !formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password && formData.password.trim().length > 0 && formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const reset = () => {
    setFormData(initialData || {
      email: '',
      password: '',
      name: '',
      role: 'CUSTOMER',
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    validate,
    handleChange,
    reset,
    setFormData,
  };
};