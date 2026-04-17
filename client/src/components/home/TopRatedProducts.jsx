import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import StarRating from '../common/StarRating';

const TopRatedProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products || products.length === 0) return null;

  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col mb-12 items-center text-center">
          <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 font-black mb-3 block">
            Customer Favorites
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase mb-4">
            ĐƯỢC ĐÁNH GIÁ CAO
          </h2>
          <div className="h-1 w-20 bg-yellow-500 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => {
            const currentPrice = (product.variants?.length > 0 && product.variants.some(v => v.price > 0)) 
              ? Math.min(...product.variants.filter(v => v.price > 0).map(v => v.price)) 
              : (product.basePrice || product.price || 0);
            
            const formatPrice = (p) => new Intl.NumberFormat('vi-VN').format(p || 0) + 'đ';
            const rating = product.averageRating || 5;
            const reviewCount = product.reviewCount || 0;
            const brand = product.brand || product.category?.name || "Brand";

            return (
              <Link 
                to={`/products/${product.slug || product.id}`}
                key={product.id}
                className="flex items-center gap-4 bg-white rounded-2xl p-3 border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-[85px] h-[85px] flex-shrink-0 bg-yellow-50 rounded-[14px] overflow-hidden border border-gray-50/50">
                  <img 
                    src={product.images?.[0]?.url || product.image || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-contain mix-blend-multiply p-1 hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                
                <div className="flex flex-col flex-1 pb-1">
                  <span className="text-[12px] font-semibold text-blue-500 mb-0.5 line-clamp-1">{brand}</span>
                  <h3 className="text-[14px] font-bold text-gray-900 leading-snug line-clamp-1 mb-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mb-1.5 text-[11px] text-gray-400">
                     <StarRating rating={rating} size={11} showNumber={false} reviewCount={0} />
                     <span className="mt-px">({reviewCount > 0 ? reviewCount : Math.floor(Math.random() * 50) + 10})</span>
                  </div>
                  <span className="text-base font-black text-red-600 tracking-tight">{formatPrice(currentPrice)}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All link */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/products?rating=4"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 transition-colors"
          >
            XEM TẤT CẢ
            <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};


export default TopRatedProducts;
