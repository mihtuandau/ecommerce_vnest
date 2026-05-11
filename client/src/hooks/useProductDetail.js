import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import apiService from '../services/apiService';
import wishlistService from '../services/wishlistService';
import { useCart } from './useCart';
import { useAuth } from './useAuth';
import { useFlashSale } from './useFlashSale';
import { notify } from '../utils/notification';

export const useProductDetail = () => {
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
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [flashSale, setFlashSale] = useState(null);
  const viewedIdRef = useRef(null);

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getOne(id);
      const data = res.data || res;
      setProduct(data);
      if (viewedIdRef.current !== id) {
        viewedIdRef.current = id;
        productService.incrementView(id).catch(() => { });
      }
      if (data.variants?.length) {
        const sizes = [...new Set(data.variants.map(v => v.size).filter(Boolean))];
        const colors = [...new Set(data.variants.map(v => v.color).filter(Boolean))];
        if (sizes.length) setSelectedSize(sizes[0]);
        if (colors.length) setSelectedColor(colors[0]);
        setSelectedVariant(data.variants.find(v => v.stock > 0) || data.variants[0]);
      }
    } catch { notify.error('Không tìm thấy sản phẩm'); } finally { setLoading(false); }
  }, [id]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  useEffect(() => {
    if (product?.id) {
      apiService.get(`/discounts/product/${product.id}`).then(res => setFlashSale(res?.data ?? res)).catch(() => setFlashSale(null));
    }
  }, [product?.id]);

  useEffect(() => {
    if (selectedVariant?.id && user) {
      wishlistService.checkWishlist(selectedVariant.id).then(res => setIsWishlisted(res?.isWishlisted ?? res?.data?.isWishlisted)).catch(() => setIsWishlisted(false));
    }
  }, [selectedVariant?.id, user]);

  const images = useMemo(() => {
    if (!product) return [];
    const merged = [...(selectedVariant?.images || []), ...(product.images || [])];
    const seen = new Set();
    return merged.filter(img => img?.url && !seen.has(img.url) && seen.add(img.url));
  }, [product, selectedVariant]);

  const handleAddToCart = useCallback((buyNow = false) => {
    if (!selectedVariant) return notify.error('Vui lòng chọn size và màu sắc');
    if (quantity > selectedVariant.stock) return notify.error(`Chỉ còn ${selectedVariant.stock} sản phẩm`);
    const pData = { id: product.id, name: product.name, image: selectedVariant.images?.[0]?.url || product.images?.[0]?.url, variant: selectedVariant };
    if (buyNow) navigate('/checkout', { state: { product: pData, quantity } });
    else { addToCart(selectedVariant.id, quantity, pData); notify.success('Đã thêm vào giỏ hàng'); }
  }, [selectedVariant, product, quantity, navigate, addToCart]);

  const toggleWishlist = async () => {
    if (!user) return notify.warning('Vui lòng đăng nhập');
    setWishlistLoading(true);
    try {
      if (isWishlisted) { await wishlistService.removeFromWishlist(selectedVariant.id); setIsWishlisted(false); }
      else { await wishlistService.addToWishlist(selectedVariant.id); setIsWishlisted(true); notify.success('Đã thích'); }
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch { notify.error('Lỗi cập nhật'); } finally { setWishlistLoading(false); }
  };

  return {
    product, loading, images, selectedImage, setSelectedImage, quantity, setQuantity,
    selectedVariant, selectedSize, setSelectedSize, selectedColor, setSelectedColor,
    isWishlisted, wishlistLoading, toggleWishlist, flashSale, handleAddToCart,
    prevImage: () => setSelectedImage(p => p === 0 ? images.length - 1 : p - 1),
    nextImage: () => setSelectedImage(p => p === images.length - 1 ? 0 : p + 1)
  };
};
