import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { FileText, ListChecks, MessageSquare } from "lucide-react";
import { Product } from "@/types/models";

import { ReviewList } from "@/features/reviews/components/customer/ReviewList";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Mô tả sản phẩm", icon: FileText },
    { id: "specs", label: "Thông số kỹ thuật", icon: ListChecks },
    { id: "reviews", label: "Đánh giá khách hàng", icon: MessageSquare },
  ];

  const specs = [
    { label: "Thương hiệu", value: product.brand?.name || "—" },
    { label: "Danh mục", value: product.category?.name || "—" },
    { label: "Bảo hành", value: "12 tháng" },
    { label: "Xuất xứ", value: "Việt Nam" },
    { label: "Tồn kho", value: product.stock || 0 },
    { label: "Đã bán", value: product.soldCount || 0 },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-brand-sand/30 p-8 md:p-12 shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-brand-sand/20 overflow-x-auto no-scrollbar mb-12">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-0 mr-12 pb-5 text-[14px] font-bold transition-all whitespace-nowrap",
                isActive ? "text-primary" : "text-brand-taupe/40 hover:text-primary"
              )}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-brand-bronze animate-in slide-in-from-bottom-1 duration-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
        {activeTab === "description" && (
          <div className="max-w-4xl">
            <p className="text-brand-espresso text-[15px] leading-[1.8] font-medium whitespace-pre-line opacity-80">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl divide-y divide-brand-sand/10">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center py-5 gap-12 group">
                <span className="w-40 flex-shrink-0 text-[12px] font-bold text-brand-taupe transition-opacity opacity-50 group-hover:opacity-100">
                  {spec.label}
                </span>
                {spec.label === "Danh mục" ? (
                  <Link
                    href={`/shop?categoryId=${product.categoryId}`}
                    className="text-[14px] font-bold text-primary hover:text-brand-bronze transition-colors"
                  >
                    {spec.value}
                  </Link>
                ) : (
                  <span className="text-[14px] font-bold text-primary">
                    {spec.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-5xl">
            <ReviewList productId={Number(product.id)} product={product} />
          </div>
        )}
      </div>
    </div>
  );
}
