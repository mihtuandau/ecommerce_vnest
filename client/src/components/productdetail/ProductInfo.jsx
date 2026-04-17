import { Star, Eye } from "lucide-react";

const formatViewCount = (n) => {
  if (!n) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const ProductInfo = ({ product }) => {
  return (
    <div>
      {}
      {product.category && (
        <span className="inline-block text-[10px] font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded mb-2">
          {product.category.name}
        </span>
      )}

      {}
      <h1 className="text-xl font-bold text-gray-900 leading-snug mb-3">
        {product.name}
      </h1>

      {}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
        {}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.floor(product.averageRating || 0)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"}
            />
          ))}
          <span className="ml-1 font-semibold text-gray-700 text-xs">
            {(product.averageRating || 0).toFixed(1)}
          </span>
        </div>

        <span className="text-gray-300">|</span>
        <span className="text-xs">{product.reviewCount || 0} đánh giá</span>

        <span className="text-gray-300">|</span>
        <span className="text-xs">{product.soldCount || 0} đã bán</span>

        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1 text-xs">
          <Eye size={11} />
          {formatViewCount(product.viewCount)} lượt xem
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;






