import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { ProductTabs } from '../../../components/productdetail';
import { productService } from '../../../services/productService';
import apiService from '../../../services/apiService';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
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
  const [activeTab, setActiveTab] = useState('description');
  const [flashSale, setFlashSale] = useState(null);

  // Guard chống React StrictMode double-invoke: chỉ tăng viewCount 1 lần mỗi id
  const viewedIdRef = useRef(null);

  useEffect(() => {
    loadProduct();
    // Reset khi đổi sản phẩm
    viewedIdRef.current = null;
    setFlashSale(null);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    apiService.get(`/discounts/product/${id}`)
      .then((res) => setFlashSale(res?.data ?? res ?? null))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      let matchingVariants = product.variants.filter(
        v => (
          (!selectedSize || v.size === selectedSize) &&
          (!selectedColor || v.color === selectedColor)
        )
      );
      
      if (matchingVariants.length === 0) {
        matchingVariants = product.variants;
      }
      
      const variantToSelect = matchingVariants.find(v => v.stock > 0) || matchingVariants[0];
      
      if (variantToSelect && (!selectedVariant || selectedVariant.id !== variantToSelect.id)) {
        setSelectedVariant(variantToSelect);
        // Reset về ảnh đầu tiên khi chọn variant mới
        setSelectedImage(0);
      }
    }
  }, [selectedSize, selectedColor, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getOne(id);
      const productData = response.data || response;
      setProduct(productData);
      
      // Tăng lượt xem âm thầm — không cập nhật UI ngay (người xem tiếp theo mới thấy số mới)
      if (viewedIdRef.current !== id) {
        viewedIdRef.current = id;
        productService.incrementView(id).catch(() => {});
      }

      if (productData.variants && productData.variants.length > 0) {
        const sizes = [...new Set(productData.variants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(productData.variants.map(v => v.color).filter(Boolean))];
        
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
        
        // Only consider variants with stock for initial selection
        const variantsWithStock = productData.variants.filter(v => v.stock > 0);
        const variantWithStock = variantsWithStock.length > 0 
          ? variantsWithStock.sort((a, b) => b.stock - a.stock)[0]  
          : productData.variants[0]; 
        setSelectedVariant(variantWithStock);
      }
    } catch (error) {
      notify.error('Không tìm thấy sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const getVariantImage = useCallback(() => {
    // Lấy ảnh đầu tiên của variant
    if (selectedVariant?.images && selectedVariant.images.length > 0) {
      return selectedVariant.images[0].url;
    }
    
    // Fallback về ảnh chung của product
    if (product?.images && product.images.length > 0) {
      return product.images[0].url;
    }
    
    // Fallback cuối cùng
    return product?.image || '/placeholder-product.jpg';
  }, [selectedVariant, product]);

  const handleAddToCart = useCallback((buyNow = false) => {
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

    if (buyNow) {
      navigate('/checkout', { state: { product: productData, quantity } });
    } else {
      addToCart(selectedVariant.id, quantity, productData);
      notify.success('Thêm vào giỏ hàng thành công!', 2000);
    }
  }, [selectedVariant, product, quantity, getVariantImage, navigate, addToCart]);

  // Lọc ảnh theo variant đang được chọn - MUST BE BEFORE early returns
  const getDisplayImages = useCallback(() => {
    if (!product) return [];
    const productImages = Array.isArray(product?.images) ? product.images : [];
    const variantImages = Array.isArray(selectedVariant?.images) ? selectedVariant.images : [];

    // UX: hiển thị ảnh variant trước, sau đó đến ảnh sản phẩm (không trùng URL)
    const merged = [...variantImages, ...productImages];
    const seen = new Set();
    const deduped = [];

    for (const img of merged) {
      const url = img?.url;
      if (!url || seen.has(url)) continue;
      seen.add(url);
      deduped.push(img);
    }

    return deduped;
  }, [product, selectedVariant]);

  const handlePrevImage = useCallback(() => {
    const imgs = getDisplayImages();
    if (!imgs.length) return;
    setSelectedImage((prev) => (prev === 0 ? imgs.length - 1 : prev - 1));
  }, [getDisplayImages]);

  const handleNextImage = useCallback(() => {
    const imgs = getDisplayImages();
    if (!imgs.length) return;
    setSelectedImage((prev) => (prev === imgs.length - 1 ? 0 : prev + 1));
  }, [getDisplayImages]);

  const images = useMemo(() => getDisplayImages(), [getDisplayImages]);
  const currentPrice = selectedVariant?.price || product?.basePrice || product?.price;
  const originalPrice = product?.originalPrice;

  // Nếu có flash sale áp dụng cho sản phẩm này → tính giá sau giảm
  const flashPrice = flashSale
    ? flashSale.percentage
      ? Math.round(currentPrice * (1 - flashSale.percentage / 100))
      : flashSale.fixedAmount
        ? Math.max(0, currentPrice - flashSale.fixedAmount)
        : null
    : null;

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
          <Link to="/products" className="text-[#00a85a] hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pt-21 pb-8">
        <div className="container mx-auto px-4 lg:px-30">
          <Breadcrumb items={[
            { label: 'Sản Phẩm', path: '/products' },
            { label: product.name }
          ]} />

          <div className="mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 pt-4 pb-4">
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
                currentPrice={flashPrice ?? currentPrice}
                originalPrice={flashPrice ? currentPrice : originalPrice}
                flashSale={flashSale}
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

            <ProductTabs 
              product={product}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

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
