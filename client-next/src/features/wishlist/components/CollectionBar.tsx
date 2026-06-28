"use client";

import React from "react";
import { Plus, Heart, FolderOpen } from "lucide-react";
import { isEmojiIcon, WISHLIST_ICON_MAP } from "@/features/wishlist/constants";
import { cn } from "@/utils/cn";
import { WishlistItem } from "@/features/wishlist/store/wishlist.store";

interface CustomCollection {
  name: string;
  icon: string;
}

interface CollectionBarProps {
  itemsCount: number;
  currentColl: string;
  discountFilter: boolean;
  customCollections: CustomCollection[];
  itemCollections: Record<string, string>;
  items: WishlistItem[];
  onSelectColl: (name: string) => void;
  onCreateCollClick: () => void;
}

export function CollectionIcon({ name, className }: { name: string; className?: string }) {
  if (isEmojiIcon(name)) {
    return <span className={cn("inline-flex items-center justify-center text-sm", className)}>{name}</span>;
  }
  const IconComponent = WISHLIST_ICON_MAP[name] || FolderOpen;
  return <IconComponent className={className} />;
}

export function CollectionBar({
  itemsCount,
  currentColl,
  discountFilter,
  customCollections,
  itemCollections,
  items,
  onSelectColl,
  onCreateCollClick,
}: CollectionBarProps) {
  return (
    <div className="bg-white border border-brand-sand/70 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Tất cả */}
        <button
          onClick={() => onSelectColl("all")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-[12.5px] font-semibold transition-all shadow-sm",
            currentColl === "all" && !discountFilter
              ? "bg-brand-espresso border-brand-espresso text-brand-cream"
              : "bg-white border-brand-sand text-brand-taupe hover:border-brand-taupe hover:text-brand-espresso"
          )}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Tất cả</span>
          <span
            className={cn(
              "text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold",
              currentColl === "all" && !discountFilter
                ? "bg-white/20 text-white"
                : "bg-brand-cream text-brand-taupe border border-brand-sand"
            )}
          >
            {itemsCount}
          </span>
        </button>

        {/* Custom collections from LocalStorage */}
        {customCollections.map((coll) => {
          const count = items.filter((item) => itemCollections[item.id] === coll.name).length;
          return (
            <button
              key={coll.name}
              onClick={() => onSelectColl(coll.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-[12.5px] font-bold transition-all shadow-sm",
                currentColl === coll.name && !discountFilter
                  ? "bg-brand-espresso border-brand-espresso text-brand-cream"
                  : "bg-white border-brand-sand text-brand-taupe hover:border-brand-taupe hover:text-brand-espresso"
              )}
            >
              <CollectionIcon name={coll.icon} className="w-3.5 h-3.5" />
              <span>{coll.name}</span>
              <span
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full ml-1 font-bold",
                  currentColl === coll.name && !discountFilter
                    ? "bg-white/20 text-white"
                    : "bg-brand-cream text-brand-taupe border border-brand-sand"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={onCreateCollClick}
        className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-cream hover:bg-brand-ivory border border-brand-sand text-brand-espresso text-[13px] font-bold rounded-xl transition-all self-start md:self-auto shadow-sm"
      >
        <Plus className="w-4 h-4 text-brand-taupe" />
        <span>Tạo bộ sưu tập</span>
      </button>
    </div>
  );
}
