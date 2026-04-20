import { Shield, MessageSquare, BarChart2 } from "lucide-react";
import ReviewList from "../products/ReviewList";
import { formatPrice } from "../../utils/formatters";

const ProductTabs = ({ product, activeTab, onTabChange }) => {
  const tabs = [
    { id: "description", label: "Mô tả sản phẩm", icon: Shield },
    {
      id: "reviews",
      label: `Đánh giá (${product.reviewCount || 0})`,
      icon: MessageSquare,
    },
    { id: "specs", label: "Thông số kỹ thuật", icon: BarChart2 },
  ];

  const prices = product.variants?.map((v) => v.price).filter(Boolean) || [];
  const minPrice = prices.length ? Math.min(...prices) : product.basePrice || 0;
  const maxPrice = prices.length ? Math.max(...prices) : product.basePrice || 0;
  const totalStock =
    product.variants?.reduce((s, v) => s + (v.stock || 0), 0) || 0;

  const specs = [
    { label: "Thương hiệu", value: product.brand?.name || "—" },
    { label: "Danh mục", value: product.category?.name || "—" },
    {
      label: "Số biến thể",
      value: `${product.variants?.length || 0} phiên bản`,
    },
    {
      label: "Khoảng giá",
      value: `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`,
      blue: true,
    },
    { label: "Tổng tồn kho", value: totalStock },
    {
      label: "Đã bán",
      value: (product.soldCount || 0).toLocaleString("vi-VN"),
    },
    {
      label: "Lượt xem",
      value: (product.viewCount || 0).toLocaleString("vi-VN"),
    },
    { label: "Slug", value: product.slug || "—", mono: true },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex items-center gap-1.5 px-5 py-3.5 text-[11px] font-semibold tracking-wide transition-colors cursor-pointer ${
                active ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={13} />
              {label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-t" />
              )}
            </button>
          );
        })}
      </div>

      {}
      <div className="p-5">
        {}
        {activeTab === "description" && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
          </p>
        )}

        {}
        {activeTab === "reviews" && (
          <ReviewList productId={product.id} product={product} />
        )}

        {}
        {activeTab === "specs" && (
          <div className="divide-y divide-gray-100">
            {specs.map((row, i) => (
              <div key={i} className="flex items-center py-3 gap-4">
                <span className="w-36 flex-shrink-0 text-sm text-gray-500">
                  {row.label}
                </span>
                <span
                  className={`text-sm ${row.blue ? "text-blue-600 font-medium" : row.mono ? "text-gray-500 font-mono text-xs" : "text-gray-800"}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;






