import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, Avatar, Tag, Spin, Empty, Divider, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, EnvironmentOutlined, IdcardOutlined } from '@ant-design/icons';
import authService from '../../../services/authService';
import userService from '../../../services/userService';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import PageTitle from '../../../components/common/PageTitle';
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
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Spin size="large" tip="Đang tải..." />
        </div>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Empty description="Vui lòng đăng nhập" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb items={[
            { label: 'Thông tin tài khoản' }
          ]} />

          {/* Header */}
          <PageTitle
            subtitle="Tài khoản"
            title="THÔNG TIN CÁ NHÂN"
            className="mt-6"
          />

          <Card className="mb-8 shadow-sm">
            <div className="flex items-center gap-6">
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#00a85a' }}
              >
                {currentUser.name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentUser.name || 'Người dùng'}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>
          </Card>

          <Row gutter={[32, 32]} className="mt-6">
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <UserOutlined />
                    <span>Thông Tin Cá Nhân</span>
                  </div>
                }
                bordered={false}
                className="shadow-sm h-full"
              >
                <PersonalInfoForm
                  currentUser={currentUser}
                  onSubmit={handleUpdateProfile}
                  loading={loading}
                />
              </Card>
            </Col>

            {/* Change Password Card */}
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <LockOutlined />
                    <span>Đổi Mật Khẩu</span>
                  </div>
                }
                bordered={false}
                className="shadow-sm h-full"
              >
                <ChangePasswordForm />
              </Card>
            </Col>

            {/* Address Manager Card */}
            <Col xs={24} lg={8}>
              <Card 
                title={
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    <span>Địa Chỉ Giao Hàng</span>
                  </div>
                }
                bordered={false}
                className="shadow-sm h-full"
              >
                <AddressManager />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;