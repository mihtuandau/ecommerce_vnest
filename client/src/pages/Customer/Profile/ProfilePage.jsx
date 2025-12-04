import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import authService from '../../../services/authService';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import PersonalInfoForm from '../../../components/customer/PersonalInfoForm';
import AddressManager from '../../../components/customer/AddressManager';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (formData) => {
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Cập nhật thành công');
      return true;
    } catch (error) {
      toast.error('Có lỗi xảy ra');
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Vui lòng đăng nhập</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black">Thông tin tài khoản</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info Card */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-black">Thông tin cá nhân</h2>
                  <div className="text-sm text-gray-500">
                    ID: #{currentUser.id}
                  </div>
                </div>
                
                <PersonalInfoForm
                  currentUser={currentUser}
                  onSubmit={handleUpdateProfile}
                  loading={loading}
                />
              </div>

              {/* Address Manager */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-black mb-6">Địa chỉ giao hàng</h2>
                <AddressManager userId={currentUser.id} />
              </div>
            </div>

            {/* Right Column - Account Info */}
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-black mb-4">Tóm tắt tài khoản</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Vai trò</p>
                    <p className="font-medium">{currentUser.role === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email xác thực</p>
                    <p className="font-medium">{currentUser.email ? 'Đã xác thực' : 'Chưa xác thực'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-black mb-4">Truy cập nhanh</h3>
                <div className="space-y-2">
                  <a href="/orders" className="block p-3 border border-gray-200 rounded hover:bg-gray-50">
                    Đơn hàng của tôi
                  </a>
                  <a href="/change-password" className="block p-3 border border-gray-200 rounded hover:bg-gray-50">
                    Đổi mật khẩu
                  </a>
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