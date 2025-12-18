import { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';

const ProductRecommendations = ({ productId, categoryId }) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [productId, categoryId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await productService.getRecommendations(productId, categoryId);
      setRecommendedProducts(response.data || response || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <Loading text="Đang tải sản phẩm gợi ý..." />
      </div>
    );
  }

 if (!recommendedProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-light text-gray-900 mb-8 tracking-tight">Sản Phẩm Gợi Ý</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard key={product.id} product={product} viewMode="grid-3" />
        ))}
      </div>
    </div>
  );
};
export default ProductRecommendations;
