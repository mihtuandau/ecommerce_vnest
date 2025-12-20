import { FaStar } from "react-icons/fa";

const ProductInfo = ({ product }) => {
  return (
    <div>
      {/* Badge & Category */}
      <div className="flex items-center gap-2 mb-3">
        {product.badge && (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
            {product.badge}
          </span>
        )}
        {product.category && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {product.name && product.name.length > 150 ? product.name.substring(0, 150) + '...' : product.name}
      </h1>

      {/* SKU & Brand */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
        {product.brand && (
          <span>
            <span className="font-medium">Thương hiệu:</span>
            <span className="ml-2 text-gray-700">{product.brand.name}</span>
          </span>
        )}
        <span className="text-gray-400">•</span>
        <span>
          <span className="font-medium">SKU:</span>
          <span className="ml-2 text-gray-700">{product.sku || "N/A"}</span>
        </span>
      </div>

      {/* Rating & Sold */}
      <div className="flex items-center gap-6 pb-6 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-bold text-gray-900">
            {(product.averageRating || 0).toFixed(1)}
          </span>
          <span className="text-sm font-medium text-gray-600">
            ({product.reviewCount || 0} đánh giá)
          </span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-medium text-gray-700">
          Đã bán <span className="font-bold text-gray-900">{product.soldCount || 0}</span> sản phẩm
        </span>
      
      </div>
    </div>
  );
};

export default ProductInfo;
