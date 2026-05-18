"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

interface CustomerAccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CustomerAccordionSection({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: CustomerAccordionSectionProps) {
  return (
    <div className="group border-b border-slate-100 last:border-none">
      <div 
        onClick={onToggle}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 group-hover:text-indigo-650 transition-colors">
          <div className="text-slate-400 group-hover:text-indigo-650 transition-colors">{icon}</div>
          {title}
        </div>
        <ChevronDown size={13} className={cn("text-slate-400 transition-transform duration-250", isOpen ? "rotate-180 text-indigo-600" : "")} />
      </div>
      {isOpen && (
        <div className="px-4 pb-4 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}
