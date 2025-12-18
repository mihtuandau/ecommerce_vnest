import { FaStar } from "react-icons/fa";

const ProductInfo = ({ product }) => {
  return (
    <div>
      {/* SKU & Brand */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
        <span className="font-light">
          SKU:{" "}
          <span className="font-normal text-gray-700">
            {product.sku || "N/A"}
          </span>
        </span>
        {product.brand && (
          <>
            <span className="text-gray-300">•</span>
            <span className="font-light">
              Thương hiệu:{" "}
              <span className="font-normal text-gray-700">
                {product.brand.name}
              </span>
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating & Sold */}
      <div className="flex items-center gap-6 pb-6 mb-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.averageRating || 0)
                    ? "text-yellow-400"
                    : "text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-normal text-gray-900">
            {(product.averageRating || 0).toFixed(1)}
          </span>
          <span className="text-sm font-light text-gray-500">
            ({product.reviewCount || 0})
          </span>
        </div>
        <span className="text-gray-200">|</span>
        <span className="text-sm font-light text-gray-600">
          Đã bán{" "}
          <span className="font-normal text-gray-900">{product.soldCount || 0}</span>
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
