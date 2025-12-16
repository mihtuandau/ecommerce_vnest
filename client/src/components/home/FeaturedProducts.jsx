import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import { FaStar } from 'react-icons/fa';

const FeaturedProducts = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 ">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            SẢN PHẨM NỔI BẬT
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-gray-900 text-sm" />
            ))}
          </div>
        </div>

        {/* Products Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-gray-900 hover:bg-black text-white font-semibold transition-colors"
          >
            Xem Tất Cả Sản Phẩm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
