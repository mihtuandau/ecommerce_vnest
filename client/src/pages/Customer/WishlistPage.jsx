import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, Spin, Modal, Row, Col, Badge, Space } from 'antd';
import { HeartOutlined, DeleteOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';
import Breadcrumb from '../../components/common/Breadcrumb';
import Layout from '../../components/layouts/Layout';

const { confirm } = Modal;

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setWishlistItems(data || []);
    } catch (error) {
      notify.error('Không thể tải danh sách yêu thích');
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (variantId) => {
    try {
      await wishlistService.removeFromWishlist(variantId);
      setWishlistItems(wishlistItems.filter(item => item.variantId !== variantId));
      notify.success('Đã xóa khỏi danh sách yêu thích');
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      notify.error('Không thể xóa sản phẩm');
    }
  };

  const handleClearAll = async () => {
    confirm({
      title: 'Xác nhận xóa tất cả',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?',
      okText: 'Xóa tất cả',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          await wishlistService.clearWishlist();
          setWishlistItems([]);
          notify.success('Đã xóa tất cả sản phẩm yêu thích');
          window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        } catch (error) {
          notify.error('Không thể xóa danh sách');
        }
      },
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" tip="Đang tải..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          <Breadcrumb items={[{ label: 'Sản phẩm yêu thích' }]} />

          <div className="flex justify-between items-center pt-4 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">SẢN PHẨM YÊU THÍCH</h1>
            {wishlistItems.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearAll}
              >
                Xóa tất cả
              </Button>
            )}
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Empty
                description="Chưa có sản phẩm yêu thích"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Link to="/products">
                  <Button type="primary" icon={<ShoppingCartOutlined />} style={{ backgroundColor: '#00a85a', borderColor: '#00a85a' }}>
                    Khám Phá Sản Phẩm
                  </Button>
                </Link>
              </Empty>
            </div>
          ) : (
            /* Product Grid */
            <Row gutter={[24, 24]}>
              {wishlistItems.map((item) => {
                // Kiểm tra dữ liệu trước khi sử dụng
                const product = item.variant?.product;
                const variant = item.variant;
                
                if (!product || !variant) return null; // Bỏ qua item bị lỗi
                
                const productId = product.id;
                const thumbnail = variant?.images?.find(img => img.isThumbnail) 
                  || variant?.images?.[0] 
                  || { url: product?.category?.image };
                
                return (
                  <Col xs={24} sm={12} lg={8} xl={6} key={item.id}>
                    <Card
                      hoverable
                      cover={
                        <Link to={`/products/${productId}`}>
                          <div className="aspect-square overflow-hidden bg-gray-50">
                            <img
                              src={thumbnail?.url || '/placeholder.png'}
                              alt={product.name || 'Product'}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        </Link>
                      }
                      actions={[
                        <Link to={`/products/${productId}`} key="view">
                          <Button type="primary" block style={{ backgroundColor: '#00a85a', borderColor: '#00a85a' }}>
                            Xem Chi Tiết
                          </Button>
                        </Link>,
                      ]}
                    >
                      <Card.Meta
                        title={
                          <Link to={`/products/${productId}`} className="hover:text-[#00a85a]">
                            {product.name || 'Sản phẩm'}
                          </Link>
                        }
                        description={
                          <Space direction="vertical" className="w-full">
                            {(variant.color || variant.size) && (
                              <Space>
                                {variant.color && <Badge color="blue" text={variant.color} />}
                                {variant.size && <Badge color="green" text={variant.size} />}
                              </Space>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-[#00a85a]">
                                {variant.price ? variant.price.toLocaleString('vi-VN') : '0'}₫
                              </span>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleRemove(item.variantId)}
                              />
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;