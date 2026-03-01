import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import {
  ProductInfo,
  ProductPrice,
  ProductOptions,
  ProductQuantity,
  ProductActions,
  ProductAccordion,
  ProductShare,
} from "../../components/productdetail";

export const ProductImageGallery = ({
  images = [],
  selectedImage = 0,
  onImageSelect,
  onPrevImage,
  onNextImage,
  productName = "Sản phẩm",
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square overflow-hidden bg-white rounded-lg">
        <img
          src="/placeholder-product.jpg"
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-square overflow-hidden group cursor-zoom-in bg-white border border-gray-200"
        onClick={() => setIsZoomed(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsZoomed(true);
          }
        }}
        aria-label="Click to zoom image"
      >
        <img
          src={images[selectedImage]?.url || "/placeholder-product.jpg"}
          alt={`${productName} - ảnh ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-700 p-2.5 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Ảnh trước đó"
              title="Ảnh trước đó (phím mũi tên trái)"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-700 p-2.5 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              aria-label="Ảnh tiếp theo"
              title="Ảnh tiếp theo (phím mũi tên phải)"
            >
              <FaChevronRight size={16} />
            </button>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 border border-gray-200 text-xs font-light" aria-live="polite">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelect(idx)}
              className={`flex-shrink-0 w-20 h-20 overflow-hidden border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${
                selectedImage === idx
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`Xem ảnh số ${idx + 1}`}
              aria-current={selectedImage === idx}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {isZoomed && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh phóng to"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsZoomed(false);
            } else if (e.key === 'ArrowLeft') {
              onPrevImage();
            } else if (e.key === 'ArrowRight') {
              onNextImage();
            }
          }}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black"
            onClick={() => setIsZoomed(false)}
            aria-label="Đóng ảnh phóng to (ESC)"
            title="Đóng (phím ESC)"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black"
                aria-label="Ảnh trước đó"
              >
                <FaChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white focus:ring-offset-black"
                aria-label="Ảnh tiếp theo"
              >
                <FaChevronRight size={28} />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-full">
            <img
              src={images[selectedImage]?.url || "/placeholder-product.jpg"}
              alt={`${productName} - ảnh phóng to ${selectedImage + 1}`}
              className="max-w-full max-h-screen object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/90 text-gray-900 px-4 py-2 text-sm" aria-live="polite">
              {selectedImage + 1} / {images.length}
            </div>
          )}
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
  quantity,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
  onAddToCart,
}) => {
  const totalStock =
    product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;

  // Ngưỡng cảnh báo sắp hết hàng (dùng lowStockThreshold nếu có, mặc định 5)
  const lowStockThreshold = product?.variants?.[0]?.lowStockThreshold ?? 5;
  const isLowStock = totalStock > 0 && totalStock <= lowStockThreshold;
  const isOutOfStock = totalStock === 0;

  return (
    <div className="max-w-2xl">
      <ProductInfo product={product} />
      
      <ProductPrice 
        currentPrice={currentPrice} 
        originalPrice={originalPrice} 
        product={product} 
      />

      <ProductOptions
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeSelect={onSizeSelect}
        onColorSelect={onColorSelect}
      />

      {/* Cảnh báo tồn kho */}
      {isOutOfStock && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
          Sản phẩm tạm hết hàng
        </div>
      )}
      {isLowStock && !isOutOfStock && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-sm mb-4">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
          Chỉ còn <span className="font-semibold">{totalStock}</span> sản phẩm — đặt hàng sớm!
        </div>
      )}

      <ProductQuantity
        quantity={quantity}
        onQuantityChange={onQuantityChange}
        totalStock={totalStock}
      />

      <ProductActions
        onAddToCart={onAddToCart}
        totalStock={totalStock}
      />

      <ProductAccordion product={product} />

      <ProductShare />
    </div>
  );
};
