import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import Button from '../common/Button';
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters';

export const ProductImageGallery = ({ images, selectedImage, onImageSelect, onPrevImage, onNextImage, productName }) => {
  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img src="/placeholder-product.jpg" alt={productName} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100 group">
        <img
          src={images[selectedImage]?.url || '/placeholder-product.jpg'}
          alt={productName}
          className="w-full h-full object-cover"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={onNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <FaChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelect(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === idx 
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={img.url} alt={`${productName} ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetails = ({ 
  product, 
  currentPrice, 
  originalPrice,
  selectedSize,
  selectedColor,
  selectedVariant,
  quantity,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
  onAddToCart
}) => {
  const getSizes = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  };

  const getColors = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.color).filter(Boolean))];
  };

  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const sizes = getSizes();
  const colors = getColors();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
      
      {/* Rating and Sold Count below title */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        {(product.averageRating > 0 || product.reviewCount > 0) && (
          <>
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="font-semibold">{product.averageRating?.toFixed(1) || '0.0'}</span>
              <span className="text-gray-600">({product.reviewCount || 0} đánh giá)</span>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
          </>
        )}
        {product.soldCount > 0 && (
          <>
            <span className="text-gray-600">Đã bán: {product.soldCount.toLocaleString('vi-VN')}</span>
            <div className="h-4 w-px bg-gray-300"></div>
          </>
        )}
        {selectedVariant?.stock !== undefined && (
          <span className={`font-medium ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {selectedVariant.stock > 0 ? `Còn ${selectedVariant.stock} sản phẩm` : 'Hết hàng'}
          </span>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-red-600">{formatPrice(currentPrice)}</span>
          {originalPrice && originalPrice > currentPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">{formatPrice(originalPrice)}</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>

      {product.description && (
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {sizes.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Size</label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeSelect(size)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Màu sắc</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                  selectedColor === color
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Số lượng</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(parseInt(e.target.value) || 1)}
            min={1}
            className="w-20 h-10 text-center border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          />
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-10 h-10 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant="dark"
          icon={FaShoppingCart}
          className="flex-1"
          onClick={() => onAddToCart(true)}
        >
          Mua ngay
        </Button>
        <Button
          variant="outline"
          icon={FaShoppingCart}
          className="flex-1"
          onClick={() => onAddToCart(false)}
        >
          Thêm vào giỏ
        </Button>
        <Button variant="outline" icon={FaHeart} className="px-4" />
      </div>

      <div className="border-t pt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">SKU:</span>
          <span className="font-medium">{product.sku || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Danh mục:</span>
          <span className="font-medium">{product.category?.name || 'N/A'}</span>
        </div>
      
      </div>
    </div>
  );
};
