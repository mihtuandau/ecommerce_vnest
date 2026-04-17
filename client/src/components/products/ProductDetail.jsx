import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useState } from "react";
import ProductInfo from "../productdetail/ProductInfo";
import ProductPrice from "../productdetail/ProductPrice";
import ProductOptions from "../productdetail/ProductOptions";
import ProductQuantity from "../productdetail/ProductQuantity";
import ProductActions from "../productdetail/ProductActions";
import ProductShare from "../productdetail/ProductShare";

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
      <div className="aspect-[4/5] overflow-hidden bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-center">
        <img
          src="/placeholder-product.jpg"
          alt={productName}
          className="w-1/2 opacity-20"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4">
      {}
      <div className="flex-1 relative aspect-[4/5] overflow-hidden rounded-3xl bg-gray-50 border border-gray-100 group shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50">
        <img
          src={images[selectedImage]?.url || "/placeholder-product.jpg"}
          alt={`${productName} - ảnh ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 active:scale-95"
          aria-label="Phóng to"
        >
          <Maximize2 size={18} className="text-gray-900" />
        </button>

        {images.length > 1 && (
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage();
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 pointer-events-auto opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-black hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNextImage();
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/50 pointer-events-auto opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 hover:bg-black hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {selectedImage + 1} / {images.length}
        </div>
      </div>

      {}
      {images.length > 1 && (
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide pb-2 md:pb-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onImageSelect(idx)}
              className={`relative flex-shrink-0 w-20 md:w-24 aspect-[4/5] rounded-2xl overflow-hidden border-2 transition-all duration-300 transform active:scale-90 ${
                selectedImage === idx
                  ? "border-black shadow-lg shadow-gray-200"
                  : "border-transparent hover:border-gray-300 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                className={`w-full h-full object-cover transition-all duration-300 ${selectedImage === idx ? 'grayscale-0' : 'grayscale-[40%]'}`}
              />
              {selectedImage === idx && (
                <div className="absolute inset-0 bg-black/5" />
              )}
            </button>
          ))}
        </div>
      )}

      {}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-white/98 z-[100] flex items-center justify-center animate-in fade-in duration-300"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-black hover:text-white transition-all duration-300"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>

          <div className="max-w-[90vw] max-h-[90vh] relative group">
            <img
              src={images[selectedImage]?.url || "/placeholder-product.jpg"}
              alt={`${productName} - phóng to`}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            {images.length > 1 && (
              <div className="absolute inset-x-[-60px] top-1/2 -translate-y-1/2 hidden lg:flex justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrevImage();
                  }}
                  className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 active:scale-75"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNextImage();
                  }}
                  className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 active:scale-75"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const ProductDetails = ({
  product,
  currentPrice,
  originalPrice,
  flashSale,
  selectedSize,
  selectedColor,
  quantity,
  onSizeSelect,
  onColorSelect,
  onQuantityChange,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const totalStock =
    product?.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  const lowStockThreshold = product?.variants?.[0]?.lowStockThreshold ?? 5;
  const isLowStock = totalStock > 0 && totalStock <= lowStockThreshold;
  const isOutOfStock = totalStock === 0;

  return (
    <div className="w-full flex flex-col gap-4">

      {}
      <ProductInfo product={product} />

      <hr className="border-gray-100" />

      {}
      <ProductPrice
        currentPrice={currentPrice}
        originalPrice={originalPrice}
        flashSale={flashSale}
      />

      <hr className="border-gray-100" />

      {}
      <ProductOptions
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onSizeSelect={onSizeSelect}
        onColorSelect={onColorSelect}
      />

      <hr className="border-gray-100" />

      {}
      {isOutOfStock ? (
        <p className="text-sm text-red-500 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
          Tạm hết hàng
        </p>
      ) : isLowStock ? (
        <p className="text-sm text-amber-600 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse inline-block" />
          Chỉ còn {totalStock} sản phẩm
        </p>
      ) : (
        <p className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Còn hàng ({totalStock} sản phẩm)
        </p>
      )}

      {}
      <ProductQuantity
        quantity={quantity}
        onQuantityChange={onQuantityChange}
        totalStock={totalStock}
      />

      {}
      <ProductActions
        onAddToCart={onAddToCart}
        totalStock={totalStock}
        isWishlisted={isWishlisted}
        onToggleWishlist={onToggleWishlist}
      />

      {}
      <div className="text-sm text-gray-400">
        <ProductShare />
      </div>

      <hr className="border-gray-100" />

      {}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {[
          { emoji: '', text: 'Giao hàng 2-3 ngày' },
          { emoji: '', text: 'Bảo hành chính hãng' },
          { emoji: '🔄', text: 'Đổi trả 30 ngày' },
          { emoji: '', text: 'Đóng gói cẩn thận' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
            <span>{item.emoji}</span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
};






