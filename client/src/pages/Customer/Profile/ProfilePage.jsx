import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import authService from '../../../services/authService';
import userService from '../../../services/userService';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PersonalInfoForm from '../../../components/profile/PersonalInfoForm';
import AddressManager from '../../../components/profile/AddressManager';
import ChangePasswordForm from '../../../components/profile/ChangePasswordForm';
import { notify } from '../../../utils/notification';

const ProfilePage = () => {
  const { user: currentUser, loading: authLoading, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (formData) => {
    setLoading(true);
    try {
      const response = await userService.updateProfile(formData);
      await refreshUser();
      notify.success('Cập nhật thành công');
      return true;
    } catch (error) {
      notify.error(error.response?.data?.message || 'Có lỗi xảy ra');
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
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Thông tin tài khoản' }
          ]} />

          {/* Header - Minimalist */}
          <div className="border-b border-gray-200 pb-8 mb-12 ">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 border-2 border-gray-900 flex items-center justify-center text-white text-3xl font-light bg-gray-900 rounded-full">
                {currentUser.name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1 ">
                <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
                  {currentUser.name || 'Người dùng'}
                </h1>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 text-sm ${
                  currentUser.role === 'ADMIN' 
                    ? 'border border-gray-900 text-gray-900' 
                    : 'border border-gray-400 text-gray-700'
                }`}>
                  {currentUser.role === 'ADMIN' ? 'Admin' : 'Khách hàng'}
                </span>
                <p className="text-xs text-gray-500 mt-2">ID:{currentUser.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Info Card */}
            <div className="bg-white border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-normal text-gray-900 mb-1">Thông Tin Cá Nhân</h2>
                <p className="text-sm text-gray-600">Cập nhật thông tin của bạn</p>
              </div>
              <div className="p-6">
                <PersonalInfoForm
                  currentUser={currentUser}
                  onSubmit={handleUpdateProfile}
                  loading={loading}
                />
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-normal text-gray-900 mb-1">Đổi Mật Khẩu</h2>
                <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
              </div>
              <div className="p-6">
                <ChangePasswordForm />
              </div>
            </div>
            <div className="bg-white border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="text-lg font-normal text-gray-900 mb-1">Địa Chỉ Giao Hàng</h2>
                <p className="text-sm text-gray-600">Quản lý địa chỉ nhận hàng</p>
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