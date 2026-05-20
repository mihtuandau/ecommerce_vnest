"use client";

import React from "react";
import { X, Copy, Check, Facebook, Instagram, MessageSquare, Mail } from "lucide-react";
import { cn } from "@/utils/cn";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareLink: string;
  copied: boolean;
  onCopy: () => void;
  onSocialShare: (platform: string) => void;
}

export function ShareModal({
  isOpen,
  onClose,
  shareLink,
  copied,
  onCopy,
  onSocialShare,
}: ShareModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-brand-espresso/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-brand-sand animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-brand-sand/50 flex items-center justify-between">
          <span className="font-serif-brand text-lg font-bold text-brand-espresso">
            Chia sẻ danh sách yêu thích
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-brand-sand bg-brand-cream hover:bg-brand-ivory text-brand-taupe hover:text-brand-espresso transition-all flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => onSocialShare("Facebook")}
              className="flex flex-col items-center gap-2 p-3 border border-brand-sand rounded-xl bg-white hover:bg-[#1877F2]/5 hover:border-[#1877F2]/30 transition-all group"
            >
              <Facebook className="w-6 h-6 text-[#1877F2] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-brand-taupe group-hover:text-[#1877F2] transition-colors">
                Facebook
              </span>
            </button>
            <button
              onClick={() => onSocialShare("Instagram")}
              className="flex flex-col items-center gap-2 p-3 border border-brand-sand rounded-xl bg-white hover:bg-[#E1306C]/5 hover:border-[#E1306C]/30 transition-all group"
            >
              <Instagram className="w-6 h-6 text-[#E1306C] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-brand-taupe group-hover:text-[#E1306C] transition-colors">
                Instagram
              </span>
            </button>
            <button
              onClick={() => onSocialShare("Zalo")}
              className="flex flex-col items-center gap-2 p-3 border border-brand-sand rounded-xl bg-white hover:bg-[#0068FF]/5 hover:border-[#0068FF]/30 transition-all group"
            >
              <svg 
                className="w-6 h-6 text-[#0068FF] group-hover:scale-110 transition-transform" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                <path d="M9 10h4l-4 4h4" strokeWidth="2.5" />
              </svg>
              <span className="text-[11px] font-bold text-brand-taupe group-hover:text-[#0068FF] transition-colors">
                Zalo
              </span>
            </button>
            <button
              onClick={() => onSocialShare("Email")}
              className="flex flex-col items-center gap-2 p-3 border border-brand-sand rounded-xl bg-white hover:bg-[#EA4335]/5 hover:border-[#EA4335]/30 transition-all group"
            >
              <Mail className="w-6 h-6 text-[#EA4335] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-brand-taupe group-hover:text-[#EA4335] transition-colors">
                Email
              </span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[12px] font-bold text-brand-taupe uppercase tracking-wider block">
              Đường dẫn chia sẻ
            </label>
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-2.5 border border-brand-sand rounded-xl text-[13px] text-brand-espresso bg-brand-cream/40 focus:bg-white focus:border-brand-espresso outline-none transition-all font-mono"
                value={shareLink}
                readOnly
              />
              <button
                onClick={onCopy}
                className="px-4 py-2.5 bg-brand-espresso hover:bg-brand-espresso/90 text-white rounded-xl text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Đã copy" : "Sao chép"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
