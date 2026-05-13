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
    <div className="bg-white">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#F3EFE8] overflow-x-auto no-scrollbar mb-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-3 px-8 py-5 text-[14px] font-bold uppercase transition-all whitespace-nowrap",
                isActive 
                  ? "text-[#3D2B1A]" 
                  : "text-[#C4B49A] hover:text-[#3D2B1A]"
              )}
            >
              <Icon size={14} className={isActive ? "text-[#C4783A]" : "text-[#C4B49A]"} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3D2B1A] animate-in fade-in duration-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-700">
        {activeTab === "description" && (
          <div className="max-w-4xl">
            <p className="text-[#8A7966] text-[15px] leading-[1.8] font-medium whitespace-pre-line">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-2xl divide-y divide-[#F3EFE8]">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center py-5 gap-12">
                <span className="w-48 flex-shrink-0 text-[12px] font-bold text-[#C4B49A] tracking-wide">
                  {spec.label}
                </span>
                {spec.label === "Danh mục" ? (
                  <Link 
                    href={`/shop?categoryId=${product.categoryId}`}
                    className="text-[14px] font-bold text-[#3D2B1A] hover:text-[#C4783A] transition-colors"
                  >
                    {spec.value}
                  </Link>
                ) : (
                  <span className="text-[14px] font-bold text-[#3D2B1A]">
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
  