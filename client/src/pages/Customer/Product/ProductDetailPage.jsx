import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { ProductTabs } from '../../../components/productdetail';
import { productService } from '../../../services/productService';
import apiService from '../../../services/apiService';
import wishlistService from '../../../services/wishlistService';
import { useCart } from '../../../hooks/useCart';
import { useAuth } from '../../../hooks/useAuth';
import { useFlashSale } from '../../../hooks/useFlashSale';
import ProductRecommendations from '../../../components/products/ProductRecommendations';
import { notify } from '../../../utils/notification';

const DEFAULT_TITLE = 'MINH TUAN STORE';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
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

  // Fetch flash sale when product is loaded
  useEffect(() => {
    if (!product?.id) {
      setFlashSale(null);
      return;
    }
    
    apiService.get(`/discounts/product/${product.id}`)
      .then((res) => {
        const data = res?.data ?? res ?? null;
        setFlashSale(data);
      })
      .catch((err) => {
        console.error("Flash sale fetch error:", err);
        setFlashSale(null);
      });
  }, [product?.id]);

  // Check wishlist status when product + variant loaded
  useEffect(() => {
    if (!selectedVariant?.id || !user) { setIsWishlisted(false); return; }
    wishlistService.checkWishlist(selectedVariant.id)
      .then((res) => setIsWishlisted(res?.isWishlisted ?? res?.data?.isWishlisted ?? false))
      .catch(() => setIsWishlisted(false));
  }, [selectedVariant?.id, user]);

  useEffect(() => {
    if (!product?.name) return;

    document.title = `${product.name} | ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [product?.name]);

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

  const { flashSale: globalFlashSale } = useFlashSale();
  const activeFlashSale = globalFlashSale?.data || globalFlashSale;

  // Lấy dữ liệu từ discount API cho sản phẩm
  const productDiscount = flashSale;

  // ĐỒNG BỘ: Kiểm tra xem sản phẩm này có nằm trong Flash Sale hệ thống không
  const isIncludedInGlobalFlash = useMemo(() => {
    if (!activeFlashSale?.products || !product?.id) return false;
    return activeFlashSale.products.some(p => Number(p.id) === Number(product.id));
  }, [activeFlashSale, product?.id]);

  // Nếu sản phẩm thuộc Flash Sale hệ thống -> Dùng dữ liệu Flash Sale hệ thống để đếm ngược
  // Nếu không -> Dùng dữ liệu discount riêng của sản phẩm
  const effectiveFlashSale = (isIncludedInGlobalFlash || productDiscount?.isFlashSale) 
    ? { ...activeFlashSale, percentage: productDiscount?.percentage || activeFlashSale?.percentage, isFlashSale: true } 
    : productDiscount;

  // Tính giá Flash Sale
  const flashPrice = productDiscount
    ? productDiscount.percentage
      ? Math.round(currentPrice * (1 - productDiscount.percentage / 100))
      : productDiscount.fixedAmount
        ? Math.max(0, currentPrice - productDiscount.fixedAmount)
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
          <Link to="/products" className="text-black hover:underline">>
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white min-h-screen pb-20 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 opacity-70 hover:opacity-100 transition-opacity">
            <Breadcrumb items={[
              { label: 'Sản Phẩm', path: '/products' },
              { label: product.name }
            ]} />
          </div>

          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pt-4 pb-4 items-start">
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
                flashSale={effectiveFlashSale}
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                selectedVariant={selectedVariant}
                quantity={quantity}
                onSizeSelect={setSelectedSize}
                onColorSelect={setSelectedColor}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                isWishlisted={isWishlisted}
                onToggleWishlist={async () => {
                  if (!user) { notify.warning('Vui lòng đăng nhập để lưu yêu thích'); return; }
                  if (!selectedVariant?.id) { notify.warning('Vui lòng chọn phiên bản sản phẩm'); return; }
                  if (wishlistLoading) return;
                  setWishlistLoading(true);
                  try {
                    if (isWishlisted) {
                      await wishlistService.removeFromWishlist(selectedVariant.id);
                      setIsWishlisted(false);
                      notify.info('Đã xoá khỏi danh sách yêu thích');
                    } else {
                      await wishlistService.addToWishlist(selectedVariant.id);
                      setIsWishlisted(true);
                      notify.success('Đã thêm vào danh sách yêu thích!');
                    }
                    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
                  } catch (err) {
                    notify.error('Không thể cập nhật danh sách yêu thích');
                  } finally {
                    setWishlistLoading(false);
                  }
                }}
              />
            </div>

            <div className="mt-20">
              <ProductTabs 
                product={product}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>

          <div className="pt-20 border-t border-gray-100">
            <ProductRecommendations 
              productId={product.id} 
              categoryId={product.categoryId} 
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
