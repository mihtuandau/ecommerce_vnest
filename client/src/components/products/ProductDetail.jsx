// src/components/products/ProductDetailComponents.jsx

import { FaChevronLeft, FaChevronRight, FaStar, FaShoppingCart, FaFacebook, FaTwitter, FaPinterest, FaShareAlt, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';
import Button from '../common/Button'; // Điều chỉnh đường dẫn nếu cần
import { formatPrice } from '../../utils/formatters'; // Điều chỉnh đường dẫn nếu cần

// ===================================================================
// 1. PRODUCT IMAGE GALLERY
// ===================================================================
export const ProductImageGallery = ({ images = [], selectedImage = 0, onImageSelect, onPrevImage, onNextImage, productName = 'Sản phẩm' }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
        <img src="/placeholder-product.jpg" alt={productName} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={images[selectedImage]?.url || '/placeholder-product.jpg'}
          alt={`${productName} - ảnh ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); onPrevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaChevronRight size={20} />
            </button>

            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelect(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img src={img.url} alt={`${productName} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl"
            onClick={() => setIsZoomed(false)}
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrevImage(); }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full"
              >
                <FaChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNextImage(); }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full"
              >
                <FaChevronRight size={28} />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-full">
            <img
              src={images[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={productName}
              className="max-w-full max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ===================================================================
// 2. PRODUCT DETAILS (ĐÃ CẢI THIỆN HOÀN TOÀN)
// ===================================================================
export const ProductDetails = ({
  product,
  currentPrice,
  originalPrice,
  selectedSize,
  selectedColor,
  quantity,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
  onAddToCart,
}) => {
  const [openAccordion, setOpenAccordion] = useState('description');

  const getSizes = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.size).filter(Boolean))];
  };

  const getColors = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map(v => v.color).filter(Boolean))];
  };

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const discountPercent = originalPrice && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const sizes = getSizes();
  const colors = getColors();
  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  return (
    <div className="max-w-2xl">
      {/* SKU & Brand */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <span>SKU: <span className="font-medium text-gray-900">{product.sku || 'N/A'}</span></span>
        {product.brand && (
          <>
            <span className="text-gray-400">•</span>
            <span>Thương hiệu: <span className="text-blue-600 font-medium">{product.brand.name}</span></span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {product.name}
      </h1>

      {/* Rating & Sold */}
      <div className="flex items-center gap-4 mb-6">
        {product.averageRating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">{product.reviewCount || 0} đánh giá</span>
          </div>
        )}
        {product.soldCount > 0 && (
          <>
            {product.averageRating > 0 && <span className="text-gray-400">•</span>}
            <span className="text-sm text-gray-600">
              Đã bán <strong className="text-gray-900">{product.soldCount}</strong>
            </span>
          </>
        )}
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-gray-900">{formatPrice(currentPrice)}</span>
          {originalPrice && originalPrice > currentPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">{formatPrice(originalPrice)}</span>
              <span className="px-3 py-1.5 bg-red-100 text-red-700 font-bold rounded-full text-sm">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>

      {/* Color & Size Options */}
      {(colors.length > 0 || sizes.length > 0) && (
        <div className="space-y-7 mb-8">
          {colors.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Màu sắc: <span className="font-normal text-gray-600">{selectedColor || 'Chọn màu'}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onColorSelect(color)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium capitalize transition-all ${
                      selectedColor === color
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white hover:border-gray-500'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {sizes.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Kích thước: <span className="font-normal text-gray-600">{selectedSize || 'Chọn kích thước'}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onSizeSelect(size)}
                    className={`w-16 h-12 rounded-lg border-2 font-medium transition-all ${
                      selectedSize === size
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 bg-white hover:border-gray-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quantity */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-900">Số lượng</span>
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full inline-block ${
              totalStock === 0 ? 'bg-red-500' : totalStock > 20 ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            <span className={`font-medium ${
              totalStock === 0 ? 'text-red-600' : totalStock > 20 ? 'text-green-600' : 'text-orange-600'
            }`}>
              {totalStock === 0 ? 'Hết hàng' : totalStock > 20 ? 'Còn hàng' : `Chỉ còn ${totalStock}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || totalStock === 0}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 text-xl"
            >
              −
            </button>
            <input
              type="text"
              value={quantity}
              onChange={(e) => onQuantityChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-12 text-center font-semibold focus:outline-none"
              disabled={totalStock === 0}
            />
            <button
              onClick={() => onQuantityChange(quantity + 1)}
              disabled={totalStock === 0}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 text-xl"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <Button
          variant="outline"
          className="h-12 text-base font-semibold border-2 border-gray-900 hover:bg-gray-50"
          onClick={() => onAddToCart(false)}
          disabled={totalStock === 0}
        >
          <FaShoppingCart className="inline mr-2" />
          Thêm vào giỏ hàng
        </Button>
        <Button
          className="h-12 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => onAddToCart(true)}
          disabled={totalStock === 0}
        >
          Mua ngay
        </Button>
      </div>

      {/* Safe Checkout */}
      <div className="py-6 border-y border-gray-200 mb-8">
        <p className="text-sm font-semibold text-gray-900 mb-4">Thanh toán an toàn</p>
        <div className="flex flex-wrap items-center gap-8 opacity-80">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-7" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="h-7" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg" alt="Amex" className="h-8" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal" className="h-7" />
        </div>
      </div>

      {/* Accordions */}
      <div className="space-y-1 mb-10">
        {[
          { key: 'description', title: 'Mô tả sản phẩm', content: product.description || 'Không có mô tả chi tiết.' },
          { key: 'terms', title: 'Chính sách & Điều khoản', content: 'Áp dụng các điều khoản tiêu chuẩn của cửa hàng. Liên hệ để biết thêm chi tiết.' },
          { key: 'ask', title: 'Hỏi về sản phẩm này', content: 'Có thắc mắc về sản phẩm? Vui lòng liên hệ support@example.com hoặc gọi 1800-123-456' },
        ].map((item) => (
          <div key={item.key} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(item.key)}
              className="w-full flex items-center justify-between py-4 text-left font-semibold text-gray-900 hover:text-gray-700 transition"
            >
              <span>{item.title}</span>
              <FaChevronDown className={`w-4 h-4 transition-transform ${openAccordion === item.key ? 'rotate-180' : ''}`} />
            </button>
            {openAccordion === item.key && (
              <div className="pb-5 text-sm text-gray-600 leading-relaxed">
                {typeof item.content === 'string' ? <p>{item.content}</p> : item.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Social Share */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-700 font-medium">Chia sẻ:</span>
        <div className="flex gap-2">
          <button className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"><FaFacebook /></button>
          <button className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"><FaTwitter /></button>
          <button className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"><FaPinterest /></button>
          <button className="p-2.5 rounded-full border border-gray-300 hover:bg-gray-100 transition"><FaShareAlt /></button>
        </div>
      </div>
    </div>
  );
};