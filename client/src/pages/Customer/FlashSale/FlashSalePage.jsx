import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShoppingCart, 
  Heart,
  Star,
  Eye
} from 'lucide-react';
import Layout from '../../../components/layouts/Layout';
import { useFlashSale } from '../../../hooks/useFlashSale';
import { formatPrice } from '../../../utils/formatters';
import { useCart } from '../../../hooks/useCart';
import { notify } from '../../../utils/notification';
import Loading from '../../../components/common/Loading';
import StarRating from '../../../components/common/StarRating';
import { useQuery } from '@tanstack/react-query';
import categoryService from '../../../services/categoryService';

/* ---------------- Countdown Helper ---------------- */
function getTimeLeft(endDate) {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

const pad = (n) => String(n).padStart(2, '0');

const formatViewCount = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

/* ---------------- Sub-components ---------------- */
const FlashCard = ({ product, discountPercent }) => {
  const { addToCart } = useCart();
  
  const getLowestPrice = (product) => {
    if (product.variants?.length > 0) {
      const prices = product.variants.map(v => v.price).filter(p => p > 0);
      return prices.length > 0 ? Math.min(...prices) : (product.basePrice || product.price || 0);
    }
    return product.basePrice || product.price || 0;
  };

  const originalPrice = getLowestPrice(product);
  const salePrice = Math.round(originalPrice * (1 - discountPercent / 100));
  
  // Real data for stock and ratings
  const soldCount = product.soldCount || product.sold || 0;
  const remCount = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || product.stock || 0;
  const totalStock = soldCount + remCount > 0 ? soldCount + remCount : 100;
  const soldPercent = Math.min(100, Math.round((soldCount / totalStock) * 100));
  const reviewCount = product.reviewCount || 0;
  const averageRating = product.averageRating || 5;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1, {
      name: product.name,
      image: product.image || (product.images?.[0]?.url),
      price: salePrice
    });
    notify.success(`${product.name} đã được thêm vào giỏ!`);
  };

  return (
    <Link 
      to={`/products/${product.slug || product.id}`} 
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-gray-300 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 block"
    >
      {/* Top Media */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 border-b border-gray-100 flex-shrink-0">
        <img 
          src={product.image || product.images?.[0]?.url || '/placeholder-product.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
        
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-2">
          <div className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{discountPercent}%
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-red-500 transition-all border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100">
           <Heart size={14} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Title strictly constrained to exactly 2 lines. */}
        <h3 
          className="font-medium text-blue-700 text-[13px] sm:text-sm group-hover:text-blue-900 transition-colors mb-1"
          style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: '20px',
            height: '40px'
          }}
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1 mb-2 h-4 w-full">
           <StarRating rating={averageRating} size={11} showNumber={false} reviewCount={0} />
           <span className="text-[11px] text-gray-400">({reviewCount})</span>
           
           <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto font-medium">
              <Eye size={12} className="opacity-80" />
              {formatViewCount(product.viewCount)}
           </span>
        </div>

        {/* Price & Progress */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2 mb-2.5 h-6">
            <span className="text-xl font-heading font-black text-red-500 tracking-tight leading-none">
              {formatPrice(salePrice)}
            </span>
            <span className="text-[11px] text-gray-400 line-through font-medium leading-none">
              {formatPrice(originalPrice)}
            </span>
          </div>

          <div className="space-y-1.5 h-8 flex flex-col justify-end">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-gray-500">
              <span>Đã bán {soldCount}</span>
              <span>{remCount} còn lại</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  soldPercent > 85 ? 'bg-red-500' : 'bg-gradient-to-r from-orange-400 to-red-500'
                }`}
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ---------------- Main Page ---------------- */
const FlashSalePage = () => {
  const { flashSale: rawData, isLoading } = useFlashSale();
  const { data: catData, isLoading: isLoadingCats } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll()
  });

  const [selectedCat, setSelectedCat] = useState('all');
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (rawData?.data?.endDate) {
      setTimeLeft(getTimeLeft(rawData.data.endDate));
      const timer = setInterval(() => {
        const left = getTimeLeft(rawData.data.endDate);
        setTimeLeft(left);
        if (left.expired) clearInterval(timer);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [rawData]);

  if (isLoading || isLoadingCats) return <Loading fullScreen text="Đang tải sự kiện..." />;

  const flashData = rawData?.data || rawData || {};
  const products = flashData.products || [];
  const allCategories = catData?.data || catData || [];

  const getProductCategory = (p) => {
    return p.category || p.Category || p.productCategory || p.ProductCategory || 
           p.categoryId || p.CategoryID || p.category_id || p.categoryName || p.brand;
  };

  const isCategoryMatch = (p, targetId, targetName) => {
    const cat = getProductCategory(p);
    if (!cat) return false;
    
    const catId = typeof cat === 'object' ? cat.id : cat;
    const catName = typeof cat === 'object' ? cat.name : cat;
    
    const sTargetId = String(targetId).toLowerCase();
    const sTargetName = targetName ? String(targetName).toLowerCase() : "";
    
    return String(catId).toLowerCase() === sTargetId || 
           String(catName).toLowerCase() === sTargetId ||
           (sTargetName && String(catName).toLowerCase() === sTargetName);
  };
  
  const categoriesToDisplay = [
    { id: 'all', name: `Tất cả (${products.length})` },
    ...allCategories.map(cat => {
      const count = products.filter(p => isCategoryMatch(p, cat.id, cat.name)).length;
      return { id: cat.id, name: `${cat.name} (${count})` };
    })
  ].filter(cat => cat.name);

  const filteredProducts = products;

  return (
    <Layout>
      <div className="min-h-screen bg-white font-inter pb-24">
        
        {/* ELEGANT MINIMAL HEADER */}
        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 text-center">
           <div className="max-w-7xl mx-auto flex flex-col items-center">
              <p className="text-[11px] md:text-[13px] text-gray-500 tracking-[0.25em] uppercase font-semibold mb-3">
                 S Ự K I Ệ N Đ Ặ C B I Ệ T
              </p>
              <h1 className="font-heading text-3xl md:text-[42px] font-black text-gray-900 uppercase tracking-tight mb-7 flex items-center justify-center gap-3">
                 FLASH SALE
              </h1>
              <div className="w-16 h-[2px] bg-gray-900"></div>
           </div>
        </div>

        {/* PRODUCTS LISTING */}
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <FlashCard 
                  key={product.id} 
                  product={product} 
                  discountPercent={flashData.percentage} 
                />
              ))}
            </div>
            
            {/* No Products State */}
            {!filteredProducts.length && (
              <div className="py-24 text-center border mt-4 border-gray-100 bg-gray-50 rounded-2xl flex flex-col items-center">
                <Zap size={40} className="text-gray-300 mb-4" />
                <h3 className="text-base font-bold text-gray-600 mb-1">Chưa có sản phẩm nào</h3>
                <p className="text-sm font-medium text-gray-400">Hãy chọn danh mục khác nhé!</p>
              </div>
            )}
            
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default FlashSalePage;
