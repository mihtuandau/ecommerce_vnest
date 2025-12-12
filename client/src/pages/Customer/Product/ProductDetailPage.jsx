import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { productService } from '../../../services/productService';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import StarRating from '../../../components/common/StarRating';
import ReviewList from '../../../components/products/ReviewList';
import toast from 'react-hot-toast';

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
      const matchingVariant = product.variants.find(
        v => (
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
        )
      );
      if (matchingVariant) {
        // Set variant immediately without delay
        setSelectedVariant(matchingVariant);
        
        // Update image immediately
        const variantImage = product.images?.find(img => img.variantId === matchingVariant.id);
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
        
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
        setSelectedVariant(productData.variants[0]);
      }
    } catch (error) {
      toast.error('Không tìm thấy sản phẩm');
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
      toast.error('Vui lòng chọn size và màu sắc');
      return;
    }

    if (quantity > selectedVariant.stock) {
      toast.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
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
      toast.success('Thêm vào giỏ hàng thành công!', { duration: 2000 });
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
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-gray-900">Sản phẩm</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>

          {/* Product Detail */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
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

            {/* Rating & Sold Count */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <StarRating
                    rating={product.averageRating || 0}
                    size={20}
                    showNumber
                    reviewCount={product.reviewCount || 0}
                  />
                </div>
                {product.soldCount > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="text-sm font-medium">{product.soldCount} đã bán</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 border-t border-gray-200">
              <div className="flex gap-8 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'description'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mô tả sản phẩm
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-2 font-medium transition-colors relative ${
                    activeTab === 'reviews'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Đánh giá ({product.reviewCount || 0})
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description || 'Chưa có mô tả sản phẩm'}
                    </p>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {/* Thông báo hướng dẫn đánh giá */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">💡 Hướng dẫn:</span> Để đánh giá sản phẩm này, vui lòng đặt hàng và đợi đơn hàng được giao thành công. 
                        Sau đó, bạn có thể đánh giá trong trang <Link to="/orders" className="font-medium underline">Đơn hàng của tôi</Link>.
                      </p>
                    </div>

                    {/* Review List */}
                    <ReviewList productId={product.id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
