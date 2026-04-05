import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Button from "../common/Button";
import { formatPrice } from "../../utils/formatters";
import StarRating from "../common/StarRating";
import { Package } from "lucide-react";

const ProductGrid = ({
  products = [],
  loading = false,
  viewMode = "grid-4",
}) => {
  const getGridClass = () => {
    switch (viewMode) {
      case "grid-4":
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
      case "grid-3":
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      case "grid-2":
        return "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto lg:gap-8";
      case "grid-1":
        return "grid grid-cols-1 gap-6 max-w-3xl mx-auto";
      case "list":
        return "flex flex-col gap-4 max-w-4xl mx-auto";
      default:
        return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
    }
  };

  if (loading) {
    return (
      <div className={getGridClass()}>
        {[...Array(viewMode === "list" ? 4 : 6)].map((_, i) => (
          <div
            key={i}
            className={`bg-white border border-gray-200 animate-pulse ${
              viewMode === "list" ? "rounded-lg" : ""
            }`}
          >
            {viewMode === "list" ? (
              <div className="flex gap-6 p-6">
                <div className="w-48 h-48 bg-gray-200 flex-shrink-0 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-5 bg-gray-200 w-32 rounded"></div>
                    <div className="h-5 bg-gray-200 w-20 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 w-40 rounded"></div>
                </div>
              </div>
            ) : (
              <>
                <div className={`aspect-square bg-gray-200 ${viewMode === "grid-2" ? "rounded-t-lg" : ""}`}></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                  <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
                  <div className="h-6 bg-gray-200 w-20 rounded"></div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 border border-gray-200 rounded-lg bg-white">
        <div className="flex justify-center mb-4">
          <Package size={48} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-light text-gray-900 mb-2">
          Không tìm thấy sản phẩm
        </h3>
        <p className="text-gray-600">Vui lòng thử thay đổi bộ lọc</p>
      </div>
    );
  }

  // Sử dụng ProductCard cho tất cả view modes
  return (
    <div className={getGridClass()}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
};

export default ProductGrid;