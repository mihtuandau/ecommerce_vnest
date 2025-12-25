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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-700 p-2.5 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
            >
              <FaChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-700 p-2.5 border border-gray-200 opacity-0 group-hover:opacity-100 transition-all"
            >
              <FaChevronRight size={16} />
            </button>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 border border-gray-200 text-xs font-light">
              {selectedImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelect(idx)}
              className={`flex-shrink-0 w-20 h-20 overflow-hidden border transition-all duration-300 rounded-lg transform hover:scale-105 ${
                selectedImage === idx
                  ? "border-[#00a85a] shadow-lg ring-2 ring-green-100"
                  : "border-gray-200 hover:border-[#00a85a] hover:shadow-md"
              }`}
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
                onClick={(e) => {
                  e.stopPropagation();
                  onPrevImage();
                }}
                className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full"
              >
                <FaChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNextImage();
                }}
                className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full"
              >
                <FaChevronRight size={28} />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-full">
            <img
              src={images[selectedImage]?.url || "/placeholder-product.jpg"}
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
