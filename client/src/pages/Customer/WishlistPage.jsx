import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';
import Breadcrumb from '../../components/common/Breadcrumb';
import Layout from '../../components/layouts/Layout';

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
    if (!window.confirm('Bạn có chắc muốn xóa tất cả sản phẩm yêu thích?')) return;
    
    try {
      await wishlistService.clearWishlist();
      setWishlistItems([]);
      notify.success('Đã xóa tất cả sản phẩm yêu thích');
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      notify.error('Không thể xóa danh sách');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 lg:px-8 pt-6 pb-8">
          <Breadcrumb items={[{ label: 'Sản phẩm yêu thích' }]} />

          {/* Header */}
          <div className="border-b border-gray-200 pb-8 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2 tracking-tight">
                  Sản Phẩm Yêu Thích
                </h1>
                <p className="text-sm text-gray-600 font-light">
                  {wishlistItems.length} sản phẩm
                </p>
              </div>
              {wishlistItems.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 font-light"
                >
                  <FaTrash size={12} />
                  Xóa tất cả
                </button>
              )}
            </div>
          </div>

          {/* Empty State */}
          {wishlistItems.length === 0 ? (
            <div className="border border-gray-200 p-12 md:p-20 text-center">
              <div className="w-20 h-20 mx-auto mb-6 border border-gray-300 flex items-center justify-center">
                <FaHeart className="text-gray-400" size={32} />
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-3 tracking-tight">
                Chưa Có Sản Phẩm Yêu Thích
              </h2>
              <p className="text-gray-600 font-light mb-8 max-w-md mx-auto leading-relaxed">
                Lưu lại những sản phẩm bạn quan tâm để dễ dàng theo dõi và mua sắm sau
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-normal hover:bg-gray-800 transition-colors"
              >
                Khám Phá Sản Phẩm
              </Link>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div 
                    key={item.id} 
                    className="bg-white border border-gray-200 overflow-hidden group"
                  >
                    {/* Product Image */}
                    <Link to={`/products/${productId}`} className="block relative">
                      <div className="aspect-square overflow-hidden bg-gray-50">
                        <img
                          src={thumbnail?.url || '/placeholder.png'}
                          alt={product.name || 'Product'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4">
                      <Link to={`/products/${productId}`}>
                        <h3 className="font-normal text-gray-900 mb-3 line-clamp-2 hover:text-gray-600 transition-colors min-h-[3rem]">
                          {product.name || 'Sản phẩm'}
                        </h3>
                      </Link>

                      {/* Variant Info */}
                      {(variant.color || variant.size) && (
                        <div className="flex items-center gap-2 mb-4 text-xs">
                          {variant.color && (
                            <span className="px-2 py-1 border border-gray-300 text-gray-700">
                              {variant.color}
                            </span>
                          )}
                          {variant.size && (
                            <span className="px-2 py-1 border border-gray-300 text-gray-700">
                              {variant.size}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Price & Remove */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-normal text-gray-900">
                          {variant.price ? variant.price.toLocaleString('vi-VN') : '0'}₫
                        </span>
                        <button
                          onClick={() => handleRemove(item.variantId)}
                          className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                          title="Xóa"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>

                      {/* View Details Button */}
                      <Link
                        to={`/products/${productId}`}
                        className="block w-full py-3 bg-gray-900 text-white text-sm font-normal text-center hover:bg-gray-800 transition-colors"
                      >
                        Xem Chi Tiết
                      </Link>
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