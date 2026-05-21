"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Shirt,
  Sparkles,
  ShoppingBag,
  Gift,
  Heart,
  Crown,
  Zap,
  Star,
  Laptop,
  BookOpen,
  Home,
  Coffee,
  Palette,
  Trophy,
  Smile,
  Compass,
} from "lucide-react";
import { cn } from "@/utils/cn";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, iconName: string) => void;
}

export const COLLECTION_ICONS = [
  { name: "Shirt", label: "Thời trang", Icon: Shirt },
  { name: "ShoppingBag", label: "Giày & Túi", Icon: ShoppingBag },
  { name: "Sparkles", label: "Mỹ phẩm", Icon: Sparkles },
  { name: "Gift", label: "Quà tặng", Icon: Gift },
  { name: "Heart", label: "Đặc biệt", Icon: Heart },
  { name: "Crown", label: "Cao cấp", Icon: Crown },
  { name: "Zap", label: "Nổi bật", Icon: Zap },
  { name: "Star", label: "Yêu thích nhất", Icon: Star },
  { name: "Laptop", label: "Công nghệ", Icon: Laptop },
  { name: "Coffee", label: "Đồ uống", Icon: Coffee },
  { name: "Palette", label: "Nghệ thuật", Icon: Palette },
  { name: "Compass", label: "Du lịch", Icon: Compass },
];

export function CreateCollectionModal({ isOpen, onClose, onSave }: CreateCollectionModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Shirt");

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setName("");
      setSelectedIcon("Shirt");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave(name.trim(), selectedIcon);
    setName("");
    setSelectedIcon("Shirt");
  };

  return (
    <div className="fixed inset-0 bg-brand-espresso/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-brand-sand animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-brand-sand/50 flex items-center justify-between">
          <span className="font-serif-brand text-lg font-bold text-brand-espresso">
            Tạo bộ sưu tập mới
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-brand-sand bg-brand-cream hover:bg-brand-ivory text-brand-taupe hover:text-brand-espresso transition-all flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          {/* Collection Name */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-brand-espresso uppercase tracking-wider block">
              Tên bộ sưu tập <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full px-4 py-2.5 border border-brand-sand rounded-xl text-[13.5px] text-brand-espresso placeholder-brand-taupe/40 focus:border-brand-espresso outline-none transition-all font-sans-brand"
              type="text"
              placeholder="VD: Đồ đi làm, Outfit đi chơi..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Preset Lucide Icons */}
          <div className="space-y-2">
            <label className="text-[12px] font-bold text-brand-espresso uppercase tracking-wider block">
              Chọn biểu tượng (icon)
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {COLLECTION_ICONS.map((item) => {
                const IconComponent = item.Icon;
                const isSelected = selectedIcon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => {
                      setSelectedIcon(item.name);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-[10px] font-bold text-brand-taupe transition-all hover:bg-brand-cream",
                      isSelected
                        ? "border-brand-espresso bg-brand-cream/80 text-brand-espresso scale-105 shadow-sm"
                        : "border-brand-sand"
                    )}
                    title={item.label}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="truncate max-w-full text-[9px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-brand-sand/50 flex justify-end gap-3 bg-brand-cream/20">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-brand-sand hover:bg-brand-cream text-brand-taupe hover:text-brand-espresso text-[13px] font-semibold rounded-full transition-all"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-6 py-2.5 bg-brand-espresso hover:bg-brand-espresso/90 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[13px] font-semibold rounded-full transition-all shadow-sm font-sans-brand"
          >
            Tạo bộ sưu tập
          </button>
        </div>  
      </div>
    </div>
  );
}
