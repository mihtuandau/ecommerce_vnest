import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHeart, FaEye } from 'react-icons/fa';
import { notify } from '../../utils/notification';
import Button from '../common/Button';
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
    rating = 0,
    reviews = 0,
    badge,
    discount,
  } = product;

  // Determine text sizes based on viewMode
  const isGrid2 = viewMode === 'grid-2';
  const titleClass = isGrid2 ? 'text-xl font-medium' : 'font-medium text-base';
  const priceClass = isGrid2 ? 'text-lg font-bold' : 'text-lg font-bold';
  const originalPriceClass = isGrid2 ? 'text-sm' : 'text-sm';
  const ratingSize = isGrid2 ? 11 : 12;
  const soldTextClass = isGrid2 ? 'text-sm' : 'text-sm';
  const minTitleHeight = isGrid2 ? 'min-h-[1.5rem]' : 'min-h-[1rem]';

  // Lấy ảnh đầu tiên hoặc ảnh thumbnail
  const productImage = image || (images && images.length > 0 ? images[0].url : '/placeholder-product.jpg');
  
  // Lấy giá thấp nhất từ variants hoặc từ basePrice/price
  const getLowestPrice = () => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : (basePrice || price || 0);
    }
    return basePrice || price || 0;
  };
  
  const productPrice = getLowestPrice();
  const productOriginalPrice = originalPrice;
  
  // Tính % giảm giá
  const discountPercent = calculateDiscountPercent(productOriginalPrice, productPrice) || discount || 0;

  // Get first variant ID for wishlist
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
        // Trigger event to update header
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } else {
        await wishlistService.addToWishlist(variantId);
        setIsInWishlist(true);
        notify.success('Đã thêm vào danh sách yêu thích');
        // Trigger event to update header
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    } catch (error) {
      notify.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="group relative bg-white rounded-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
      {/* Badge */}
      {(badge || discountPercent > 0) && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full text-white ${
            badge === 'Hot' ? 'bg-red-500' :
            badge === 'New' ? 'bg-green-500' :
            badge === 'Best Seller' ? 'bg-blue-500' :
            'bg-orange-500'
          }`}>
            {badge || `-${discountPercent}%`}
          </span>
        </div>
      )}

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={handleWishlistToggle}
          className={`p-2 rounded-full shadow-md transition-colors ${
            isInWishlist 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-white hover:bg-red-500 hover:text-white'
          }`}
          aria-label="Yêu thích"
        >
          <FaHeart size={16} />
        </button>
        <Link 
          to={`/products/${id}`}
          className="p-2 bg-white rounded-full shadow-md hover:bg-blue-500 hover:text-white transition-colors"
          aria-label="Xem nhanh"
        >
          <FaEye size={16} />
        </Link>
      </div>

      {/* Product Image - Fixed aspect ratio, tighter for grid-2 */}
      <Link to={`/products/${id}`} className={`block relative overflow-hidden ${isGrid2 ? 'aspect-square' : 'aspect-square'} bg-gray-50`}>
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Info - Flex grow to push button to bottom */}
      <div className={`flex flex-col flex-grow ${isGrid2 ? 'p-3' : 'p-4'}`}>
        {/* Product Name - Fixed height with ellipsis */}
        <Link to={`/products/${id}`} className="block mb-2">
          <h3 className={`${titleClass} text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 ${isGrid2 ? 'min-h-[3rem]' : 'min-h-[2.5rem]'}`} title={name}>
            {name}
          </h3>
        </Link>

        {/* Rating & Sold Count - Fixed height to maintain consistency */}
        <div className={`flex items-center justify-between gap-2 mb-2 flex-wrap ${isGrid2 ? 'text-xs min-h-[24px]' : 'text-sm min-h-[20px]'}`}>
          <StarRating
            rating={product.averageRating || 0}
            size={ratingSize}
            showNumber
            reviewCount={product.reviewCount || 0}
          />
          <span className={`${soldTextClass} text-gray-600 font-medium`}>
            🔥 Đã bán {product.soldCount || product.sold || 0}
          </span>
        </div>

        {/* Price - Fixed height */}
        <div className={`flex items-baseline gap-2 flex-wrap ${isGrid2 ? 'min-h-[28px]' : 'min-h-[24px]'}`}>
          <span className={`${priceClass} text-gray-900`}>
            {formatPrice(productPrice)}
          </span>
          {productOriginalPrice && productOriginalPrice > productPrice ? (
            <span className={`${originalPriceClass} text-gray-400 line-through`}>
              {formatPrice(productOriginalPrice)}
            </span>
          ) : (
            <span className="invisible text-sm">000.000 ₫</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;