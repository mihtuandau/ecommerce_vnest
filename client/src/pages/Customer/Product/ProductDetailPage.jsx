import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { ProductTabs } from '../../../components/productdetail';
import ProductRecommendations from '../../../components/products/ProductRecommendations';
import { useProductDetail } from '../../../hooks/useProductDetail';
import { useFlashSale } from '../../../hooks/useFlashSale';

const ProductDetailPage = () => {
  const {
    product, loading, images, selectedImage, setSelectedImage, quantity, setQuantity,
    selectedVariant, selectedSize, setSelectedSize, selectedColor, setSelectedColor,
    isWishlisted, toggleWishlist, flashSale, handleAddToCart, prevImage, nextImage
  } = useProductDetail();

  const [activeTab, setActiveTab] = useState('description');
  const { flashSale: globalFlashSale } = useFlashSale();
  const activeFlashSale = globalFlashSale?.data || globalFlashSale;

  const { effectiveFlashSale, flashPrice } = useMemo(() => {
    if (!product) return {};
    const currentPrice = selectedVariant?.price || product?.basePrice;
    const isIncludedInGlobal = activeFlashSale?.products?.some(p => Number(p.id) === Number(product.id));
    const effective = (isIncludedInGlobal || flashSale?.isFlashSale) ? { ...activeFlashSale, ...(flashSale || {}), isFlashSale: true } : flashSale;
    const price = flashSale ? (flashSale.percentage ? Math.round(currentPrice * (1 - flashSale.percentage / 100)) : (flashSale.fixedAmount ? Math.max(0, currentPrice - flashSale.fixedAmount) : null)) : null;
    return { effectiveFlashSale: effective, flashPrice: price };
  }, [product, selectedVariant, flashSale, activeFlashSale]);

  if (loading) return <Layout><Loading fullScreen text="Đang tải sản phẩm..." /></Layout>;
  if (!product) return <Layout><div className="container mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1><Link to="/products" className="text-black hover:underline">Quay lại cửa hàng</Link></div></Layout>;

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 opacity-70 transition-opacity"><Breadcrumb items={[{ label: 'Sản Phẩm', path: '/products' }, { label: product.name }]} /></div>
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pt-4 items-start">
              <ProductImageGallery images={images} selectedImage={selectedImage} onImageSelect={setSelectedImage} onPrevImage={prevImage} onNextImage={nextImage} productName={product.name} />
              <ProductDetails
                product={product} currentPrice={flashPrice ?? (selectedVariant?.price || product.basePrice)}
                originalPrice={flashPrice ? (selectedVariant?.price || product.basePrice) : product.originalPrice}
                flashSale={effectiveFlashSale} selectedSize={selectedSize} selectedColor={selectedColor}
                selectedVariant={selectedVariant} quantity={quantity} onSizeSelect={setSelectedSize}
                onColorSelect={setSelectedColor} onQuantityChange={setQuantity} onAddToCart={handleAddToCart}
                isWishlisted={isWishlisted} onToggleWishlist={toggleWishlist}
              />
            </div>
            <div className="mt-20"><ProductTabs product={product} activeTab={activeTab} onTabChange={setActiveTab} /></div>
          </div>
          <div className="pt-20 border-t border-gray-100"><ProductRecommendations productId={product.id} categoryId={product.categoryId} /></div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
