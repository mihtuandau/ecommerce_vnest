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

const DEFAULT_TITLE = 'MINH TUAN STORE';

const normalizeColor = (value) =>
  String(value || '').trim().toLowerCase();

const normalizeOption = (value) =>
  String(value || '').trim().toLowerCase();

const sortVariantImages = (images) =>
  [...images]
    .filter((img) => img?.url)
    .sort((a, b) => {
      if ((b?.isPrimary ? 1 : 0) !== (a?.isPrimary ? 1 : 0)) {
        return (b?.isPrimary ? 1 : 0) - (a?.isPrimary ? 1 : 0);
      }
      return (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0);
    });

const sortProductImages = (images) =>
  [...images]
    .filter((img) => img?.url)
    .sort((a, b) => {
      if ((b?.isThumbnail ? 1 : 0) !== (a?.isThumbnail ? 1 : 0)) {
        return (b?.isThumbnail ? 1 : 0) - (a?.isThumbnail ? 1 : 0);
      }
      return (a?.displayOrder ?? 0) - (b?.displayOrder ?? 0);
    });

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
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedVariant(null);
    setSelectedImage(0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    apiService.get(`/discounts/product/${id}`)
      .then((res) => setFlashSale(res?.data ?? res ?? null))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    if (!product?.name) return;

    document.title = `${product.name} | ${DEFAULT_TITLE}`;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [product?.name]);

  useEffect(() => {
    if (!product?.variants?.length) {
      setSelectedVariant(null);
      return;
    }

    const variants = product.variants;
    const hasSizeOptions = variants.some((v) => Boolean(v.size));
    const hasColorOptions = variants.some((v) => Boolean(v.color));

    // Không tự chọn khi còn thiếu lựa chọn bắt buộc
    if ((hasSizeOptions && !selectedSize) || (hasColorOptions && !selectedColor)) {
      if (selectedVariant !== null) setSelectedVariant(null);
      return;
    }

    // Nếu sản phẩm không có size/color thì tự chọn variant mặc định duy nhất để vẫn mua được
    if (!hasSizeOptions && !hasColorOptions) {
      const fallbackVariant =
        variants.find((v) => v.stock > 0) || variants[0] || null;
      if (fallbackVariant && selectedVariant?.id !== fallbackVariant.id) {
        setSelectedVariant(fallbackVariant);
        setSelectedImage(0);
      }
      return;
    }

    const selectedSizeNormalized = normalizeOption(selectedSize);
    const selectedColorNormalized = normalizeOption(selectedColor);

    const matchedVariant =
      variants.find(
        (v) =>
          (!hasSizeOptions || normalizeOption(v.size) === selectedSizeNormalized) &&
          (!hasColorOptions || normalizeOption(v.color) === selectedColorNormalized) &&
          (v.stock || 0) > 0,
      ) ||
      variants.find(
        (v) =>
          (!hasSizeOptions || normalizeOption(v.size) === selectedSizeNormalized) &&
          (!hasColorOptions || normalizeOption(v.color) === selectedColorNormalized),
      ) ||
      null;

    if (matchedVariant?.id !== selectedVariant?.id) {
      setSelectedVariant(matchedVariant);
      setSelectedImage(0);
    }
  }, [selectedSize, selectedColor, product, selectedVariant]);

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
        setSelectedSize(null);
        setSelectedColor(null);
        setSelectedVariant(null);
      }
    } catch (error) {
      notify.error('Không tìm thấy sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const sortedProductImages = useMemo(() => {
    if (!Array.isArray(product?.images)) return [];
    return sortProductImages(product.images);
  }, [product?.images]);

  const sortedSelectedVariantImages = useMemo(() => {
    if (!Array.isArray(selectedVariant?.images)) return [];
    return sortVariantImages(selectedVariant.images);
  }, [selectedVariant?.images]);

  const sortedSameColorImages = useMemo(() => {
    if (!Array.isArray(product?.variants)) return [];

    const colorSource = selectedVariant?.color || selectedColor;
    if (!colorSource) return [];
    const currentVariantId = selectedVariant?.id;

    const selectedColorNormalized = normalizeColor(colorSource);
    const sameColorVariant = product.variants.find(
      (v) =>
        v?.id !== currentVariantId &&
        normalizeColor(v?.color) === selectedColorNormalized &&
        Array.isArray(v?.images) &&
        v.images.length > 0,
    );

    if (!sameColorVariant?.images?.length) return [];
    return sortVariantImages(sameColorVariant.images);
  }, [product?.variants, selectedVariant?.id, selectedVariant?.color, selectedColor]);

  const images = useMemo(() => {
    if (sortedSelectedVariantImages.length) return sortedSelectedVariantImages;
    if (sortedSameColorImages.length) return sortedSameColorImages;
    return sortedProductImages;
  }, [sortedSelectedVariantImages, sortedSameColorImages, sortedProductImages]);

  const selectedImageUrl = useMemo(() => {
    return images[0]?.url || product?.image || '/placeholder-product.jpg';
  }, [images, product?.image]);

  const handleAddToCart = useCallback((buyNow = false) => {
    if (!selectedVariant) {
      const hasSizeOptions = product?.variants?.some((v) => Boolean(v.size));
      const hasColorOptions = product?.variants?.some((v) => Boolean(v.color));

      if (hasSizeOptions && hasColorOptions) {
        notify.error('Vui lòng chọn size và màu sắc');
      } else if (hasSizeOptions) {
        notify.error('Vui lòng chọn size');
      } else if (hasColorOptions) {
        notify.error('Vui lòng chọn màu sắc');
      } else {
        notify.error('Không tìm thấy biến thể phù hợp');
      }
      return;
    }

    if (quantity > selectedVariant.stock) {
      notify.error(`Chỉ còn ${selectedVariant.stock} sản phẩm trong kho`);
      return;
    }

    const productData = {
      id: product.id,
      name: product.name,
      image: selectedImageUrl,
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
  }, [selectedVariant, product, quantity, selectedImageUrl, navigate, addToCart]);

  const handlePrevImage = useCallback(() => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images]);

  const handleNextImage = useCallback(() => {
    if (!images.length) return;
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images]);

  useEffect(() => {
    if (!images.length) {
      if (selectedImage !== 0) setSelectedImage(0);
      return;
    }

    if (selectedImage > images.length - 1) {
      setSelectedImage(0);
    }
  }, [images, selectedImage]);

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
