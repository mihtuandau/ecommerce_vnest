import { useState } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Shield, MessageSquare, BarChart2 } from "lucide-react";
import { Product } from "@/types/models";

import { ReviewList } from "@/features/reviews/components/customer/ReviewList";

interface ProductTabsProps {
  product: Product;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Mô tả sản phẩm", icon: Shield },
    { id: "specs", label: "Thông số kỹ thuật", icon: BarChart2 },
    { id: "reviews", label: `Đánh giá (${product.reviewCount || 0})`, icon: MessageSquare },
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
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar bg-slate-50/30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap border-r border-slate-200/60 last:border-r-0",
                isActive 
                  ? "text-primary bg-white" 
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", isActive ? "text-primary" : "text-slate-500")} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-8 animate-in fade-in duration-500">
        {activeTab === "description" && (
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="divide-y divide-slate-100 border-t border-slate-100 mt-[-2rem]">
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center py-4 gap-8">
                <span className="w-40 flex-shrink-0 text-sm font-medium text-slate-500">
                  {spec.label}
                </span>
                {spec.label === "Danh mục" ? (
                  <Link 
                    href={`/shop?categoryId=${product.categoryId}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {spec.value}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-slate-900">
                    {spec.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "reviews" && (
          <ReviewList productId={Number(product.id)} product={product} />
        )}
      </div>
    </div>
  );
}
  