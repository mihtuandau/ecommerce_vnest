import { Link } from 'react-router-dom';
import ProductCard from '../products/ProductCard';
import Button from '../common/Button';

const FeaturedProducts = ({ products = [] }) => {
  const defaultProducts = [
    {
      id: 1,
      name: 'Áo Thun Nam Cổ Tròn',
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
      price: 199000,
      rating: 4.5,
    },
  ];
  
  
  const displayProducts = products.length > 0 ? products : defaultProducts;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sản Phẩm Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những sản phẩm được yêu thích nhất trong tháng
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/products">
            <Button variant="dark" className="px-8 py-3 rounded-full font-semibold shadow-lg">
              Xem Tất Cả Sản Phẩm
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
