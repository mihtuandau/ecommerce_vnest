import React, { useState, useEffect } from 'react';
import { Empty, Spin, Modal } from 'antd';
import { HeartOutlined, DeleteOutlined, ShoppingCartOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';
import Breadcrumb from '../../components/common/Breadcrumb';
import Layout from '../../components/layouts/Layout';
import PageTitle from '../../components/common/PageTitle';

const { confirm } = Modal;

const WishlistPage = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-white pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb items={[{ label: 'Sản phẩm yêu thích' }]} />

          {/* Header */}
          <PageTitle
            subtitle="Danh sách"
            title="SẢN PHẨM YÊU THÍCH"
            count={wishlistItems.length}
            countLabel="sản phẩm"
            className="mt-6"
          />
          
          {wishlistItems.length > 0 && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-300 hover:bg-red-50 transition-colors"
              >
                <DeleteOutlined />
                Xóa tất cả
              </button>
            </div>
          )}

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="flex flex-col justify-center items-center min-h-[400px]">
              <HeartOutlined className="text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-6">Chưa có sản phẩm yêu thích</p>
              <Link to="/products">
                <button className="px-8 py-3 bg-[#1a1a1a] text-white text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
                  Khám Phá Sản Phẩm
                </button>
              </Link>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistItems.map((item) => {
                const product = item.variant?.product;
                const variant = item.variant;
                
                if (!product || !variant) return null;
                
                const productId = product.id;
                const thumbnail = variant?.images?.find(img => img.isThumbnail) 
                  || variant?.images?.[0] 
                  || { url: product?.category?.image };
                
                return (
                  <div key={item.id} className="group relative bg-white border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full">
                    {/* Variant Badge */}
                    {(variant.color || variant.size) && (
                      <div className="absolute top-3 left-3 z-10 flex gap-1">
                        {variant.color && (
                          <span className="px-2 py-1 text-xs font-normal bg-gray-100 text-gray-700">
                            {variant.color}
                          </span>
                        )}
                        {variant.size && (
                          <span className="px-2 py-1 text-xs font-normal bg-gray-100 text-gray-700">
                            {variant.size}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.variantId);
                        }}
                        className="p-1.5 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        <DeleteOutlined className="text-red-500 text-xs" />
                      </button>
                    </div>
                    
                    {/* Product Image */}
                    <div 
                      className="block relative overflow-hidden w-full aspect-square bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/products/${productId}`)}
                    >
                      <img
                        src={thumbnail?.url || '/placeholder.png'}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex flex-col flex-grow p-3">
                      {/* Product Name */}
                      <div 
                        className="block mb-3 cursor-pointer"
                        onClick={() => navigate(`/products/${productId}`)}
                      >
                        <h3 
                          className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors line-clamp-2 min-h-[2rem]" 
                          title={product.name}
                        >
                          {product.name || 'Sản phẩm'}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-3 min-h-[20px]">
                        <span className="text-base font-bold text-gray-900">
                          {variant.price ? variant.price.toLocaleString('vi-VN') : '0'}₫
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;