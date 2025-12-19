import { Link } from "react-router-dom";
import ReviewList from "../products/ReviewList";

const ProductTabs = ({ product, activeTab, onTabChange }) => {
  return (
    <div className="mt-16 border-t border-gray-100">
      <div className="flex gap-10 border-b border-gray-100">
        <button
          onClick={() => onTabChange('description')}
          className={`py-5 font-light transition-all relative text-sm ${
            activeTab === 'description'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Mô tả sản phẩm
          {activeTab === 'description' && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-900"></div>
          )}
        </button>
        <button
          onClick={() => onTabChange('reviews')}
          className={`py-5 font-light transition-all relative text-sm ${
            activeTab === 'reviews'
              ? 'text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Đánh giá ({product.reviewCount || 0})
          {activeTab === 'reviews' && (
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-900"></div>
          )}
        </button>
      </div>

      <div className="py-10">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-gray-600 font-light text-base leading-relaxed whitespace-pre-line">
              {product.description || 'Chưa có mô tả sản phẩm'}
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="bg-gray-50 border border-gray-100 p-5">
              <p className="text-sm font-light text-gray-600">
                <span className="font-normal text-gray-900">💡 Hướng dẫn:</span> Để đánh giá sản phẩm này, vui lòng đặt hàng và đợi đơn hàng được giao thành công. 
                Sau đó, bạn có thể đánh giá trong trang <Link to="/orders" className="font-normal underline hover:text-gray-900">Đơn hàng của tôi</Link>.
              </p>
            </div>
            <ReviewList productId={product.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
