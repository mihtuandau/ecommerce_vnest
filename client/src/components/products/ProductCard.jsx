import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { FaHeart, FaEye } from 'react-icons/fa';

const formatViewCount = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};
import { notify } from '../../utils/notification';
import StarRating from '../common/StarRating';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters';
import wishlistService from '../../services/wishlistService';
import { useAuth } from '../../hooks/useAuth';

const ProductCard = ({ product, viewMode = 'grid-4' }) => {
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

  const isGrid4 = viewMode === 'grid-4';
  const isGrid3 = viewMode === 'grid-3';
  const isGrid2 = viewMode === 'grid-2';
  const isGrid1 = viewMode === 'grid-1';
  const isList = viewMode === 'list';
  
  const titleClass = isGrid4 ? 'text-sm font-medium' : isGrid3 ? 'font-medium text-base' : isGrid2 ? 'text-xl font-medium' : (isGrid1 || isList) ? 'font-medium text-lg' : 'font-medium text-base';
  const priceClass = isGrid4 ? 'text-base font-bold text-gray-900' : isGrid3 ? 'text-lg font-bold text-gray-900' : isGrid2 ? 'text-lg font-bold text-gray-900' : 'text-xl font-bold text-gray-900';
  const originalPriceClass = 'text-sm';
  const ratingSize = isGrid4 ? 10 : isGrid3 ? 12 : isGrid2 ? 11 : 13;
  const soldTextClass = 'text-sm';
  
  const containerClass = isGrid4 ? 'p-3' : isGrid3 ? 'p-4' : isGrid2 ? 'p-4' : 'p-6';
  const imageAspectClass = 'aspect-square';
  const minHeightTitle = isGrid4 ? 'min-h-[2rem]' : isGrid3 ? 'min-h-[2.5rem]' : isGrid2 ? 'min-h-[3rem]' : '';
  const minHeightRating = isGrid4 ? 'min-h-[18px]' : isGrid3 ? 'min-h-[20px]' : isGrid2 ? 'min-h-[24px]' : 'min-h-[18px]';
  const minHeightPrice = isGrid4 ? 'min-h-[20px]' : isGrid3 ? 'min-h-[24px]' : isGrid2 ? 'min-h-[28px]' : 'min-h-[20px]';

  const productImage = image || (images && images.length > 0 ? images[0].url : '/placeholder-product.jpg');
  
  // Get available variant with stock (useMemo for performance)
  const availableVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    const withStock = product.variants.find(v => v.stock > 0);
    return withStock || product.variants[0];
  }, [product.variants]);
  
  const getLowestPrice = useCallback(() => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .filter(v => v.stock > 0)
        .map(v => v.price)
        .filter(p => p > 0);
      if (prices.length > 0) return Math.min(...prices);
    }
    return basePrice || price || 0;
  }, [product.variants, basePrice, price]);
  
  const productPrice = useMemo(() => getLowestPrice(), [getLowestPrice]);
  const productOriginalPrice = originalPrice;
  const discountPercent = calculateDiscountPercent(productOriginalPrice, productPrice) || discount || 0;
  const variantId = availableVariant?.id || product.variants?.[0]?.id;
  const hasStock = availableVariant && availableVariant.stock > 0;

  useEffect(() => {
    if (user && variantId) {
      wishlistService.checkWishlist(variantId).then(({ isInWishlist }) => {
        setIsInWishlist(isInWishlist);
      }).catch(() => {});
    }
  }, [user, variantId]);

  const handleWishlistToggle = useCallback(async (e) => {
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
  }, [user, variantId, isInWishlist]);

  return (
    <div className={`group relative bg-white border border-gray-200 transition-all duration-300 overflow-hidden flex flex-col h-full ${isList ? 'flex-row min-h-[280px]' : ''}`}>
      {(badge || discountPercent > 0) && (
        <div className={`absolute top-3 left-3 z-10 ${isList ? 'top-2 left-2' : ''}`}>
          <span className={`px-2.5 py-1 text-xs font-normal bg-[#00a85a] text-white ${isList ? 'px-2 py-0.5 text-[10px]' : ''}`}>
            {badge || `-${discountPercent}%`}
          </span>
        </div>
      )}

      {!isList && (
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={handleWishlistToggle}
            className={`p-2 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a85a] ${
              isInWishlist 
                ? 'bg-[#00a85a] text-white border-[#00a85a]' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-[#00a85a] hover:text-white hover:border-[#00a85a]'
            } ${isGrid2 ? 'p-2' : 'p-1.5'}`}
            aria-label={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
          >
            <FaHeart size={isGrid2 ? 14 : 12} />
          </button>
          <Link 
            to={`/products/${id}`}
            className={`p-2 bg-white border border-gray-300 text-gray-700 hover:bg-[#00a85a] hover:text-white hover:border-[#00a85a] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a85a] ${isGrid2 ? 'p-2' : 'p-1.5'}`}
            aria-label="Xem chi tiết sản phẩm"
          >
            <FaEye size={isGrid2 ? 14 : 12} />
          </Link>
        </div>
      )}

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
        {product.viewCount > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <FaEye size={9} />
            <span>{formatViewCount(product.viewCount)} lượt xem</span>
          </div>
        )}
      </Link>

      <div className={`flex flex-col ${isList ? 'justify-center' : 'flex-grow'} ${containerClass} ${isList ? 'w-3/5' : ''}`}>
        <Link to={`/products/${id}`} className={`block ${isList ? 'mb-5' : 'mb-3'}`}>
          <h3 
            className={`${titleClass} text-gray-900 hover:text-gray-600 transition-colors ${isList ? 'line-clamp-2 leading-normal' : 'line-clamp-2'} ${minHeightTitle}`} 
            title={name}
          >
            {name}
          </h3>
        </Link>

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
          {!isList && (
            <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
              <FaEye size={11} />
              {formatViewCount(product.viewCount)}
            </span>
          )}
        </div>

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

        {isList && (
          <div className="pt-6 border-t border-gray-100 flex items-center gap-4">
            <button  
              onClick={handleWishlistToggle}
              className={`px-4 py-2 border transition-all duration-200 flex items-center gap-2.5 text-sm font-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a85a] ${
                isInWishlist 
                  ? 'bg-[#00a85a] text-white border-[#00a85a]' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-[#00a85a] hover:text-white hover:border-[#00a85a]'
              }`}
              aria-label={isInWishlist ? 'Xóa khỏi danh sách yêu thích' : 'Thêm vào danh sách yêu thích'}
            >
              <FaHeart size={14} className={isInWishlist ? 'fill-current' : ''} />
              {isInWishlist ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
            </button>
            {product.viewCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <FaEye size={12} />
                {formatViewCount(product.viewCount)} lượt xem
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;