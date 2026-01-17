import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';

const FeaturedProducts = ({ products = [] }) => {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 8);

  const formatPrice = (price) => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLowestPrice = (product) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : (product.basePrice || product.price || 0);
    }
    return product.basePrice || product.price || 0;
  };

  const getDiscountPercent = (product) => {
    const currentPrice = getLowestPrice(product);
    const originalPrice = product.originalPrice || product.price;
    if (originalPrice && currentPrice && originalPrice > currentPrice) {
      return Math.round((1 - currentPrice / originalPrice) * 100);
    }
    return product.discount || 0;
  };

  const getAverageRating = (product) => {
    return product.averageRating || product.rating || 4.5;
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variants = product.variants || [];
    
    if (variants.length === 0) {
      notify.info('Vui lòng chọn biến thể sản phẩm');
      navigate(`/products/${product.id}`);
      return;
    }
    
    if (variants.length > 1) {
      notify.info('Vui lòng chọn size và màu');
      navigate(`/products/${product.id}`);
      return;
    }

    const variant = variants[0];
    // Ưu tiên lấy ảnh từ variant, nếu không có thì lấy từ product
    const variantImage = variant.image || variant.images?.[0]?.url || product.images?.[0]?.url;
    
    addToCart(variant.id, 1, {
      name: product.name,
      image: variantImage,
      price: variant.price,
      size: variant.size,
      color: variant.color,
    });
    notify.success('Đã thêm vào giỏ hàng');
  };

  const handleWishlistToggle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      notify.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    const variantId = product.variants?.[0]?.id;
    if (!variantId) {
      notify.error('Không tìm thấy sản phẩm');
      return;
    }

    try {
      const isInWishlist = wishlistIds.includes(variantId);
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(variantId);
        setWishlistIds(prev => prev.filter(id => id !== variantId));
        notify.success('Đã xóa khỏi yêu thích');
      } else {
        await wishlistService.addToWishlist(variantId);
        setWishlistIds(prev => [...prev, variantId]);
        notify.success('Đã thêm vào yêu thích');
      }
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (error) {
      notify.error('Có lỗi xảy ra');
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header - Đồng bộ style */}
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block">Đánh giá cao</span>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">SẢN PHẨM NỔI BẬT</h2>
          <div className="w-12 h-px bg-gray-900 mx-auto"></div>
        </div>

        {/* Products Grid - 4 columns với card style khác */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Second Image on Hover */}
                {product.images?.[1] && (
                  <img
                    src={product.images[1].url}
                    alt={product.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      hoveredId === product.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {getDiscountPercent(product) > 0 && (
                    <span className="bg-[#1a1a1a] text-white px-2 py-1 text-[10px] uppercase tracking-wider">
                      -{getDiscountPercent(product)}%
                    </span>
                  )}
                  {index < 4 && (
                    <span className="bg-amber-500 text-white px-2 py-1 text-[10px] uppercase tracking-wider">
                      Top Rated
                    </span>
                  )}
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-1">
                  <FaStar className="text-amber-400 text-[10px]" />
                  <span className="text-[11px] font-medium">{getAverageRating(product).toFixed(1)}</span>
                </div>

                {/* Action Buttons */}
                <div className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
                  hoveredId === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex-1 h-10 bg-white text-gray-900 hover:!bg-[#1a1a1a] hover:!text-white text-[11px] uppercase tracking-wider font-medium transition-all duration-300 flex items-center justify-center gap-2 [&>*]:hover:!text-white"
                  >
                    <ShoppingBag size={14} className="transition-colors duration-300" />
                    <span className="transition-colors duration-300">Thêm giỏ</span>
                  </button>
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className={`h-10 w-10 flex items-center justify-center transition-all duration-300 ${
                      wishlistIds.includes(product.variants?.[0]?.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-gray-900 hover:!bg-red-500 hover:!text-white'
                    }`}
                  >
                    <FaHeart size={14} />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
                  {product.category?.name || 'Thời trang'}
                </p>
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-1 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {formatPrice(getLowestPrice(product))}
                  </span>
                  {getDiscountPercent(product) > 0 && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice || product.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14">
          <Link
            to="/products/featured"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white text-xs uppercase tracking-wider transition-colors group"
          >
            <span>Xem Tất Cả Sản Phẩm Nổi Bật</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
