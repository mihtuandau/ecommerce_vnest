"use client";

import React from "react";

interface Shortcut {
  key: string;
  label: string;
  text: string;
}

interface ShortcutMenuProps {
  isShortcutMenuOpen: boolean;
  shortcuts: Shortcut[];
  onUseShortcut: (text: string) => void;
}

export function ShortcutMenu({
  isShortcutMenuOpen,
  shortcuts,
  onUseShortcut,
}: ShortcutMenuProps) {
  if (!isShortcutMenuOpen) return null;

  return (
    <div className="absolute bottom-full left-5 right-5 mb-3 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
      <div className="bg-slate-50/70 px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-100">
        Phím tắt trả lời nhanh
      </div>
      {shortcuts.map((s, idx) => (
        <div 
          key={idx} 
          onClick={() => onUseShortcut(s.text)}
          className="p-3.5 hover:bg-slate-50/50 cursor-pointer flex gap-3 items-start border-b border-slate-100 last:border-none group transition-colors"
        >
          <span className="px-2 py-0.5 bg-slate-100 text-slate-650 text-[10px] font-mono font-semibold rounded">{s.key}</span>
          <div>
            <div className="text-xs font-semibold text-slate-700 group-hover:text-indigo-650 transition-colors">{s.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{s.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
