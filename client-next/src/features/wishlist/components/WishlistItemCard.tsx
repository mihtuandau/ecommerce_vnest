"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, Trash2, FolderOpen, Check } from "lucide-react";
import { isEmojiIcon, WISHLIST_ICON_MAP } from "@/features/wishlist/constants";
import { cn } from "@/utils/cn";
import { WishlistItem } from "@/store/useWishlistStore";
import { Price } from "@/components/ui";
import { Button } from "@/components/ui/Button";

interface CustomCollection {
  name: string;
  icon: string;
}

interface WishlistItemCardProps {
  item: WishlistItem;
  viewMode: "grid" | "list";
  customCollections: CustomCollection[];
  itemCollName?: string;
  activeCollectionMenuId: string | null;
  onToggleCollectionMenu: (itemId: string | null) => void;
  onAssignCollection: (itemId: string, collName: string) => void;
  onRemoveFromCollection: (itemId: string) => void;
  onRemoveFromWishlist: (itemId: string) => void;
  onAddToCart: (item: WishlistItem) => void;
  isAddingToCart?: boolean;
}

function LocalCollectionIcon({ name, className }: { name: string; className?: string }) {
  if (isEmojiIcon(name)) {
    return <span className={cn("inline-flex items-center justify-center text-sm", className)}>{name}</span>;
  }
  const IconComponent = WISHLIST_ICON_MAP[name] || FolderOpen;
  return <IconComponent className={className} />;
}

export function WishlistItemCard({
  item,
  viewMode,
  customCollections,
  itemCollName,
  activeCollectionMenuId,
  onToggleCollectionMenu,
  onAssignCollection,
  onRemoveFromCollection,
  onRemoveFromWishlist,
  onAddToCart,
  isAddingToCart,
}: WishlistItemCardProps) {
  const isDiscounted = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = isDiscounted
    ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
    : 0;

  return (
    <div
      className={cn(
        "group relative bg-white border border-brand-sand rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-brand-espresso/5 hover:border-brand-bronze/30 transition-all duration-500",
        viewMode === "list" ? "flex flex-col sm:flex-row" : "flex flex-col h-full"
      )}
    >
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemoveFromWishlist(item.id);
        }}
        className="absolute top-3 right-3 z-30 h-8 w-8 rounded-full bg-white/95 border border-brand-sand text-brand-taupe hover:text-red-500 hover:scale-105 transition-all shadow-md flex items-center justify-center"
        title="Xóa yêu thích"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Product Image & Badges */}
      <Link
        href={`/shop/${item.slug}`}
        className={cn(
          "relative bg-brand-ivory/70 overflow-hidden flex items-center justify-center p-6 shrink-0",
          viewMode === "list" ? "h-44 w-full sm:w-44" : "h-[250px] w-full"
        )}
      >
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out mix-blend-multiply"
        />

        {/* Left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {isDiscounted && (
            <span className="bg-brand-bronze text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
              -{discountPercent}%
            </span>
          )}
          {item.stock <= 3 && item.stock > 0 && (
            <span className="bg-brand-espresso text-brand-cream text-[9px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider animate-pulse">
              Còn ít
            </span>
          )}
        </div>
      </Link>

      {/* Product Info & Actions */}
      <div className="flex-1 p-4 md:p-5 flex flex-col justify-between">
        <div>
          {/* Brand & Category Info */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-brand-taupe uppercase tracking-[0.1em]">
              {item.categoryName || "Bộ sưu tập LUXE"}
            </span>
            {itemCollName && (
              <span className="text-[10.5px] font-bold text-brand-bronze bg-brand-cream border border-brand-sand px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <LocalCollectionIcon
                  name={customCollections.find((c) => c.name === itemCollName)?.icon || "FolderOpen"}
                  className="w-3 h-3 text-brand-bronze"
                />
                <span>{itemCollName}</span>
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            href={`/shop/${item.slug}`}
            className="text-[14.5px] font-medium text-brand-espresso hover:text-brand-bronze transition-colors line-clamp-2 leading-snug mb-2 font-sans-brand"
          >
            {item.name}
          </Link>

          {/* Rating Mock */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center text-brand-bronze text-[11px] gap-0.5">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current opacity-30" />
            </div>
            <span className="text-[11px] text-brand-taupe font-semibold">(4.0)</span>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-4 flex-wrap">
            <Price amount={item.price} originalAmount={item.originalPrice} size="md" />
          </div>
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-3 border-t border-brand-ivory flex items-center gap-2">
          <Button
            onClick={() => onAddToCart(item)}
            disabled={isAddingToCart}
            className="flex-1 h-9 rounded-xl bg-brand-espresso hover:bg-brand-espresso/90 text-white text-[12px] font-bold transition-all flex items-center justify-center gap-1.5"
          >
            {isAddingToCart ? (
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            <span>{isAddingToCart ? "Đang xử lý..." : "Thêm vào giỏ"}</span>
          </Button>

          {/* Move to collection */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollectionMenu(activeCollectionMenuId === item.id ? null : item.id);
              }}
              className={cn(
                "h-9 w-9 rounded-xl border border-brand-sand text-brand-taupe hover:text-brand-espresso hover:border-brand-taupe transition-all flex items-center justify-center shadow-sm",
                activeCollectionMenuId === item.id ? "bg-brand-cream border-brand-taupe text-brand-espresso" : "bg-white"
              )}
              title="Chuyển bộ sưu tập"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            {/* Collection Menu Dropdown */}
            {activeCollectionMenuId === item.id && (
              <div className="absolute right-0 bottom-full mb-2 z-40 bg-white border border-brand-sand rounded-xl shadow-xl p-2 w-48 text-left space-y-1">
                <p className="text-[10px] font-bold text-brand-taupe px-2 py-1 uppercase tracking-wider border-b border-brand-sand/50">
                  Lưu vào bộ sưu tập
                </p>
                {customCollections.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => onAssignCollection(item.id, c.name)}
                    className={cn(
                      "w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-all flex items-center justify-between hover:bg-brand-cream",
                      itemCollName === c.name ? "text-brand-bronze font-bold" : "text-brand-espresso"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <LocalCollectionIcon name={c.icon} className="w-3.5 h-3.5" />
                      <span>{c.name}</span>
                    </span>
                    {itemCollName === c.name && <Check className="w-3.5 h-3.5 text-brand-bronze" />}
                  </button>
                ))}
                {itemCollName && (
                  <button
                    onClick={() => onRemoveFromCollection(item.id)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-[12px] font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border-t border-brand-sand/50 mt-1 flex items-center gap-2"
                  >
                    ✕ Bỏ khỏi bộ sưu tập
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
