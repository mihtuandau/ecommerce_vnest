import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import { FaStar } from 'react-icons/fa';

const FeaturedProducts = ({ products = [] }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-4 block">Đặc biệt</span>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
            SẢN PHẨM NỔI BẬT
          </h2>
          <div className="w-12 h-px bg-gray-900 mx-auto"></div>
        </div>

        {/* Products Grid - 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products/featured"
            className="inline-block px-10 py-4 bg-[#1a1a1a] hover:opacity-80 text-white text-xs uppercase tracking-wider transition-all"
          >
            Xem Tất Cả Sản Phẩm Nổi Bật
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
