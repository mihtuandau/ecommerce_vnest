import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { productService } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import StarRating from '../../../components/common/StarRating';
import ReviewList from '../../../components/products/ReviewList';
import ProductRecommendations from '../../../components/products/ProductRecommendations';
import { notify } from '../../../utils/notification';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState('description'); // description | reviews

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      // Tìm variants match size/color
      let matchingVariants = product.variants.filter(
        v => (
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
        )
      );
      
      // Nếu không có match, lấy tất cả variants
      if (matchingVariants.length === 0) {
        matchingVariants = product.variants;
      }
      
      // Ưu tiên variant có stock > 0
      const variantToSelect = matchingVariants.find(v => v.stock > 0) || matchingVariants[0];
      
      if (variantToSelect && (!selectedVariant || selectedVariant.id !== variantToSelect.id)) {
        console.log('🔄 Setting variant:', {
          id: variantToSelect.id,
          size: variantToSelect.size,
          color: variantToSelect.color,
          stock: variantToSelect.stock
        });
        
        setSelectedVariant(variantToSelect);
        
        // Update image immediately
        const variantImage = product.images?.find(img => img.variantId === variantToSelect.id);
        if (variantImage) {
          const imageIndex = product.images.findIndex(img => img.id === variantImage.id);
          if (imageIndex !== -1) {
            setSelectedImage(imageIndex);
          }
        }
      }
    }
  }, [selectedSize, selectedColor, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id);
      const productData = response.data || response;
      setProduct(productData);
      
      if (productData.variants && productData.variants.length > 0) {
        const sizes = [...new Set(productData.variants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(productData.variants.map(v => v.color).filter(Boolean))];
        
        // Set size and color first
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
        
        // Find variant with stock > 0, or fallback to first variant
        const variantsWithStock = productData.variants.filter(v => v.stock > 0);
        const variantWithStock = variantsWithStock.length > 0 
          ? variantsWithStock.sort((a, b) => b.stock - a.stock)[0]  // Variant có stock nhiều nhất
          : productData.variants[0]; // Fallback nếu tất cả đều hết stock
          
        console.log('📦 Loading product with variants:', {
          totalVariants: productData.variants.length,
          allVariants: productData.variants.map(v => ({
            id: v.id,
            size: v.size,
            color: v.color,
            stock: v.stock
          })),
          selectedVariant: {
            id: variantWithStock.id,
            stock: variantWithStock.stock,
            size: variantWithStock.size,
            color: variantWithStock.color
          }
        });
        
        setSelectedVariant(variantWithStock);
      }
    } catch (error) {
      notify.error('Không tìm thấy sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const getVariantImage = () => {
    const variantImage = product.images?.find(img => img.variantId === selectedVariant.id);
    return variantImage?.url || variantImage?.imageUrl || 
           product.images?.[0]?.url || product.images?.[0]?.imageUrl || 
           product.image;
  };

  const handleAddToCart = (buyNow = false) => {
    if (!selectedVariant) {
      notify.error('Vui lòng chọn size và màu sắc');
      return;
    }

    if (quantity > selectedVariant.stock) {
      notify.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
      return;
    }

    const productData = {
      id: product.id,
      name: product.name,
      image: getVariantImage(),
      variant: {
        id: selectedVariant.id,
        price: selectedVariant.price,
        size: selectedVariant.size,
        color: selectedVariant.color,
        stock: selectedVariant.stock,
      }
    };

    addToCart(selectedVariant.id, quantity, productData);
    
    if (buyNow) {
      setTimeout(() => navigate('/cart'), 500);
    } else {
      notify.success('Thêm vào giỏ hàng thành công!', 2000);
    }
  };

  const handlePrevImage = () => {
    const images = product.images || [];
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    const images = product.images || [];
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Đang tải sản phẩm..." />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/products" className="text-blue-600 hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </Layout>
    );
  }

  const images = product.images || [];
  const currentPrice = selectedVariant?.price || product.basePrice || product.price;
  const originalPrice = product.originalPrice;

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          {/* Breadcrumb */}
          <Breadcrumb items={[
            { label: 'Sản phẩm', path: '/products' },
            { label: product.name }
          ]} />

          {/* Product Detail Card */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <ProductImageGallery
                images={images}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onPrevImage={handlePrevImage}
                onNextImage={handleNextImage}
                productName={product.name}
              />

              <ProductDetails
                product={product}
                currentPrice={currentPrice}
                originalPrice={originalPrice}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onSizeSelect={setSelectedSize}
                onColorSelect={setSelectedColor}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
              />
            </div>

            {/* Tabs Section */}
            <div className="border-t border-gray-200">
              <div className="flex gap-8 px-6 lg:px-10 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-2 font-semibold transition-all relative ${
                    activeTab === 'description'
                      ? 'text-gray-900 border-b-3 border-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Mô tả sản phẩm
                  {activeTab === 'description' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-2 font-semibold transition-all relative ${
                    activeTab === 'reviews'
                      ? 'text-gray-900 border-b-3 border-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Đánh giá ({product.reviewCount || 0})
                  {activeTab === 'reviews' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
                  )}
                </button>
              </div>

              <div className="p-6 lg:p-10">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                      {product.description || 'Chưa có mô tả sản phẩm'}
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-semibold">💡 Hướng dẫn:</span> Để đánh giá sản phẩm này, vui lòng đặt hàng và đợi đơn hàng được giao thành công. 
                        Sau đó, bạn có thể đánh giá trong trang <Link to="/orders" className="font-semibold underline hover:text-blue-900">Đơn hàng của tôi</Link>.
                      </p>
                    </div>
                    <ReviewList productId={product.id} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Recommendations */}
          <ProductRecommendations 
            productId={product.id} 
            categoryId={product.categoryId} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
