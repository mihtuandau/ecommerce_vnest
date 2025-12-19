import ProductCard from '../products/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

const BestSellingProducts = ({ products = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const nextSlide = () => {
    if (currentIndex < products.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">SẢN PHẨM BÁN CHẠY</h2>
        </div>

        {/* Desktop View - 4 Cards Slider */}
        <div className="hidden md:block relative">
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 4 + 1.5)}%)` }}
            >
              {products.slice(0, 8).map((product) => (
                <div key={product.id} className="flex-shrink-0" style={{ width: 'calc(25% - 18px)' }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-900 hover:bg-black text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <FaChevronLeft className="text-xl" />
            </button>
          )}

          {currentIndex < products.length - 4 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-900 hover:bg-black text-white p-3 rounded-full shadow-lg transition-colors"
            >
              <FaChevronRight className="text-xl" />
            </button>
          )}
        </div>

        {/* Mobile View - Single Card Slider */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex-shrink-0 w-full px-2">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          {currentIndex > 0 && (
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-lg"
            >
              <FaChevronLeft />
            </button>
          )}

          {currentIndex < products.length - 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-2 rounded-full shadow-lg"
            >
              <FaChevronRight />
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {products.length > 2 && [...Array(Math.max(0, products.length - 3))].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentIndex === index ? 'bg-gray-900 w-8' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;
