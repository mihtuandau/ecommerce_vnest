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

const normalizeImagePath = (path: any) => {
  if (typeof path !== 'string' || !path) return "/placeholder.png";
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
};

export function HeaderSearch() {
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
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 hover:text-primary transition-colors z-10"
        >
          <Search className="h-5 w-5" />
        </button>
        <Input
          placeholder={isListening ? "đang nghe..." : "bạn đang tìm kiếm gì hôm nay?"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim().length >= 2 && setShowLiveSearch(true)}
          className={`w-full pl-12 pr-24 h-12 rounded-2xl bg-white border border-slate-100 focus-visible:bg-white focus-visible:border-primary/40 focus-visible:ring-4 focus-visible:ring-primary/10 text-sm transition-all shadow-sm font-normal ${isListening ? "placeholder:text-rose-500" : ""}`}
        />
        
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 z-10">
          <button
            type="button"
            onClick={() => {
              // Trigger AI Chat (we'll need a way to communicate with ChatWidget)
              // For now, we can use a custom event or just let the user open it
              const event = new CustomEvent('open-ai-chat');
              window.dispatchEvent(event);
            }}
            className="p-1.5 text-slate-400 hover:text-primary transition-all flex items-center gap-1.5 hover:bg-primary/5 rounded-lg group/ai"
            title="hỏi trợ lý ai"
          >
            <Sparkles className="h-4 w-4 text-primary/60 group-hover/ai:text-primary transition-colors" />
            <span className="text-[10px] font-medium text-slate-400 group-hover/ai:text-primary">hỏi ai</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-100 mx-1" />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={startVoiceSearch}
            className={`p-1.5 rounded-full transition-all duration-300 ${isListening ? "bg-rose-50 text-rose-500 animate-pulse" : "text-slate-400 hover:text-primary hover:bg-slate-50"}`}
            title="tìm kiếm bằng giọng nói"
          >
            {isListening ? <Mic className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        </div>
      </form>

      {/* ── LIVE SEARCH DROPDOWN ── */}
      {showLiveSearch && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="p-2">
            {/* Quick Match Categories/Brands */}
            {(categories?.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
              brands.some((b: Brand) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))) && (
              <div className="p-3 bg-slate-50/50 rounded-xl mb-2 border border-slate-100/50">
                <p className="text-xs font-medium text-slate-900 mb-3 px-1">Gợi ý tìm kiếm</p>
                <div className="flex flex-wrap gap-2">
                  {categories
                    ?.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .slice(0, 3)
                    .map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/shop?categoryId=${cat.id}`}
                        onClick={() => setShowLiveSearch(false)}
                        className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-600 hover:text-primary hover:border-primary hover:shadow-sm transition-all flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
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
                        onClick={() => setShowLiveSearch(false)}
                        className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs text-slate-600 hover:text-primary hover:border-primary hover:shadow-sm transition-all flex items-center gap-2"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        {brand.name}
                      </Link>
                    ))
                  }
                </div>
              </div>
            )}

            {/* Product Results */}
            <div className="p-1">
              <p className="text-xs font-medium text-slate-900 mb-3 px-3">Sản phẩm phù hợp</p>
              {isLiveLoading ? (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse p-2">
                      <div className="w-14 h-14 bg-slate-100 rounded-xl" />
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                        <div className="h-3 bg-slate-100 rounded-full w-1/4" />
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
                      onClick={() => setShowLiveSearch(false)}
                      className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-all group border border-transparent hover:border-slate-100"
                    >
                      <div className="h-16 w-16 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100 p-1 relative">
                        <Image 
                          src={normalizeImagePath(product.images?.[0]?.url || product.images?.[0] || product.image)} 
                          alt={product.name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-slate-900 truncate transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm font-semibold text-primary">
                            {formatCurrency(Number(product.price || product.basePrice || 0))}
                          </p>
                          {(product.oldPrice || product.originalPrice) && (
                            <p className="text-[10px] text-slate-400 line-through">
                              {formatCurrency(Number(product.oldPrice || product.originalPrice))}
                            </p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                  <Link 
                    href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`}
                    onClick={() => setShowLiveSearch(false)}
                    className="block w-full text-center py-4 text-xs font-medium text-primary hover:bg-primary/5 transition-all border-t border-slate-50 mt-2"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </Link>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-sm text-slate-400 font-medium">Không tìm thấy sản phẩm nào khớp</p>
                  <p className="text-xs text-slate-300 mt-1">Vui lòng thử từ khóa khác</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
