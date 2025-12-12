import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import PersonalInfoForm from '../../../components/customer/PersonalInfoForm';
import AddressManager from '../../../components/customer/AddressManager';
import { notify } from '../../../utils/notification';

const ProfilePage = () => {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (formData) => {
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      notify.success('Cập nhật thành công');
      return true;
    } catch (error) {
      notify.error('Có lỗi xảy ra');
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-gray-900 transition-colors">Trang chủ</a>
            <span>›</span>
            <span className="text-gray-900 font-medium">Thông tin tài khoản</span>
          </nav>

          {/* Header với Avatar */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {currentUser.name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{currentUser.name || 'Người dùng'}</h1>
                <p className="text-gray-600 text-sm mt-1">{currentUser.email}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  currentUser.role === 'ADMIN' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {currentUser.role === 'ADMIN' ? '👑 Admin' : '👤 Khách hàng'}
                </span>
                <p className="text-xs text-gray-500 mt-1">ID: #{currentUser.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h2>
                <p className="text-sm text-gray-600 mt-1">Cập nhật thông tin của bạn</p>
              </div>
              <div className="p-6">
                <PersonalInfoForm
                  currentUser={currentUser}
                  onSubmit={handleUpdateProfile}
                  loading={loading}
                />
              </div>
            </div>

            {/* Address Manager Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900">Địa chỉ giao hàng</h2>
                <p className="text-sm text-gray-600 mt-1">Quản lý địa chỉ nhận hàng</p>
              </div>
              <div className="p-6">
                <AddressManager />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;