"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  ChevronRight,
  Heart,
  Sparkles,
  Zap,
  Tag,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/constants/routes";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { productsApi } from "@/features/products/api";
import { formatCurrency } from "@/utils/formatCurrency";
import { Spinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/utils/cn";

interface MobileMenuProps {
  categories: any[];
  wishlistCount: number;
  onClose: () => void;
  mounted: boolean;
}

import { getImageUrl } from "@/utils/image";
import { ChevronDown, LayoutGrid } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Trang chủ" },
  { href: "/shop", label: "Cửa hàng" },
  { href: "/shop?sortBy=newest", label: "Hàng mới", icon: Sparkles },
  { href: "/flash-sale", label: "Flash Sale", icon: Zap },
  { href: "/offers", label: "Ưu đãi", icon: Tag },
];

export function MobileMenu({
  categories,
  wishlistCount,
  onClose,
  mounted,
}: MobileMenuProps) {
  const { user, isLoading: authLoading } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Live search logic for mobile
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLiveLoading(true);
        try {
          const res = await productsApi.getProducts({
            search: searchQuery.trim(),
            limit: 4,
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
      
      <div className="px-4 py-3 border-b border-brand-sand flex-shrink-0 bg-white sticky top-0 z-20">
        <form onSubmit={handleSearch} className="relative">
          <button
            type="submit"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-taupe z-10"
          >
            <Search className="h-4 w-4" />
          </button>
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 h-10 rounded-xl bg-brand-cream border-transparent focus:bg-white text-sm"
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

        
        {searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 right-0 top-full bg-white border-b border-brand-sand shadow-xl max-h-[60vh] overflow-y-auto z-30 animate-in fade-in slide-in-from-top-1">
            <div className="p-2">
              <p className="text-xs font-medium text-primary mb-2 px-2">
                Kết quả gợi ý
              </p>
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
                      className="flex items-center gap-3 p-2 hover:bg-brand-cream rounded-xl transition-all"
                    >
                      <div className="h-12 w-12 rounded-lg bg-brand-cream overflow-hidden flex-shrink-0 border border-brand-sand">
                        <Image
                          src={getImageUrl(
                            product.images?.[0]?.url ||
                              product.images?.[0] ||
                              product.image
                          )}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {formatCurrency(
                            Number(product.price || product.basePrice || 0)
                          )}
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
                <p className="p-4 text-center text-xs text-brand-taupe">
                  Không tìm thấy sản phẩm
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl nav-item-standard transition-all",
                isActive
                  ? "text-brand-bronze bg-brand-bronze/5 "
                  : "hover:bg-primary/5 hover:text-brand-bronze"
              )}
            >
              {link.icon && <link.icon className="h-4 w-4 flex-shrink-0" />}
              {link.label}
            </Link>
          );
        })}

        
        <div className="pt-2 pb-1">
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-[10px] font-black text-brand-taupe uppercase tracking-widest">
              Danh mục sản phẩm
            </span>
            <div className="h-px flex-1 bg-brand-cream" />
          </div>

          <div className="space-y-1">
            {categories.map((cat) => (
              <MobileCategoryItem key={cat.id} category={cat} onClose={onClose} />
            ))}
          </div>
        </div>

        
        <Link
          href={ROUTES.WISHLIST}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-bold text-brand-taupe hover:bg-primary/5 hover:text-primary transition-all relative uppercase tracking-widest"
        >
          <Heart className="h-4 w-4 flex-shrink-0" />
          Danh sách yêu thích
          {mounted && wishlistCount > 0 && (
            <span className="ml-auto h-5 w-5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center no-uppercase">
              {wishlistCount}
            </span>
          )}
        </Link>
      </div>

      
      <div className="p-4 border-t border-brand-sand bg-brand-cream/50">
        {!mounted || authLoading ? (
          <div className="flex items-center gap-3 p-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col w-full">
            <Link
              href={ROUTES.ACCOUNT}
              onClick={onClose}
              className="flex items-center gap-3 p-2 hover:bg-white rounded-xl transition-all"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate">{user.name}</p>
                <p className="text-xs text-brand-taupe font-medium">
                  Quản lý tài khoản
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-brand-taupe/30" />
            </Link>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Link
                href="/orders"
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-brand-sand text-xs font-bold text-brand-taupe hover:text-primary transition-all shadow-sm"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                Đơn hàng
              </Link>
              <Link
                href={ROUTES.WISHLIST}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-brand-sand text-xs font-bold text-brand-taupe hover:text-primary transition-all shadow-sm"
              >
                <Heart className="h-3.5 w-3.5" />
                Yêu thích
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Link href={ROUTES.LOGIN} onClick={onClose}>
              <button className="w-full py-2.5 rounded-full text-sm font-bold text-brand-taupe bg-white border border-brand-sand">
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

function MobileCategoryItem({
  category,
  onClose,
}: {
  category: any;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <Link
          href={`/shop?categoryId=${category.id}`}
          onClick={onClose}
          className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium text-primary hover:text-brand-bronze transition-all font-sans"
        >
          <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-brand-cream border border-brand-sand flex-shrink-0">
            {category.image ? (
              <Image
                src={getImageUrl(category.image)}
                alt={category.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-300">
                <LayoutGrid size={14} />
              </div>
            )}
          </div>
          {category.name}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 mr-1 rounded-xl text-brand-taupe hover:text-primary transition-all"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="ml-12 border-l-2 border-brand-cream pl-2 py-1 space-y-1 animate-in slide-in-from-top-1 duration-200">
          {category.children.map((sub: any) => (
            <Link
              key={sub.id}
              href={`/shop?categoryId=${sub.id}`}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-bold text-brand-taupe hover:text-primary hover:bg-brand-cream transition-all uppercase tracking-widest"
            >
              <div className="relative h-6 w-6 rounded-md overflow-hidden bg-brand-cream border border-brand-sand flex-shrink-0">
                {sub.image ? (
                  <Image
                    src={getImageUrl(sub.image)}
                    alt={sub.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-200">
                    <LayoutGrid size={10} />
                  </div>
                )}
              </div>
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
