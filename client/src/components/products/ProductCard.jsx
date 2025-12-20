import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHeart, FaEye } from 'react-icons/fa';
import { notify } from '../../utils/notification';
import StarRating from '../common/StarRating';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters';
import wishlistService from '../../services/wishlistService';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product, viewMode = 'grid-3' }) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const {
    id,
    name,
    price,
    basePrice,
    originalPrice,
    image,
    images,
    badge,
    discount,
  } = product;

  const isGrid2 = viewMode === 'grid-2';
  const isList = viewMode === 'list';
  const isGrid = !isGrid2 && !isList;
  const titleClass = isGrid2 ? 'text-xl font-medium' : isGrid ? 'font-medium text-base' : 'font-medium text-lg';
  const priceClass = isGrid2 ? 'text-lg font-bold text-gray-900' : isGrid ? 'text-lg font-bold text-gray-900' : 'text-xl font-bold text-gray-900';
  const originalPriceClass = isGrid2 ? 'text-sm' : isGrid ? 'text-sm' : 'text-sm';
  const ratingSize = isGrid2 ? 11 : isGrid ? 12 : 13;
  const soldTextClass = isGrid2 ? 'text-sm' : isGrid ? 'text-sm' : 'text-sm';
  
  // Thêm các class cho padding dựa trên view mode
  const containerClass = isGrid2 ? 'p-4' : isGrid ? 'p-4' : 'p-6';
  const imageAspectClass = isGrid2 ? 'aspect-square' : isGrid ? 'aspect-square' : 'aspect-square';
  const minHeightTitle = isGrid2 ? 'min-h-[3rem]' : isGrid ? 'min-h-[2.5rem]' : '';
  const minHeightRating = isGrid2 ? 'min-h-[24px]' : isGrid ? 'min-h-[20px]' : 'min-h-[18px]';
  const minHeightPrice = isGrid2 ? 'min-h-[28px]' : isGrid ? 'min-h-[24px]' : 'min-h-[20px]';

  const productImage = image || (images && images.length > 0 ? images[0].url : '/placeholder-product.jpg');
  
  const getLowestPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : (basePrice || price || 0);
    }
    return basePrice || price || 0;
  };
  
  const productPrice = getLowestPrice();
  const productOriginalPrice = originalPrice;
  const discountPercent = calculateDiscountPercent(productOriginalPrice, productPrice) || discount || 0;
  const variantId = product.variants?.[0]?.id;

  useEffect(() => {
    if (user && variantId) {
      wishlistService.checkWishlist(variantId).then(({ isInWishlist }) => {
        setIsInWishlist(isInWishlist);
      }).catch(() => {});
    }
  }, [user, variantId]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      notify.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    if (!variantId) {
      notify.error('Không tìm thấy sản phẩm');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(variantId);
        setIsInWishlist(false);
        notify.success('Đã xóa khỏi danh sách yêu thích');
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } else {
        await wishlistService.addToWishlist(variantId);
        setIsInWishlist(true);
        notify.success('Đã thêm vào danh sách yêu thích');
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    } catch (error) {
      notify.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className={`group relative bg-white border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full ${isList ? 'flex-row min-h-[280px]' : ''}`}>
      {/* Badge */}
      {(badge || discountPercent > 0) && (
        <div className={`absolute top-3 left-3 z-10 ${isList ? 'top-2 left-2' : ''}`}>
          <span className={`px-2.5 py-1 text-xs font-normal bg-gray-900 text-white ${isList ? 'px-2 py-0.5 text-[10px]' : ''}`}>
            {badge || `-${discountPercent}%`}
          </span>
        </div>
      )}

      {/* Quick Actions - Ẩn trong list view */}
      {!isList && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistToggle}
            className={`p-2 border transition-colors ${
              isInWishlist 
                ? 'bg-gray-900 text-white border-gray-900' 
                : 'bg-white border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900'
            } ${isGrid2 ? 'p-2' : 'p-1.5'}`}
            aria-label="Yêu thích"
          >
            <FaHeart size={isGrid2 ? 14 : 12} />
          </button>
          <Link 
            to={`/products/${id}`}
            className={`p-2 bg-white border border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors ${isGrid2 ? 'p-2' : 'p-1.5'}`}
            aria-label="Xem nhanh"
          >
            <FaEye size={isGrid2 ? 14 : 12} />
          </Link>
        </div>
      )}

      {/* Product Image */}
      <Link 
        to={`/products/${id}`} 
        className={`block relative overflow-hidden ${isList ? 'w-2/5' : 'w-full'} ${imageAspectClass} bg-gray-50`}
      >
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Info */}
      <div className={`flex flex-col ${isList ? 'justify-center' : 'flex-grow'} ${containerClass} ${isList ? 'w-3/5' : ''}`}>
        {/* Product Name */}
        <Link to={`/products/${id}`} className={`block ${isList ? 'mb-5' : 'mb-3'}`}>
          <h3 
            className={`${titleClass} text-gray-900 hover:text-gray-600 transition-colors ${isList ? 'line-clamp-2 leading-normal' : 'line-clamp-2'} ${minHeightTitle}`} 
            title={name}
          >
            {name}
          </h3>
        </Link>

        {/* Rating & Sold Count */}
        <div className={`flex items-center ${isList ? 'gap-6 mb-5' : 'justify-between gap-2 mb-3 flex-wrap'} ${minHeightRating}`}>
          <StarRating
            rating={product.averageRating || 0}
            size={ratingSize}
            showNumber={true}
            reviewCount={product.reviewCount || 0}
          />
          <span className={`${soldTextClass} font-light text-gray-500`}>
            Đã bán {product.soldCount || product.sold || 0}
          </span>
        </div>

        {/* Price */}
        <div className={`flex items-baseline gap-3 ${isList ? 'mb-6' : 'flex-wrap'} ${minHeightPrice}`}>
          <span className={priceClass}>
            {formatPrice(productPrice)}
          </span>
          {productOriginalPrice && productOriginalPrice > productPrice ? (
            <span className={`${originalPriceClass} font-light text-gray-400 line-through`}>
              {formatPrice(productOriginalPrice)}
            </span>
          ) : (
            !isList && <span className={`${originalPriceClass} invisible`}>000.000 ₫</span>
          )}
        </div>

        {/* Wishlist button for list view */}
        {isList && (
          <div className="pt-6 border-t border-gray-100">
            <button  
              onClick={handleWishlistToggle}
              className={`p-2 border transition-colors flex items-center gap-2.5 text-sm font-light bg-white border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900${
                isInWishlist 
                  ? 'text-gray-900 hover:text-gray-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FaHeart size={14} className={isInWishlist ? 'fill-current' : ''} />
              {isInWishlist ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;