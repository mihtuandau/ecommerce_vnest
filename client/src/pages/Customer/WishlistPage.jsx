import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';
import Breadcrumb from '../../components/common/Breadcrumb';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();setWishlistItems(data || []);
    } catch (error) {notify.error('Không thể tải danh sách yêu thích');
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
      // Trigger event to update header
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
      // Trigger event to update header
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      notify.error('Không thể xóa danh sách');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 lg:px-30 pt-21 pb-8">
        <Breadcrumb items={[{ label: 'Sản phẩm yêu thích' }]} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Sản phẩm yêu thích
            </h1>
            <p className="text-sm text-gray-600">{wishlistItems.length} sản phẩm</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
            >
              <FaTrash size={14} />
              Xóa tất cả
            </button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FaHeart className="text-gray-400" size={36} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có sản phẩm yêu thích
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Lưu lại những sản phẩm bạn quan tâm để dễ dàng theo dõi và mua sắm sau
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {wishlistItems.map((item) => {
              const thumbnail = item.variant?.images?.find(img => img.isThumbnail) 
                || item.variant?.images?.[0] 
                || { url: item.variant?.product?.category?.image };
              
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:border-gray-300 transition-all">
                  <Link to={`/product/${item.variant.product.id}`} className="block relative">
                    <div className="aspect-square overflow-hidden bg-gray-50">
                      <img
                        src={thumbnail?.url || '/placeholder.png'}
                        alt={item.variant.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${item.variant.product.id}`}>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 hover:text-gray-600 transition-colors">
                        {item.variant.product.name}
                      </h3>
                    </Link>

                    {(item.variant.color || item.variant.size) && (
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        {item.variant.color && (
                          <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                            {item.variant.color}
                          </span>
                        )}
                        {item.variant.size && (
                          <span className="px-2 py-1 bg-gray-50 rounded border border-gray-200">
                            {item.variant.size}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {item.variant.price.toLocaleString('vi-VN')}₫
                      </span>
                      <button
                        onClick={() => handleRemove(item.variantId)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <Link
                      to={`/product/${item.variant.product.id}`}
                      className="block w-full py-2.5 bg-gray-900 text-white text-sm font-medium text-center rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
