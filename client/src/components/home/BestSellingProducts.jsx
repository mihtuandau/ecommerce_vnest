import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { notify } from '../../utils/notification';
import wishlistService from '../../services/wishlistService';

const BestSellingProducts = ({ products = [] }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  const featuredProduct = products[0];
  const gridProducts = products.slice(1, 5);

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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const variants = product.variants || [];
    
    // Nếu không có variant hoặc có nhiều hơn 1 variant → vào trang chi tiết để chọn
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

    // Chỉ có 1 variant → thêm trực tiếp
    const variant = variants[0];
    addToCart(variant.id, 1, {
      name: product.name,
      image: product.images?.[0]?.url,
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
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block">Xu hướng</span>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">SẢN PHẨM BÁN CHẠY</h2>
          <div className="w-12 h-px bg-gray-900 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div 
            className="relative group overflow-hidden bg-gray-50 h-[500px] lg:h-[600px] cursor-pointer"
            onMouseEnter={() => setHoveredProduct(featuredProduct.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => navigate(`/products/${featuredProduct.id}`)}
          >
            <img
              src={featuredProduct.images?.[0]?.url || '/placeholder-product.jpg'}
              alt={featuredProduct.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
              
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            {getDiscountPercent(featuredProduct) > 0 && (
              <span className="absolute top-4 left-4 bg-white text-gray-900 px-3 py-1 text-xs uppercase tracking-wide pointer-events-none">
                -{getDiscountPercent(featuredProduct)}%
              </span>
            )}
            <span className="absolute top-4 right-4 bg-[#1a1a1a] text-white px-3 py-1 text-xs uppercase tracking-wide pointer-events-none">
              Best Seller
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-gray-300 mb-2">
                  {featuredProduct.category?.name || 'Thời trang'}
                </p>
                <h3 className="text-xl font-light mb-3 line-clamp-2">
                  {featuredProduct.name}
                </h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getDiscountPercent(featuredProduct) > 0 ? (
                    <>
                      <span className="text-2xl font-light">{formatPrice(getLowestPrice(featuredProduct))}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(featuredProduct.originalPrice || featuredProduct.price)}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-light">{formatPrice(getLowestPrice(featuredProduct))}</span>
                  )}
                </div>
              </div>
            </div>
              
            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button 
                onClick={(e) => handleAddToCart(e, featuredProduct)}
                className="h-11 px-5 !bg-white !text-[#1a1a1a] text-xs uppercase tracking-wider hover:!bg-gray-100 transition-colors inline-flex items-center justify-center gap-2 pointer-events-auto"
              >
                <FaShoppingCart className="!text-[#1a1a1a] text-sm" />
                <span className="!text-[#1a1a1a]">Thêm giỏ hàng</span>
              </button>
              <button 
                onClick={(e) => handleWishlistToggle(e, featuredProduct)}
                className={`h-11 w-11 flex items-center justify-center transition-colors pointer-events-auto ${
                  wishlistIds.includes(featuredProduct.variants?.[0]?.id)
                    ? '!bg-red-500 !text-white hover:!bg-red-600'
                    : '!bg-white !text-[#1a1a1a] hover:!bg-gray-100'
                }`}
              >
                <FaHeart className="text-sm" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gridProducts.map((product, index) => (
              <div 
                key={product.id}
                className="relative group overflow-hidden bg-gray-50 h-[240px] lg:h-[290px] cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <img
                  src={product.images?.[0]?.url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                  
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                {getDiscountPercent(product) > 0 && (
                  <span className="absolute top-3 left-3 bg-white text-gray-900 px-2 py-1 text-[10px] uppercase tracking-wide pointer-events-none">
                    -{getDiscountPercent(product)}%
                  </span>
                )}

                <span className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#1a1a1a] text-white text-xs font-medium pointer-events-none">
                  {index + 2}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                  <h3 className="text-sm font-light text-white mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {getDiscountPercent(product) > 0 ? (
                      <>
                        <span className="text-white font-light">{formatPrice(getLowestPrice(product))}</span>
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice || product.price)}</span>
                      </>
                    ) : (
                      <span className="text-white font-light">{formatPrice(getLowestPrice(product))}</span>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#1a1a1a] hover:bg-gray-100 transition-colors pointer-events-auto"
                  >
                    <FaShoppingCart className="text-sm" />
                  </button>
                  <button 
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className={`w-10 h-10 flex items-center justify-center transition-colors pointer-events-auto ${
                      wishlistIds.includes(product.variants?.[0]?.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-white text-[#1a1a1a] hover:bg-gray-100'
                    }`}
                  >
                    <FaHeart className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center mt-12">
          <Link 
            to="/products/bestselling" 
            className="inline-block px-10 py-4 border border-[#1a1a1a] text-[#1a1a1a] text-xs uppercase tracking-wider hover:bg-[#1a1a1a] hover:text-white transition-all"
          >
            Xem tất cả sản phẩm bán chạy
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
