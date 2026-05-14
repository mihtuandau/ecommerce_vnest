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
            "bg-primary text-brand-bronze/80 text-center text-[12px] tracking-[0.12em] hidden lg:block w-full transition-all duration-500 ease-in-out overflow-hidden",
            isVisible ? "h-[38px] py-2.5" : "h-0 opacity-0"
          )}>
            Miễn phí vận chuyển cho đơn từ <span className="text-brand-bronze font-medium">500.000đ</span> · Đổi trả trong 30 ngày · Hotline: <span className="text-brand-bronze font-medium">1800 1234</span>
          </div>

          {/* ── MAIN HEADER CONTENT ── */}
          <header className={cn(
            "w-full bg-white transition-all duration-500 ease-in-out",
            isScrolled ? "shadow-[0_10px_30px_rgba(61,43,26,0.05)] border-b border-brand-ivory" : "border-b border-brand-ivory/50"
          )}>
            {/* MAIN BAR: Logo / Search / Actions */}
            <div className="border-b border-brand-sand/40 h-16 flex items-center bg-white">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-4">
                <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:min-w-[160px]">
                  <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-full text-brand-taupe hover:bg-brand-ivory transition-colors"><Menu size={20} /></button>
                  <Link href="/" className="flex items-center gap-2 group">
                    <Image src="/logoMT.png" alt="Logo" width={40} height={40} className="h-10 w-auto object-contain" />
                    <Image src="/textlogo.png" alt="Text" width={140} height={28} className="hidden sm:block h-7 w-auto object-contain" />
                  </Link>
                </div>
                <div className="hidden lg:flex flex-1 items-center justify-center px-8"><HeaderSearch /></div>
                <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-3 ml-auto">
                  <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9 rounded-full text-brand-taupe" onClick={() => setIsSearchOpen(true)}><Search size={20} /></Button>
                  {mounted ? (
                    <>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-brand-taupe relative" asChild>
                        <Link href={ROUTES.WISHLIST}>
                          <Heart size={24} />
                          {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">{wishlistCount}</span>}
                        </Link>
                      </Button>
                      <CartDropdown />
                      {user ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-brand-cream transition-all">
                              <div className="relative w-9 h-9 rounded-full border border-brand-sand overflow-hidden">
                                {user.avatar ? <Image src={getImageUrl(user.avatar)} alt="User" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs">{user.name?.charAt(0)}</div>}
                              </div>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 bg-white shadow-xl border-brand-sand">
                            {(user.role === Role.ADMIN || user.role === Role.BAN_HANG) && (
                              <>
                                <DropdownMenuItem asChild className="rounded-xl">
                                  <Link href="/admin" className="flex items-center gap-2 px-2 py-2 text-sm text-brand-bronze font-bold">
                                    <ShieldCheck size={16} /> Trang quản trị
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-brand-ivory" />
                              </>
                            )}
                            <DropdownMenuItem asChild className="rounded-xl"><Link href={ROUTES.ACCOUNT} className="flex items-center gap-2 px-2 py-2 text-sm"><UserIcon size={16} /> Hồ sơ</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl"><Link href="/orders" className="flex items-center gap-2 px-2 py-2 text-sm"><ShoppingBag size={16} /> Đơn hàng</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => logout()} className="rounded-xl text-red-500 px-2 py-2 text-sm"><LogOut size={16} className="mr-2" /> Đăng xuất</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link href={ROUTES.LOGIN} className="hidden lg:flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-brand-bronze transition-all">Đăng nhập</Link>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="w-10 h-10 rounded-full" />
                      {initialHasToken ? (
                        <Skeleton className="h-10 w-10 lg:w-32 rounded-full" />
                      ) : (
                        <div className="hidden lg:flex items-center gap-2 bg-brand-sand/10 text-transparent px-5 py-2 rounded-full text-xs font-bold animate-pulse">
                          Đăng nhập
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM BAR: Navigation (Navbar) */}
            <div className={cn(
              "hidden lg:block border-b border-brand-sand/30 bg-white transition-all duration-500 ease-in-out overflow-hidden",
              isVisible ? "h-11 opacity-100" : "h-0 opacity-0 pointer-events-none"
            )}>
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-11 flex items-center justify-center">
                <nav className="flex items-center gap-1">
                  {mounted ? (
                    (() => {
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
                            <Link href={link.href} className={cn("px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all", isActive ? "text-brand-bronze bg-brand-bronze/5" : "text-primary hover:bg-brand-cream hover:text-brand-bronze", (link as any).isHot && "text-orange-600 font-bold")}>
                              {link.label}
                            </Link>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="flex items-center gap-6">
                      <div className="px-4 py-1.5 text-[13px] font-medium text-primary">Trang chủ</div>
                      <div className="px-4 py-1.5 text-[13px] font-medium text-primary">Cửa hàng</div>
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <div className="px-4 py-1.5 text-[13px] font-bold text-orange-600">Flash Sale 🔥</div>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </header>
        </div>

        {/* MEGA MENU OVERLAY */}
        {catOpen && activeCategory && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-brand-sand shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[50] pointer-events-auto" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <div className="max-w-[1400px] mx-auto p-10 grid grid-cols-5 gap-8">
              {categories?.find(c => c.id === activeCategory)?.children?.map(sub => (
                <Link key={sub.id} href={`/shop?categoryId=${sub.id}`} onClick={() => setCatOpen(false)} className="flex flex-col items-center gap-3 group/sub">
                  <div className="w-20 h-20 rounded-2xl bg-brand-cream border border-brand-sand flex items-center justify-center overflow-hidden group-hover/sub:border-brand-bronze transition-all">
                    {sub.image ? <Image src={getImageUrl(sub.image)} alt={sub.name} width={80} height={80} className="object-cover" /> : <LayoutGrid className="text-brand-taupe/40" size={32} />}
                  </div>
                  <span className="text-sm font-bold text-primary group-hover/sub:text-brand-bronze">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spacer - FIXED HEIGHT to avoid jitter during scroll */}
      <div className="h-[64px] lg:h-[146px] w-full" />

      {/* MOBILE SEARCH & MENU */}
      <div className={cn("fixed inset-0 z-[100] bg-brand-cream transition-all duration-300", isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none")}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 px-4 h-20 border-b border-brand-sand bg-white"><HeaderSearch onSearch={() => setIsSearchOpen(false)} isMobile /><Button variant="ghost" onClick={() => setIsSearchOpen(false)}>Hủy</Button></div>
          <div className="flex-1 p-6"><p className="text-xs font-bold text-brand-taupe uppercase tracking-widest mb-4">Phổ biến</p></div>
        </div>
      </div>
      <div className={cn("fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity lg:hidden", mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none")} onClick={() => setMobileOpen(false)} />
      <aside className={cn("fixed top-0 left-0 z-[110] h-full w-[300px] bg-white transition-transform lg:hidden", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex items-center justify-between px-6 h-20 border-b border-brand-sand"><Link href="/" onClick={() => setMobileOpen(false)}><Image src="/logoMT.png" alt="L" width={32} height={32} /></Link><button onClick={() => setMobileOpen(false)}><X /></button></div>
        <MobileMenu categories={categories || []} wishlistCount={wishlistCount} onClose={() => setMobileOpen(false)} mounted={mounted} />
      </aside>
    </>
  );
}
