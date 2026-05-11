"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, X, ChevronRight, Heart, Sparkles, Zap, Tag } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productsApi } from "@/features/products/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";

interface MobileMenuProps {
  categories: any[];
  wishlistCount: number;
  onClose: () => void;
  mounted: boolean;
}

const normalizeImagePath = (path: any) => {
  if (typeof path !== 'string' || !path) return "/placeholder.png";
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
};

const NAV_LINKS = [
  { href: "/",           label: "Trang chủ" },
  { href: "/shop",       label: "Cửa hàng" },
  { href: "/shop?sortBy=newest", label: "Hàng mới", icon: Sparkles },
  { href: "/flash-sale",  label: "Flash Sale", icon: Zap },
  { href: "/offers",      label: "Ưu đãi",    icon: Tag },
];

export function MobileMenu({ categories, wishlistCount, onClose, mounted }: MobileMenuProps) {
  const { user, isLoading: authLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const router = useRouter();

  // Live search logic for mobile
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLiveLoading(true);
        try {
          const res = await productsApi.getProducts({ 
            search: searchQuery.trim(),
            limit: 4 
          });
          setLiveResults(res.data || []);
        } catch (error) {
          console.error("Live search failed", error);
        } finally {
          setIsLiveLoading(false);
        }
      } else {
        setLiveResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Mobile Search */}
      <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0 bg-white sticky top-0 z-20">
        <form onSubmit={handleSearch} className="relative">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10">
            <Search className="h-4 w-4" />
          </button>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 h-10 rounded-xl bg-slate-50 border-transparent focus:bg-white text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </form>

        {/* Live Search Results (Mobile) */}
        {searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-slate-100 shadow-xl max-h-[60vh] overflow-y-auto z-30 animate-in fade-in slide-in-from-top-1">
            <div className="p-2">
              <p className="text-xs font-medium text-slate-900 mb-2 px-2">Kết quả gợi ý</p>
              {isLiveLoading ? (
                <div className="p-4 flex items-center justify-center">
                  <Spinner size="sm" />
                </div>
              ) : liveResults.length > 0 ? (
                <div className="space-y-1">
                  {liveResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      <div className="h-12 w-12 rounded-lg bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                        <Image 
                          src={normalizeImagePath(product.images?.[0]?.url || product.images?.[0] || product.image)} 
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {formatCurrency(Number(product.price || product.basePrice || 0))}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full py-3 text-xs font-medium text-primary bg-primary/5 rounded-xl mt-1"
                  >
                    Xem tất cả kết quả cho "{searchQuery}"
                  </button>
                </div>
              ) : (
                <p className="p-4 text-center text-xs text-slate-400">Không tìm thấy sản phẩm</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all"
          >
            {link.icon && <link.icon className="h-4 w-4 flex-shrink-0" />}
            {link.label}
          </Link>
        ))}

        {/* Wishlist */}
        <Link
          href={ROUTES.WISHLIST}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all relative"
        >
          <Heart className="h-4 w-4 flex-shrink-0" />
          Danh sách yêu thích
          {mounted && wishlistCount > 0 && (
            <span className="ml-auto h-5 w-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      {/* Account Info Mobile */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        {!mounted || authLoading ? (
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : user ? (
          <Link href={ROUTES.ACCOUNT} onClick={onClose} className="flex items-center gap-3 p-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">Xem tài khoản</p>
            </div>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link href={ROUTES.LOGIN} onClick={onClose}>
              <button className="w-full py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200">
                Đăng nhập
              </button>
            </Link>
            <Link href={ROUTES.REGISTER} onClick={onClose}>
              <button className="w-full py-2.5 rounded-full text-sm font-bold text-white bg-primary shadow-lg shadow-primary/20">
                Đăng ký
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
