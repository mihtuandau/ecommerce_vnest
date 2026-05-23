"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface CategoryListToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function CategoryListToolbar({
  searchTerm,
  onSearchChange,
}: CategoryListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
      <div className="group relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-teal-600" />
        <Input
          placeholder="Tìm theo tên danh mục..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 rounded-xl border-slate-200 bg-white pl-10 text-sm font-medium transition-all focus:bg-white focus:border-teal-500 focus:ring-teal-100"
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        className="h-10 gap-2 rounded-xl border-slate-200 bg-white text-sm font-medium"
      >
        <Filter className="h-4 w-4 text-slate-400" />
        Bộ lọc
      </Button>
    </div>
  );
}
