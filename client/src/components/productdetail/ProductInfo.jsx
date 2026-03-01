import { FaStar, FaEye } from "react-icons/fa";

const formatViewCount = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const ProductInfo = ({ product }) => {
  return (
    <div>
      {/* Badge & Category - tinh tế hơn */}
      <div className="flex items-center gap-3 mb-4">
        {product.badge && (
          <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-medium uppercase tracking-wider">
            {product.badge}
          </span>
        )}
        {product.category && (
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {product.category.name}
          </span>
        )}
      </div>

      {/* Title - typography sang trọng */}
      <h1 className="text-2xl lg:text-3xl font-light text-gray-900 mb-6 leading-snug tracking-tight">
        {product.name && product.name.length > 150 ? product.name.substring(0, 150) + '...' : product.name}
      </h1>

      {/* SKU & Brand - tinh tế */}
      <div className="flex items-center gap-6 text-xs text-gray-500 mb-8 pb-8 border-b border-gray-200 uppercase tracking-wide">
        {product.brand && (
          <span className="flex items-center gap-2">
            <span className="text-gray-400">Thương hiệu</span>
            <span className="text-gray-900 font-medium">{product.brand.name}</span>
          </span>
        )}
        <span className="w-px h-3 bg-gray-300"></span>
        <span className="flex items-center gap-2">
          <span className="text-gray-400">SKU</span>
          <span className="text-gray-700">{product.sku || "N/A"}</span>
        </span>
      </div>

      {/* Rating & Sold - tinh tế */}
      <div className="flex items-center gap-8 pb-8 mb-8 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.averageRating || 0)
                    ? "text-gray-900"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-900">
            {(product.averageRating || 0).toFixed(1)}
          </span>
          <span className="text-xs text-gray-400">
            ({product.reviewCount || 0} đánh giá)
          </span>
        </div>
        <span className="w-px h-4 bg-gray-200"></span>
        <span className="text-xs text-gray-500">
          Đã bán <span className="text-gray-900 font-medium">{product.soldCount || 0}</span>
        </span>
        <span className="w-px h-4 bg-gray-200"></span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaEye className="text-gray-400" size={13} />
          <span className="text-gray-900 font-medium">{formatViewCount(product.viewCount)}</span> lượt xem
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
