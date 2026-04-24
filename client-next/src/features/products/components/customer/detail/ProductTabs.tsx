"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { Sparkles, LayoutGrid, MessageSquare } from "lucide-react";

interface ProductTabsProps {
  product: any;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Mô tả", icon: LayoutGrid },
    { id: "specs", label: "Thông số", icon: Sparkles },
    { id: "reviews", label: "Đánh giá", icon: MessageSquare },
  ];

  return (
    <div className="space-y-12">
      {/* Tab Navigation */}
      <div className="flex items-center justify-center border-b border-slate-100 overflow-x-auto no-scrollbar">
        <div className="flex gap-10 md:gap-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 pb-5 text-xs font-bold uppercase tracking-wider transition-all relative whitespace-nowrap",
                  isActive 
                    ? "text-primary" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-slate-300")} />
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "description" && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Mô tả sản phẩm</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
            </p>
          </div>
        )}

        {activeTab === "specs" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Thương hiệu", value: product.brand?.name || "Vnest" },
                { label: "Bảo hành", value: "12 tháng" },
                { label: "Xuất xứ", value: "Việt Nam" },
                { label: "Chất liệu", value: "Hợp kim & Polymer" },
                { label: "Trọng lượng", value: "200g" }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{spec.label}</span>
                  <span className="text-sm font-semibold text-slate-900">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-slate-100 border-dashed">
            <MessageSquare className="h-10 w-10 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Chưa có đánh giá nào</p>
            <p className="text-slate-300 text-[10px] mt-1 font-medium">Hãy là người đầu tiên trải nghiệm sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
}
  