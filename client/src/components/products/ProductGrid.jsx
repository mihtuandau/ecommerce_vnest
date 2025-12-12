import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import Button from '../common/Button';
import { formatPrice } from '../../utils/formatters';
import StarRating from '../common/StarRating';

const ProductGrid = ({ products = [], loading = false, viewMode = 'grid-3' }) => {
  // Determine grid classes based on viewMode
  const getGridClass = () => {
    switch(viewMode) {
      case 'grid-2':
        return 'grid grid-cols-1 md:grid-cols-2 gap-6';
      case 'list':
        return 'flex flex-col gap-4';
      case 'grid-3':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    }
  };

  if (loading) {
    return (
      <div className={getGridClass()}>
        {[...Array(viewMode === 'list' ? 4 : 6)].map((_, i) => (
          <div key={i} className="bg-white shadow-sm overflow-hidden animate-pulse">
            {viewMode === 'list' ? (
              <div className="flex gap-4 p-4">
                <div className="w-32 h-32 bg-gray-200 flex-shrink-0"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 w-3/4"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                  <div className="h-4 bg-gray-200 w-1/4"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 w-3/4"></div>
                  <div className="h-4 bg-gray-200 w-1/2"></div>
                  <div className="h-10 bg-gray-200"></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-medium text-gray-600 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-500">
          Vui lòng thử thay đổi bộ lọc hoặc tìm kiếm
        </p>
      </div>
    );
  }

  // List view component
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => {
          const getLowestPrice = () => {
            if (product.variants && product.variants.length > 0) {
              const prices = product.variants.map(v => v.price).filter(p => p > 0);
              return prices.length > 0 ? Math.min(...prices) : (product.basePrice || product.price || 0);
            }
            return product.basePrice || product.price || 0;
          };
          
          const productPrice = getLowestPrice();
          const productImage = product.image || (product.images && product.images.length > 0 ? product.images[0].url : '/placeholder-product.jpg');
          
          return (
            <div key={product.id} className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group">
              <div className="flex gap-6 p-6">
                {/* Image */}
                <Link to={`/products/${product.id}`} className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white">
                    <img
                      src={productImage}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </Link>
                
                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-xl font-medium text-gray-900 hover:text-blue-600 mb-3 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  
                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  
                  {/* Rating & Sold */}
                  <div className="flex items-center gap-4 mb-4">
                    {(product.averageRating > 0 || product.reviewCount > 0) && (
                      <StarRating
                        rating={product.averageRating || 0}
                        size={16}
                        showNumber
                        reviewCount={product.reviewCount || 0}
                      />
                    )}
                    {product.soldCount > 0 && (
                      <span className="text-sm text-gray-500">
                        | Đã bán {product.soldCount}
                      </span>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(productPrice)}
                    </span>
                    {product.originalPrice && product.originalPrice > productPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Grid view
  return (
    <div className={getGridClass()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default ProductGrid;
