"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    ALL: number;
  };
}

export function CategoryTabs({ activeTab, onTabChange, counts }: CategoryTabsProps) {
  const tabs = [{ id: "ALL", label: "Tất cả danh mục", count: counts.ALL }];

  return (
    <div className="flex items-center border-b border-slate-200 bg-white px-4 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "relative flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === tab.id
              ? "text-slate-900"
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          {tab.label}
          <span
            className={cn(
              "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black transition-all",
              activeTab === tab.id
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-500"
            )}
          >
            {tab.count}
          </span>
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-900" />
          )}
        </button>
      ))}
    </div>
  );
}
