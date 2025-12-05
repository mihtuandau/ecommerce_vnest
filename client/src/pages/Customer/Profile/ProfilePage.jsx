import { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import Layout from '../../../components/layouts/Layout';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { User, Mail, Phone, MapPin, Edit2, Save, X, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
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
      newErrors.name = 'Tên là bắt buộc';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
    });
    setErrors({});
    setIsEditing(false);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thông tin tài khoản
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                    {/* <User className="w-12 h-12 text-white" /> */}
                    <img src="../" alt="" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {currentUser?.name}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    {currentUser?.email}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {currentUser?.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
                  </span>
                  {currentUser?.role === 'ADMIN' && (
                    <Button
                      onClick={() => navigate('/admin-dashboard')}
                      variant="primary"
                      icon={BarChart3}
                      className="mt-4 w-full flex items-center justify-center gap-2"
                    >
                      Vào Dashboard
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      icon={Edit2}
                      className="flex items-center gap-2"
                    >
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <button
                      onClick={handleCancel}
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    >
                      <X size={20} />
                      Hủy
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Họ và tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    icon={User}
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
                    icon={Mail}
                    disabled={!isEditing}
                    required
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Để quản lý địa chỉ và số điện thoại, vui lòng sử dụng tính năng Quản lý địa chỉ.
                    </p>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        icon={Save}
                        className="flex-1"
                      >
                        Lưu thay đổi
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                    </div>
                  )}
                </form>
              </div>

              {/* Change Password Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Bảo mật
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mật khẩu</p>
                    <p className="text-sm text-gray-500">
                      Thay đổi mật khẩu của bạn
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.href = '/change-password'}
                    variant="outline"
                  >
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
