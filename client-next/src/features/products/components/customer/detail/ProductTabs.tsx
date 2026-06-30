"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  FileText,
  Info,
  MessageSquare,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { Product } from "@/types/models";

import { ReviewList } from "@/features/reviews/components/customer/ReviewList";

interface ProductTabsProps {
  product: Product;
}

type TabId = "description" | "info" | "reviews";

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("description");

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    product.variants?.forEach((variant) => {
      if (variant.isActive && variant.color) colors.add(variant.color);
    });
    return Array.from(colors);
  }, [product.variants]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    product.variants?.forEach((variant) => {
      if (variant.isActive && variant.size) sizes.add(variant.size);
    });
    return Array.from(sizes);
  }, [product.variants]);

  const tabs = [
    { id: "description" as const, label: "Mô tả sản phẩm", icon: FileText },
    { id: "info" as const, label: "Thông tin sản phẩm", icon: Info },
    {
      id: "reviews" as const,
      label: `Đánh giá (${product.reviewCount || 0})`,
      icon: MessageSquare,
    },
  ];

  const description = product.description?.trim();
  const descriptionParagraphs = description
    ? description.split(/\n+/).filter(Boolean)
    : [
        "Sản phẩm được tuyển chọn với chất liệu chỉn chu, phom dáng dễ ứng dụng và hoàn thiện tinh tế cho nhu cầu sử dụng hằng ngày.",
      ];

  const specs = [
    { label: "Thương hiệu", value: product.brand?.name || "LUXE" },
    { label: "Danh mục", value: product.category?.name || "Bộ sưu tập" },
    { label: "Xuất xứ", value: "Việt Nam" },
    {
      label: "Màu sắc",
      value: availableColors.length ? availableColors.join(" / ") : "Theo phân loại",
    },
    {
      label: "Kích thước",
      value: availableSizes.length ? availableSizes.join(" / ") : "Theo phân loại",
    },
    { label: "Tồn kho", value: `${product.stock || 0} sản phẩm` },
    { label: "Đã bán", value: `${product.soldCount || 0} sản phẩm` },
    { label: "SKU", value: String(product.id) },
  ];

  const highlights = [
    "Thiết kế dễ phối trong nhiều hoàn cảnh sử dụng",
    "Hoàn thiện đường may và chi tiết theo tiêu chuẩn chọn lọc",
    "Chất liệu ưu tiên cảm giác thoải mái khi mặc",
    "Phù hợp để mặc hằng ngày, đi làm hoặc đi chơi",
    "Hỗ trợ đổi trả theo chính sách cửa hàng",
  ];

  const productPolicies = [
    {
      title: "Hàng chính hãng",
      description: "Sản phẩm được kiểm tra trước khi giao và có nguồn gốc rõ ràng.",
      icon: BadgeCheck,
    },
    {
      title: "Đóng gói cẩn thận",
      description: "Đơn hàng được xử lý kỹ để giữ sản phẩm sạch đẹp khi đến tay bạn.",
      icon: PackageCheck,
    },
    {
      title: "Hỗ trợ sau mua",
      description: "Đội ngũ chăm sóc khách hàng hỗ trợ đổi trả theo chính sách.",
      icon: MessageSquare,
    },
  ];

  return (
    <section className="bg-transparent">
      <div className="mb-8 flex gap-0 overflow-x-auto border-b border-brand-sand/40 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative -mb-px flex h-12 shrink-0 items-center gap-2 border-b-2 px-4 text-[13px] font-semibold transition-colors sm:px-6 sm:text-[14px]",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-brand-taupe hover:text-primary"
              )}
            >
              <Icon size={16} strokeWidth={1.8} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "description" && (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
            <div className="space-y-4 text-[14.5px] leading-8 text-brand-espresso/80">
              {descriptionParagraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="rounded-2xl border border-brand-sand/30 bg-white/70 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Sparkles size={16} />
                <h3 className="text-[14px] font-bold">Điểm nổi bật</h3>
              </div>
              <div className="grid gap-3">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-[13.5px] leading-6 text-brand-espresso"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={13} strokeWidth={2.4} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "info" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
            <div className="rounded-2xl border border-brand-sand/30 bg-white/75 p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2 text-primary">
                <Info size={16} />
                <h3 className="text-[14px] font-bold">Thông số sản phẩm</h3>
              </div>

              <div className="divide-y divide-brand-sand/20">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="grid grid-cols-[minmax(112px,0.42fr)_1fr] gap-4 py-3 text-[13.5px]"
                  >
                    <span className="text-brand-taupe">{spec.label}</span>
                    {spec.label === "Danh mục" && product.categoryId ? (
                      <Link
                        href={`/shop?categoryId=${product.categoryId}`}
                        className="font-semibold text-primary transition-colors hover:text-brand-bronze"
                      >
                        {spec.value}
                      </Link>
                    ) : (
                      <span className="font-semibold text-primary">{spec.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid content-start gap-4">
              {productPolicies.map((policy) => {
                const Icon = policy.icon;
                return (
                  <div
                    key={policy.title}
                    className="rounded-2xl border border-brand-sand/30 bg-brand-ivory/45 p-5"
                  >
                    <div className="mb-2 flex items-center gap-3 text-primary">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-brand-bronze shadow-sm">
                        <Icon size={17} />
                      </span>
                      <h4 className="text-[14px] font-bold">{policy.title}</h4>
                    </div>
                    <p className="text-[13px] leading-6 text-brand-espresso/70">
                      {policy.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="w-full">
            <ReviewList productId={Number(product.id)} product={product} />
          </div>
        )}
      </div>
    </section>
  );
}
