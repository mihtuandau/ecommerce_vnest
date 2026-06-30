"use client";

import { MessageCircle, Palette } from "lucide-react";
import type { Product } from "@/types/models";

interface ProductEngagementPanelProps {
  product: Product;
  selectedSize: string | null;
  selectedColor: string | null;
}

export function ProductEngagementPanel({
  product,
  selectedSize,
  selectedColor,
}: ProductEngagementPanelProps) {
  const openChatWithMessage = (message: string) => {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { message },
      })
    );
  };

  const handleAskAdvisor = () => {
    const choices = [
      selectedSize ? `size ${selectedSize}` : "size phù hợp",
      selectedColor ? `màu ${selectedColor}` : "màu sắc",
    ].join(", ");

    openChatWithMessage(
      `Tư vấn giúp tôi sản phẩm "${product.name}", đặc biệt về ${choices}.`
    );
  };

  return (
    <div className="rounded-[24px] border border-brand-sand bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-cream text-brand-bronze">
          <MessageCircle size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[14px] font-bold text-brand-espresso">
            Cần tư vấn trước khi mua?
          </h3>
          <p className="mt-1 text-[12.5px] leading-relaxed text-brand-taupe">
            Hỏi nhanh về kích thước, màu sắc, tồn kho hoặc gợi ý phối sản phẩm.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={handleAskAdvisor}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-espresso px-4 text-[12px] font-bold text-white transition-all hover:bg-brand-bronze active:scale-[0.98]"
        >
          <MessageCircle size={15} />
          Hỏi tư vấn ngay
        </button>
        <button
          type="button"
          onClick={() =>
            openChatWithMessage(
              `Sản phẩm "${product.name}" còn màu nào và size nào dễ dùng nhất?`
            )
          }
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-brand-sand bg-brand-cream/50 px-4 text-[12px] font-bold text-brand-espresso transition-all hover:border-brand-bronze hover:bg-brand-cream"
        >
          <Palette size={15} />
          Hỏi màu/size
        </button>
      </div>
    </div>
  );
}
