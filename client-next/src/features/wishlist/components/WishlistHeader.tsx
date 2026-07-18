"use client";

import React from "react";
import { Share2, ShoppingBag } from "lucide-react";

interface WishlistHeaderProps {
  onShareClick: () => void;
  onAddAllToCart: () => void;
}

export function WishlistHeader({ onShareClick, onAddAllToCart }: WishlistHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-brand-sand/60 pb-8">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-semibold text-brand-espresso font-serif tracking-tight leading-tight">
          Sản phẩm <em className="italic text-brand-bronze font-serif">yêu thích</em>
        </h1>
        <p className="text-brand-taupe text-[13px] font-medium leading-relaxed">
          Lưu và quản lý các sản phẩm bạn quan tâm nhất.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={onShareClick}
          className="flex items-center gap-2 px-4 py-2.5 border border-brand-sand rounded-xl text-[13px] text-brand-espresso bg-white hover:bg-brand-cream hover:border-brand-taupe transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>Chia sẻ</span>
        </button>
        <button
          onClick={onAddAllToCart}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-espresso hover:bg-brand-espresso/90 text-white rounded-xl text-[13px] transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Thêm tất cả vào giỏ</span>
        </button>
      </div>
    </div>
  );
}
