import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Avatar, Tag, Spin, Empty, Divider, Row, Col, Tabs, Rate } from 'antd';
import { UserOutlined, LockOutlined, EnvironmentOutlined, StarOutlined } from '@ant-design/icons';
import authService from '../../../services/authService';
import userService from '../../../services/userService';
import reviewService from '../../../services/reviewService';
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
  const [myReviews, setMyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchMyReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await reviewService.getMyReviews();
      setMyReviews(res.data || res || []);
    } catch {
      setMyReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

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
          <Spin size="large" />
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
      <div className="min-h-screen bg-white pb-12 text-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="py-2">
            <Breadcrumb items={[
              { label: 'Thông tin tài khoản' }
            ]} />
          </div>

          <div className="mt-8">
            <Card className="mb-8 shadow-sm">
            <div className="flex items-center gap-6">
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1e293b' }}
              >
                {currentUser.name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase()}
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-800 mb-1">
                  {currentUser.name || 'Người dùng'}
                </h2>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>
          </Card>

          <Tabs
            defaultActiveKey="info"
            className="mt-6"
            onChange={(key) => { if (key === 'reviews') fetchMyReviews(); }}
            items={[
              {
                key: 'info',
                label: <span><UserOutlined className="mr-1" />Thông Tin</span>,
                children: (
                  <Row gutter={[32, 32]}>
                    <Col xs={24} lg={12}>
                      <Card title={<span><UserOutlined className="mr-2" />Thông Tin Cá Nhân</span>} bordered={false} className="shadow-sm">
                        <PersonalInfoForm currentUser={currentUser} onSubmit={handleUpdateProfile} loading={loading} />
                      </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                      <Card title={<span><LockOutlined className="mr-2" />Đổi Mật Khẩu</span>} bordered={false} className="shadow-sm">
                        <ChangePasswordForm />
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                key: 'address',
                label: <span><EnvironmentOutlined className="mr-1" />Địa Chỉ</span>,
                children: (
                  <Card title={<span><EnvironmentOutlined className="mr-2" />Địa Chỉ Giao Hàng</span>} bordered={false} className="shadow-sm">
                    <AddressManager />
                  </Card>
                ),
              },
              {
                key: 'reviews',
                label: <span><StarOutlined className="mr-1" />Đánh Giá Của Tôi</span>,
                children: (
                  <Card bordered={false} className="shadow-sm">
                    {reviewsLoading ? (
                      <div className="flex justify-center py-10"><Spin /></div>
                    ) : myReviews.length === 0 ? (
                      <Empty description="Bạn chưa có đánh giá nào" />
                    ) : (
                      <div className="space-y-4">
                        {myReviews.map((review) => (
                          <div key={review.id} className="border border-gray-100 p-4 hover:border-gray-200 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <Link
                                  to={`/products/${review.productId}`}
                                  className="text-sm font-medium text-slate-800 hover:text-slate-800 transition-colors line-clamp-1"
                                >
                                  {review.product?.name || `Sản phẩm #${review.productId}`}
                                </Link>
                                <Rate disabled value={review.rating} className="text-xs mt-1" />
                                {review.comment && (
                                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                              {review.product?.images?.[0]?.url && (
                                <img
                                  src={review.product.images[0].url}
                                  alt={review.product.name}
                                  className="w-16 h-16 object-cover flex-shrink-0 border border-gray-100"
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  </Layout>
  );
};

export default ProfilePage;





