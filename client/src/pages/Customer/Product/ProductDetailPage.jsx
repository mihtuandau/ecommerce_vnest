import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layouts/Layout';
import Loading from '../../../components/common/Loading';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { ProductImageGallery, ProductDetails } from '../../../components/products/ProductDetail';
import { ProductTabs } from '../../../components/productdetail';
import { productService } from '../../../services/productService';
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

  useEffect(() => {
    loadProduct();
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
        
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        if (colors.length > 0) setSelectedColor(colors[0]);
        
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

    if (buyNow) {
      navigate('/checkout', { state: { product: productData, quantity } });
    } else {
      addToCart(selectedVariant.id, quantity, productData);
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
          <Link to="/products" className="text-[#00a85a] hover:underline">
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
