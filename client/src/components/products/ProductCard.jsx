import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaHeart, FaEye, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters';
import wishlistService from '../../services/wishlistService';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
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

  // Lấy ảnh đầu tiên hoặc ảnh thumbnail
  const productImage = image || (images && images.length > 0 ? images[0].url : '/placeholder-product.jpg');
  
  // Lấy giá từ basePrice hoặc price
  const productPrice = basePrice || price || 0;
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
      toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
      return;
    }

    if (!variantId) {
      toast.error('Không tìm thấy sản phẩm');
      return;
    }

    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(variantId);
        setIsInWishlist(false);
        toast.success('Đã xóa khỏi danh sách yêu thích');
        // Trigger event to update header
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      } else {
        await wishlistService.addToWishlist(variantId);
        setIsInWishlist(true);
        toast.success('Đã thêm vào danh sách yêu thích');
        // Trigger event to update header
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full">
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

      {/* Product Image - Fixed aspect ratio */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={productImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Product Info - Flex grow to push button to bottom */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name - Fixed height with ellipsis */}
        <Link to={`/products/${id}`} className="block mb-2">
          <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem]" title={name}>
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={12}
                  className={i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 flex-wrap">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(productPrice)}
          </span>
          {productOriginalPrice && productOriginalPrice > productPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(productOriginalPrice)}
            </span>
          )}
        </div>

        {/* View Detail Button - Pushed to bottom */}
        <div className="mt-auto">
          <Link to={`/products/${id}`}>
            <Button
              variant="dark"
              fullWidth
              icon={FaEye}
              className="hover:bg-gray-800 transition-colors duration-300 text-sm"
            >
              Xem chi tiết
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
