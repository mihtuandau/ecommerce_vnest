"use client";

import type { CategoryTab } from "@/features/categories/types";
import { cn } from "@/utils/cn";

interface CategoryTabsProps {
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
  counts: {
    ALL: number;
  };
}

export function CategoryTabs({ activeTab, onTabChange, counts }: CategoryTabsProps) {
  const tabs: Array<{ id: CategoryTab; label: string; count: number }> = [
    { id: "ALL", label: "Tất cả danh mục", count: counts.ALL },
  ];

  return (
    <div className="flex items-center border-b border-slate-200 bg-white px-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-4 text-sm font-medium transition-all",
            activeTab === tab.id
              ? "text-teal-800"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-medium transition-all",
              activeTab === tab.id
                ? "bg-teal-50 text-teal-700"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {tab.count}
          </span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-teal-700" />
          )}
        </button>
      ))}
    </div>
  );
}
