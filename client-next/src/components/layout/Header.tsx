"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles, Heart, Zap, ChevronRight, Tag, LayoutGrid, Search, User as UserIcon, ShieldCheck, LogOut, ShoppingBag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartDropdown } from "@/features/cart/components/CartDropdown";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCategories } from "@/features/categories/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Role } from "@/types/enums";
import { cn } from "@/utils/cn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
};

export function Header({ initialHasToken }: { initialHasToken?: boolean }) {
  const { user, logout, isLoading: authLoading } = useAuthStore();
  const wishlistCount = useWishlistStore(state => state.items.length);
  const { data: categories } = useCategories({ tree: 'true' });
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [catOpen, setCatOpen]       = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
          if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
            setIsVisible(true);
          }
        }

        setIsScrolled(currentScrollY > 20);
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="flex flex-col w-full pointer-events-auto">
          {/* ── TOP ANNOUNCEMENT BAR ── */}
          <div className={cn(
            "bg-[#3D2B1A] text-[#F0D5BB] text-center text-[12px] tracking-[0.12em] hidden lg:block w-full transition-all duration-500 ease-in-out overflow-hidden",
            isVisible ? "h-[38px] py-2.5" : "h-0 opacity-0"
          )}>
            Miễn phí vận chuyển cho đơn từ <span className="text-[#C4783A] font-medium">500.000đ</span> · Đổi trả trong 30 ngày · Hotline: <span className="text-[#C4783A] font-medium">1800 1234</span>
          </div>

          {/* ── MAIN HEADER CONTENT ── */}
          <header className={cn(
            "w-full bg-white transition-all duration-500 ease-in-out",
            isScrolled ? "shadow-[0_10px_30px_rgba(61,43,26,0.05)] border-b border-[#F3EFE8]" : "border-b border-[#F3EFE8]/50"
          )}>
            {/* MAIN BAR: Logo / Search / Actions */}
            <div className="border-b border-[#DDD6C8]/40 h-16 flex items-center bg-white">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-4">
                <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:min-w-[160px]">
                  <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-full text-[#8A7966] hover:bg-[#F3EFE8] transition-colors"><Menu size={20} /></button>
                  <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/logoMT.png" alt="Logo" width={40} height={40} className="h-10 w-auto object-contain" />
                    <Image src="/textlogo.png" alt="Text" width={140} height={28} className="hidden sm:block h-7 w-auto object-contain" />
                  </Link>
                </div>
                <div className="hidden lg:flex flex-1 items-center justify-center px-8"><HeaderSearch /></div>
                <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-3 ml-auto">
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full text-[#8A7966]" onClick={() => setIsSearchOpen(true)}><Search size={20} /></Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-[#8A7966] relative" asChild>
                    <Link href={ROUTES.WISHLIST}>
                      <Heart size={24} />
                      {mounted && wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3D2B1A] text-[10px] font-bold text-white ring-2 ring-white">{wishlistCount}</span>}
                    </Link>
                  </Button>
                  <CartDropdown />
                  {mounted && user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 p-1 rounded-full hover:bg-[#FAF8F4] transition-all">
                          <div className="relative w-9 h-9 rounded-full border border-[#DDD6C8] overflow-hidden">
                            {user.avatar ? <Image src={getImageUrl(user.avatar)} alt="User" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-[#3D2B1A] text-white text-xs">{user.name?.charAt(0)}</div>}
                          </div>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white shadow-xl border-[#DDD6C8]">
                        {(user.role === Role.ADMIN || user.role === Role.BAN_HANG) && (
                          <>
                            <DropdownMenuItem asChild className="rounded-xl">
                              <Link href="/admin" className="flex items-center gap-2 px-2 py-2 text-sm text-[#C4783A] font-bold">
                                <ShieldCheck size={16} /> Trang quản trị
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[#F3EFE8]" />
                          </>
                        )}
                        <DropdownMenuItem asChild className="rounded-xl"><Link href={ROUTES.ACCOUNT} className="flex items-center gap-2 px-2 py-2 text-sm"><UserIcon size={16} /> Hồ sơ</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl"><Link href="/orders" className="flex items-center gap-2 px-2 py-2 text-sm"><ShoppingBag size={16} /> Đơn hàng</Link></DropdownMenuItem>
                        <DropdownMenuItem onClick={() => logout()} className="rounded-xl text-red-500 px-2 py-2 text-sm"><LogOut size={16} className="mr-2" /> Đăng xuất</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href="/auth/login" className="hidden lg:flex items-center gap-2 bg-[#3D2B1A] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#C4783A] transition-all">Đăng nhập</Link>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: Navigation (Navbar) */}
            <div className={cn(
              "hidden lg:block border-b border-[#DDD6C8]/30 bg-white transition-all duration-500 ease-in-out overflow-hidden",
              isVisible ? "h-11 opacity-100" : "h-0 opacity-0 pointer-events-none"
            )}>
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-11 flex items-center justify-center">
                <nav className="flex items-center gap-1">
                  {(() => {
                    const categoryList = Array.isArray(categories) ? categories : (categories as any)?.data || [];
                    return [
                      { href: "/", label: "Trang chủ" },
                      { href: "/shop", label: "Cửa hàng" },
                      ...categoryList.slice(0, 8).map((cat: any) => ({
                        href: `/shop?categoryId=${cat.id}`,
                        label: cat.name,
                        categoryId: cat.id,
                        hasChildren: cat.children && cat.children.length > 0
                      })),
                      { href: "/flash-sale", label: "Flash Sale 🔥", isHot: true }
                    ].map((link) => {
                      const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                      return (
                        <div key={link.label} className="relative group/nav" onMouseEnter={() => { if ((link as any).hasChildren) { setCatOpen(true); setActiveCategory((link as any).categoryId); } else { setCatOpen(false); } }}>
                          <Link href={link.href} className={cn("px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all", isActive ? "text-[#C4783A] bg-[#C4783A]/5" : "text-[#3D2B1A] hover:bg-[#FAF8F4] hover:text-[#C4783A]", (link as any).isHot && "text-[#e85d24] font-bold")}>
                            {link.label}
                          </Link>
                        </div>
                      );
                    });
                  })()}
                </nav>
              </div>
            </div>
          </header>
        </div>

        {/* MEGA MENU OVERLAY */}
        {catOpen && activeCategory && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-[#DDD6C8] shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[50] pointer-events-auto" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <div className="max-w-[1400px] mx-auto p-10 grid grid-cols-5 gap-8">
              {categories?.find(c => c.id === activeCategory)?.children?.map(sub => (
                <Link key={sub.id} href={`/shop?categoryId=${sub.id}`} onClick={() => setCatOpen(false)} className="flex flex-col items-center gap-3 group/sub">
                  <div className="w-20 h-20 rounded-2xl bg-[#FAF8F4] border border-[#DDD6C8] flex items-center justify-center overflow-hidden group-hover/sub:border-[#C4783A] transition-all">
                    {sub.image ? <Image src={getImageUrl(sub.image)} alt={sub.name} width={80} height={80} className="object-cover" /> : <LayoutGrid className="text-[#C4B49A]" size={32} />}
                  </div>
                  <span className="text-sm font-bold text-[#3D2B1A] group-hover/sub:text-[#C4783A]">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer - FIXED HEIGHT to avoid jitter during scroll */}
      <div className="h-[64px] lg:h-[146px] w-full" />

      {/* MOBILE SEARCH & MENU */}
      <div className={cn("fixed inset-0 z-[100] bg-[#FAF8F4] transition-all duration-300", isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none")}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 px-4 h-20 border-b border-[#DDD6C8] bg-white"><HeaderSearch onSearch={() => setIsSearchOpen(false)} isMobile /><Button variant="ghost" onClick={() => setIsSearchOpen(false)}>Hủy</Button></div>
          <div className="flex-1 p-6"><p className="text-xs font-bold text-[#8A7966] uppercase tracking-widest mb-4">Phổ biến</p></div>
        </div>
      </div>
      <div className={cn("fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity lg:hidden", mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => setMobileOpen(false)} />
      <aside className={cn("fixed top-0 left-0 z-[110] h-full w-[300px] bg-white transition-transform lg:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-6 h-20 border-b border-[#DDD6C8]"><Link href="/" onClick={() => setMobileOpen(false)}><Image src="/logoMT.png" alt="L" width={32} height={32} /></Link><button onClick={() => setMobileOpen(false)}><X /></button></div>
        <MobileMenu categories={categories || []} wishlistCount={wishlistCount} onClose={() => setMobileOpen(false)} mounted={mounted} />
      </aside>
    </>
  );
}
