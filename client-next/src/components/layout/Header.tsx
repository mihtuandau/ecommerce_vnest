"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles, Heart, Zap, ChevronRight, Tag, LayoutGrid, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { CartDropdown } from "@/features/cart/components/CartDropdown";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCategories } from "@/features/categories/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
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

const NAV_LINKS = [
  { href: "/",           label: "Trang chủ" },
  { href: "/shop",       label: "Cửa hàng", exact: true },
  { href: "/shop?sortBy=newest", label: "Hàng mới", icon: Sparkles },
  { href: "/flash-sale",  label: "Flash Sale", icon: Zap, activeColor: "text-[#e85d24]", activeBg: "bg-[#e85d24]/5" },
  { href: "/offers",      label: "Ưu đãi",    icon: Tag },
  { href: "/support",     label: "Hỗ trợ" },
];

import { getImageUrl } from "@/utils/image";

// Remove local normalizeImagePath

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  const isAuthSuccess = searchParams.get("auth_success") === "true";
  const currentPathWithSearch = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/70 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white/20" : "bg-white border-b border-transparent"}`}>
        {/* ── TOP BAR ── */}
        <div className="border-b border-slate-100 py-3 lg:py-0">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 items-center gap-4">
              {/* LEFT — Logo */}
              <div className="flex shrink-0 items-center gap-2 min-w-[160px]">
                <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/" className="flex items-center gap-2 group">
                  <Image 
                    src="/logoMT.png" 
                    alt="MINHTUANSHOP" 
                    width={40}
                    height={40}
                    className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200" 
                  />
                  <Image 
                    src="/textlogo.png" 
                    alt="MINHTUANSHOP" 
                    width={140}
                    height={28}
                    className="hidden sm:block h-7 w-auto object-contain" 
                  />
                </Link>
              </div>

              {/* CENTER — Search Bar */}
              <div className="hidden lg:flex flex-1 items-center justify-center px-8">
                <HeaderSearch />
              </div>

              {/* RIGHT — Actions */}
              <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3 ml-auto">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-10 w-10 rounded-full text-slate-600 hover:text-primary hover:bg-primary/5 transition-all"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-6 w-6" />
                </Button>

                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-600 hover:text-primary hover:bg-primary/5 transition-all relative" asChild>
                  <Link href={ROUTES.WISHLIST}>
                    <Heart className="h-6 w-6" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm ring-2 ring-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <CartDropdown />
                
                {!mounted || authLoading ? (
                  <div className="flex items-center">
                    {initialHasToken ? (
                      <Skeleton className="h-10 w-10 rounded-full bg-slate-100" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Skeleton className="hidden sm:flex h-9 w-24 rounded-full bg-slate-100" />
                        <Skeleton className="h-9 w-24 rounded-full bg-slate-100" />
                      </div>
                    )}
                  </div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full overflow-hidden border border-slate-100 p-0.5 relative">
                        {user.avatar ? (
                          <Image
                            src={getImageUrl(user.avatar)}
                            alt={user.name}
                            fill
                            referrerPolicy="no-referrer"
                            className="rounded-full object-cover shadow-sm"
                            sizes="40px"
                          />
                        ) : (
                          <div className="h-full w-full rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100 p-2">
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-1 bg-slate-50" />
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-primary/5 cursor-pointer"><Link href={ROUTES.ACCOUNT} className="font-semibold text-sm">Tài khoản của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-primary/5 cursor-pointer"><Link href="/orders" className="font-semibold text-sm">Đơn hàng của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-primary/5 cursor-pointer font-semibold text-sm">
                        <Link href="/support">Chat với hỗ trợ</Link>
                      </DropdownMenuItem>
                      {user.role === Role.ADMIN && (
                        <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-primary/5 text-primary font-bold cursor-pointer">
                          <Link href={ROUTES.ADMIN}>Quản trị hệ thống</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="my-1 bg-slate-50" />
                      <DropdownMenuItem onClick={() => logout()} className="rounded-xl p-2.5 focus:bg-rose-50 focus:text-rose-600 text-rose-500 font-bold text-sm cursor-pointer">Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="hidden sm:flex rounded-full px-5 h-9 text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary transition-all">
                      <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full px-5 h-9 text-xs font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95">
                      <Link href={ROUTES.REGISTER}>Đăng ký</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Navigation ── */}
        <div className="hidden lg:block border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-12 gap-1">
              {NAV_LINKS.map((link) => {
                const isSpecificLink = link.href.includes("?");
                const otherSpecificActive = NAV_LINKS.some(l => l.href.includes("?") && currentPathWithSearch.includes(l.href));
                let isActive = false;
                if (link.href === "/") isActive = pathname === "/";
                else if (isSpecificLink) isActive = currentPathWithSearch.includes(link.href);
                else if (link.href === "/shop") isActive = pathname === "/shop" && !otherSpecificActive;
                else isActive = pathname === link.href;

                const Icon = link.icon;
                const isColored = !!link.activeColor;
                
                return (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    className={`flex items-center gap-2 px-5 py-2 text-[11px] transition-all duration-300 rounded-full uppercase tracking-widest
                      ${isActive 
                        ? (isColored ? `${link.activeColor} ${link.activeBg} font-bold` : "text-primary font-bold bg-primary/5") 
                        : (isColored ? `hover:${link.activeBg} ${link.activeColor} font-bold` : "text-slate-500 hover:text-primary hover:bg-slate-50 font-bold")}`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="h-4 w-px bg-slate-100 mx-2" />

              <div 
                className="static group/mega" 
                onMouseLeave={() => {
                  setCatOpen(false);
                  setActiveCategory(null);
                }}
              >
                <button 
                  onClick={() => setCatOpen(!catOpen)} 
                  onMouseEnter={() => setCatOpen(true)}
                  className={`flex items-center gap-2 px-5 py-2 text-[11px] transition-all duration-300 rounded-full uppercase tracking-widest font-bold
                    ${catOpen ? "text-primary bg-primary/5" : "text-slate-500 hover:text-primary hover:bg-slate-50"}`}
                >
                  Danh mục
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                </div>
              </nav>
            </div>
          </div>

        {/* ── MEGA MENU OVERLAY ── */}
        {catOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-x-0 bottom-0 top-[121px] bg-black/40 backdrop-blur-sm z-[9998] animate-in fade-in duration-300 pointer-events-none" />
            
            <div 
              className="absolute inset-x-0 top-full bg-white shadow-2xl border-b border-slate-100 z-[9999] animate-in fade-in slide-in-from-top-2 duration-300"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => {
                setCatOpen(false);
                setActiveCategory(null);
              }}
            >
              <div className="max-w-[1400px] mx-auto flex min-h-[400px]">
                {/* Main Categories Panel */}
                <div className="w-80 border-r border-slate-100 p-6 bg-slate-50/30">
                  <div className="px-3 py-2 mb-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Tất cả danh mục</span>
                  </div>
                  <div className="space-y-1 pr-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                    {categories?.map((cat) => (
                      <div 
                        key={cat.id}
                        onMouseEnter={() => setActiveCategory(cat.id)}
                        className={cn(
                          "group flex items-center justify-between px-4 py-3 rounded-2xl transition-all cursor-pointer",
                          activeCategory === cat.id ? "bg-white shadow-md text-primary" : "text-slate-600 hover:bg-white/50 hover:text-primary"
                        )}
                      >
                        <Link 
                          href={`/shop?categoryId=${cat.id}`} 
                          onClick={() => setCatOpen(false)} 
                          className="flex items-center gap-3 flex-1"
                        >
                          <div className={cn(
                            "relative h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 border transition-colors",
                            activeCategory === cat.id ? "border-primary/20" : "border-slate-100 group-hover:border-primary/20 bg-white"
                          )}>
                            {cat.image ? (
                              <Image
                                src={getImageUrl(cat.image)}
                                alt={cat.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-slate-300">
                                <LayoutGrid size={16} />
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold tracking-tight">{cat.name}</span>
                        </Link>
                        {cat.children && cat.children.length > 0 && (
                          <ChevronRight size={14} className={cn("transition-transform", activeCategory === cat.id ? "translate-x-0.5 text-primary" : "text-slate-300")} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub Categories Panel */}
                <div className="flex-1 p-8 bg-white">
                  {activeCategory ? (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="flex items-center gap-3 mb-8">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                          {categories?.find(c => c.id === activeCategory)?.name}
                        </h3>
                        <div className="h-px flex-1 bg-slate-100" />
                        <Link 
                          href={`/shop?categoryId=${activeCategory}`}
                          onClick={() => setCatOpen(false)}
                          className="text-xs font-bold text-primary hover:underline"
                        >
                          Xem tất cả sản phẩm
                        </Link>
                      </div>
                      
                      {categories?.find(c => c.id === activeCategory)?.children?.length! > 0 ? (
                        <div className="grid grid-cols-3 gap-4">
                          {categories?.find(c => c.id === activeCategory)?.children?.map(sub => (
                            <Link 
                              key={sub.id} 
                              href={`/shop?categoryId=${sub.id}`}
                              onClick={() => setCatOpen(false)}
                              className="group/sub p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 flex items-center gap-4"
                            >
                              <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 group-hover/sub:scale-105 transition-all">
                                {sub.image ? (
                                  <Image 
                                    src={getImageUrl(sub.image)}
                                    alt={sub.name}
                                    fill
                                    className="object-cover"
                                    sizes="56px"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center text-slate-200">
                                    <LayoutGrid size={20} />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-700 group-hover/sub:text-primary transition-colors">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">Khám phá ngay</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                          <LayoutGrid size={48} className="mb-4 opacity-20" />
                          <p className="text-sm font-medium">Không có danh mục con</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                       <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center">
                         <Sparkles className="h-8 w-8 text-slate-200" />
                       </div>
                       <p className="text-sm font-bold tracking-tight uppercase opacity-50">Chọn một danh mục để xem thêm</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-white transition-all duration-300 transform",
        isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 px-4 h-20 border-b border-slate-100">
            <HeaderSearch onSearch={() => setIsSearchOpen(false)} isMobile />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSearchOpen(false)}
              className="font-bold text-slate-500"
            >
              Hủy
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Tìm kiếm phổ biến</p>
            <div className="flex flex-wrap gap-2">
              {["iPhone 15", "MacBook Air", "iPad Pro", "AirPods"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    router.push(`/shop?search=${tag}`);
                    setIsSearchOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:text-primary hover:border-primary transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      <div className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setMobileOpen(false)} />
      <aside className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 flex-shrink-0">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Image 
              src="/logoMT.png" 
              alt="Logo" 
              width={32}
              height={32}
              className="h-8 w-auto" 
            />
            <Image 
              src="/textlogo.png" 
              alt="TextLogo" 
              width={100}
              height={20}
              className="h-5 w-auto" 
            />
          </Link>
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>
        <MobileMenu categories={categories || []} wishlistCount={wishlistCount} onClose={() => setMobileOpen(false)} mounted={mounted} />
      </aside>
    </>
  );
}
