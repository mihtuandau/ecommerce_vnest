"use client";

import { Tabs as TabsRoot, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/utils/cn";

interface TabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  counts: {
    ALL: number;
    ACTIVE: number;
    HIDDEN: number;
    LOW_STOCK: number;
  };
}

export function Tabs({ activeTab, onTabChange, counts }: TabsProps) {
  const tabItems = [
    { value: "ALL", label: "Tất cả", count: counts.ALL },
    { value: "ACTIVE", label: "Đang bán", count: counts.ACTIVE },
    { value: "HIDDEN", label: "Đã ẩn", count: counts.HIDDEN },
    { value: "LOW_STOCK", label: "Sắp hết hàng", count: counts.LOW_STOCK },
  ];

  return (
    <div className="px-6 border-b border-slate-100 bg-white">
      <TabsRoot value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="bg-transparent h-auto p-0 gap-8 justify-start border-none">
          {tabItems.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={cn(
                "px-0 py-4 rounded-none border-b-2 border-transparent data-[state=active]:border-teal-700 data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none transition-all gap-2",
                "text-sm font-medium text-slate-500 hover:text-slate-700 data-[state=active]:text-teal-800",
                "bg-transparent !bg-transparent !shadow-none"
              )}
            >
              <span>{item.label}</span>
              {item.count > 0 && (
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full font-medium transition-colors",
                    activeTab === item.value
                      ? "bg-teal-50 text-teal-700"
                      : "bg-slate-100 text-slate-500"
                  )}
                >
                  {item.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </TabsRoot>
    </div>
  );
}
