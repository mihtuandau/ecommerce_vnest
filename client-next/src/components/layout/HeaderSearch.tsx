"use client";

import { Search, X, ChevronRight, Mic, MicOff, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useCategories } from "@/features/categories/hooks";
import { useBrands } from "@/features/products/hooks";
import { productsApi } from "@/features/products/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Category, Brand } from "@/types/models";
import Image from "next/image";

import { getImageUrl } from "@/utils/image";
import { cn } from "@/utils/cn";

interface HeaderSearchProps {
  onSearch?: () => void;
  isMobile?: boolean;
}

import React from "react";

export const HeaderSearch = React.memo(function HeaderSearch({ onSearch, isMobile = false }: HeaderSearchProps) {
  const router = useRouter();
  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  const categories = (categoriesData as Category[]) || [];
  const brands = (brandsData as Brand[]) || [];

  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Voice Recognition Logic
  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Trình duyệt của bạn không hỗ trợ tìm kiếm bằng giọng nói.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Live Search Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLiveLoading(true);
        setShowLiveSearch(true);
        try {
          const res = await productsApi.getProducts({ 
            search: searchQuery.trim(),
            limit: 5 
          } as any);
          setLiveResults(res.data || []);
        } catch (error) {
          console.error("Live search failed:", error);
        } finally {
          setIsLiveLoading(false);
        }
      } else {
        setLiveResults([]);
        setShowLiveSearch(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowLiveSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowLiveSearch(false);
      onSearch?.();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowLiveSearch(false);
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-2xl group">
      <form onSubmit={handleSearch} className="relative">
        <button 
          type="submit"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8A7966] hover:text-[#C4783A] transition-colors z-10"
        >
          <Search className="h-5 w-5" />
        </button>
        <Input
          placeholder={isListening ? "đang nghe..." : (isMobile ? "tìm kiếm..." : "bạn đang tìm kiếm gì hôm nay?")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setShowLiveSearch(true)}
          className={`w-full pl-12 ${isMobile ? "pr-12" : "pr-24"} h-12 rounded-full bg-white border border-[#DDD6C8] focus-visible:bg-white focus-visible:border-[#C4783A]/40 focus-visible:ring-4 focus-visible:ring-[#C4783A]/10 text-sm transition-all shadow-sm font-normal text-[#3D2B1A] placeholder:text-[#8A7966] ${isListening ? "placeholder:text-[#C4783A]" : ""}`}
        />
        
        <div className={cn("absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10", isMobile && "hidden")}>
          <button
            type="button"
            onClick={() => {
              const event = new CustomEvent('open-ai-chat');
              window.dispatchEvent(event);
            }}
            className="p-1.5 px-2.5 text-[#8A7966] hover:text-[#C4783A] transition-all flex items-center gap-1.5 hover:bg-[#C4783A]/5 rounded-full group/ai"
            title="hỏi trợ lý ai"
          >
            <Sparkles className="h-4 w-4 text-[#C4783A]/60 group-hover/ai:text-[#C4783A] transition-colors" />
            <span className="text-xs font-medium text-[#8A7966] group-hover/ai:text-[#C4783A]">hỏi ai</span>
          </button>

          <div className="h-4 w-[1px] bg-[#DDD6C8] mx-1" />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-[#C4B49A] hover:text-[#8A7966] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={startVoiceSearch}
            className={`p-1.5 rounded-full transition-all duration-300 ${isListening ? "bg-[#C4783A]/10 text-[#C4783A] animate-pulse" : "text-[#8A7966] hover:text-[#C4783A] hover:bg-[#F3EFE8]"}`}
            title="tìm kiếm bằng giọng nói"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </form>

      {/* ── LIVE SEARCH DROPDOWN ── */}
      {showLiveSearch && (
        <div className={cn(
          "absolute left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(61,43,26,0.1)] border border-[#DDD6C8] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300",
          isMobile ? "fixed inset-x-4 top-20 bottom-4 mt-0 h-auto" : "top-full"
        )}>
          <div className="p-2">
            {/* Quick Match Categories/Brands */}
            {(categories?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
              brands.some((b: Brand) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))) && (
              <div className="p-3 bg-[#FAF8F4] rounded-xl mb-2 border border-[#DDD6C8]/50">
                <p className="text-xs font-medium text-[#3D2B1A] mb-3 px-1">Gợi ý tìm kiếm</p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    ?.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 3)
                    .map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/shop?categoryId=${cat.id}`}
                        onClick={() => {
                          setShowLiveSearch(false);
                          onSearch?.();
                        }}
                        className="px-4 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs text-[#8A7966] hover:text-[#C4783A] hover:border-[#C4783A] hover:shadow-sm transition-all flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C4783A]/40" />
                        {cat.name}
                      </Link>
                    ))
                  }
                  {brands
                    .filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 3)
                    .map(brand => (
                      <Link 
                        key={brand.id} 
                        href={`/shop?brandId=${brand.id}`}
                        onClick={() => {
                          setShowLiveSearch(false);
                          onSearch?.();
                        }}
                        className="px-4 py-2 bg-white border border-[#DDD6C8] rounded-xl text-xs text-[#8A7966] hover:text-[#C4783A] hover:border-[#C4783A] hover:shadow-sm transition-all flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-[#E8E0D0]" />
                        {brand.name}
                      </Link>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Product Results */}
            <div className="p-1">
              <p className="text-xs font-medium text-[#3D2B1A] mb-3 px-3">Sản phẩm phù hợp</p>
              {isLiveLoading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse p-2">
                      <div className="w-14 h-14 bg-[#E8E0D0] rounded-xl" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-3 bg-[#E8E0D0] rounded-full w-3/4" />
                        <div className="h-3 bg-[#E8E0D0] rounded-full w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : liveResults.length > 0 ? (
                <div className="space-y-1">
                  {liveResults.map(product => (
                    <Link 
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={() => {
                        setShowLiveSearch(false);
                        onSearch?.();
                      }}
                      className="flex items-center gap-4 p-3 hover:bg-[#FAF8F4] rounded-xl transition-all group border border-transparent hover:border-[#DDD6C8]"
                    >
                      <div className="h-16 w-16 rounded-xl bg-[#F3EFE8] overflow-hidden flex-shrink-0 border border-[#DDD6C8] p-1 relative">
                        <Image 
                          src={getImageUrl(product.images?.[0]?.url || product.images?.[0] || product.image)} 
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-[#3D2B1A] truncate transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-semibold text-[#3D2B1A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {formatCurrency(Number(product.price || product.basePrice || 0))}
                          </p>
                          {(product.oldPrice || product.originalPrice) && (
                            <p className="text-xs text-[#8A7966] line-through">
                              {formatCurrency(Number(product.oldPrice || product.originalPrice))}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#C4B49A] group-hover:text-[#C4783A] group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                  <Link 
                    href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => {
                      setShowLiveSearch(false);
                      onSearch?.();
                    }}
                    className="block w-full text-center py-4 text-xs font-medium text-[#C4783A] hover:bg-[#FAF8F4] transition-all border-t border-[#DDD6C8] mt-2"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </Link>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="h-16 w-16 bg-[#F3EFE8] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-[#C4B49A]" />
                  </div>
                  <p className="text-sm text-[#8A7966] font-medium">Không tìm thấy sản phẩm nào khớp</p>
                  <p className="text-xs text-[#C4B49A] mt-1">Vui lòng thử từ khóa khác</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
