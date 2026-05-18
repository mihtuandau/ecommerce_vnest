"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = "Tìm kiếm...",
  value,
  onChange,
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-650 focus:bg-white transition-all text-slate-700"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
    </div>
  );
}
