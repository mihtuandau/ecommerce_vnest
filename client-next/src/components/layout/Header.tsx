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
  { href: "/", label: "Trang chủ" },
  { href: "/shop?category=ao", label: "Áo" },
  { href: "/shop?category=quan", label: "Quần" },
  { href: "/shop?category=dam-vay", label: "Đầm & Váy" },
  { href: "/shop?category=the-thao", label: "Đồ thể thao" },
  { href: "/shop?category=phu-kien", label: "Phụ kiện" },
  { href: "/shop?category=tui-xach", label: "Túi xách" },
  { href: "/shop?category=giay-dep", label: "Giày dép" },
  { href: "/shop?category=my-pham", label: "Mỹ phẩm" },
  { href: "/flash-sale", label: "Flash Sale 🔥", activeColor: "text-[#e85d24]", activeBg: "bg-[#e85d24]/5" },
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
      <div className="bg-[#3D2B1A] text-[#F0D5BB] text-center text-[12px] tracking-[0.12em] py-2.5 px-4 hidden lg:block w-full z-[60] relative">
        Miễn phí vận chuyển cho đơn từ <span className="text-[#C4783A] font-medium">500.000đ</span> · Đổi trả trong 30 ngày · Hotline: <span className="text-[#C4783A] font-medium">1800 1234</span>
      </div>
      <header className={`w-full sticky top-0 z-50 transition-all duration-500 ${isScrolled ? "bg-[#FAF8F4]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(61,43,26,0.03)] border-b border-white/20" : "bg-[#FAF8F4] border-b border-[#DDD6C8]/30"}`}>
        {/* ── TOP BAR ── */}
        <div className="border-b border-[#DDD6C8]/40 py-3 lg:py-0">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 items-center gap-4">
              {/* LEFT — Logo */}
              <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:min-w-[160px]">
                <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 -ml-2 rounded-full text-[#8A7966] hover:bg-[#F3EFE8] transition-colors">
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
              <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-3 ml-auto">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden h-9 w-9 rounded-full text-[#8A7966] hover:text-[#C4783A] hover:bg-[#C4783A]/5 transition-all"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-[#8A7966] hover:text-[#C4783A] hover:bg-[#C4783A]/5 transition-all relative" asChild>
                  <Link href={ROUTES.WISHLIST}>
                    <Heart className="h-6 w-6" />
                    {mounted && wishlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#3D2B1A] text-xs font-bold text-white shadow-sm ring-2 ring-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <CartDropdown />
                
                {!mounted || authLoading ? (
                  <div className="flex items-center">
                    {initialHasToken ? (
                      <Skeleton className="h-10 w-10 rounded-full bg-[#E8E0D0]" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Skeleton className="hidden sm:flex h-9 w-24 rounded-full bg-[#E8E0D0]" />
                        <Skeleton className="h-9 w-24 rounded-full bg-[#E8E0D0]" />
                      </div>
                    )}
                  </div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full overflow-hidden border border-[#DDD6C8] p-0.5 relative">
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
                          <div className="h-full w-full rounded-full bg-[#3D2B1A] flex items-center justify-center text-[#FAF8F4] font-bold text-sm shadow-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-[#DDD6C8] p-2 bg-[#FAF8F4]">
                      <DropdownMenuLabel className="px-3 py-2">
                        <p className="text-sm font-bold text-[#3D2B1A]">{user.name}</p>
                        <p className="text-xs text-[#8A7966] mt-0.5">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="my-1 bg-[#DDD6C8]" />
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-[#E8E0D0] cursor-pointer"><Link href={ROUTES.ACCOUNT} className="font-semibold text-sm text-[#3D2B1A]">Tài khoản của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-[#E8E0D0] cursor-pointer"><Link href="/orders" className="font-semibold text-sm text-[#3D2B1A]">Đơn hàng của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-[#E8E0D0] cursor-pointer font-semibold text-sm text-[#3D2B1A]">
                        <Link href="/support">Chat với hỗ trợ</Link>
                      </DropdownMenuItem>
                      {user.role === Role.ADMIN && (
                        <DropdownMenuItem asChild className="rounded-xl p-2.5 focus:bg-[#E8E0D0] text-[#C4783A] font-bold cursor-pointer">
                          <Link href={ROUTES.ADMIN}>Quản trị hệ thống</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="my-1 bg-[#DDD6C8]" />
                      <DropdownMenuItem onClick={() => logout()} className="rounded-xl p-2.5 focus:bg-rose-50 focus:text-rose-600 text-rose-500 font-bold text-sm cursor-pointer">Đăng xuất</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" className="hidden sm:flex rounded-full px-5 h-9 text-xs font-semibold border-[#DDD6C8] text-[#8A7966] hover:bg-[#F3EFE8] hover:text-[#3D2B1A] transition-all bg-transparent">
                      <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
                    </Button>
                    <Button asChild size="sm" className="hidden sm:flex rounded-full px-5 h-9 text-xs font-semibold bg-[#3D2B1A] text-[#FAF8F4] hover:bg-[#C4783A] shadow-lg shadow-[#3D2B1A]/10 transition-all active:scale-95">
                      <Link href={ROUTES.REGISTER}>Đăng ký</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Navigation ── */}
        <div className="hidden lg:block border-b border-[#DDD6C8]/30 bg-[#FAF8F4]/80 backdrop-blur-sm" onMouseLeave={() => {
          // If we're not moving into the mega menu, close it
          // This is handled by the menu's own leave logic mostly
        }}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center h-12">
              <div className="flex items-center gap-2">
                {(() => {
                  const categoriesData = categories as any;
                  const categoryList = Array.isArray(categoriesData) ? categoriesData : categoriesData?.data || [];
                  const dynamicNavLinks = [
                    { href: "/", label: "Trang chủ" },
                    { href: "/shop", label: "Cửa hàng" },
                    ...categoryList.slice(0, 8).map((cat: any) => ({
                      href: `/shop?categoryId=${cat.id}`,
                      label: cat.name,
                      categoryId: cat.id,
                      hasChildren: cat.children && cat.children.length > 0
                    })),
                    { href: "/flash-sale", label: "Flash Sale 🔥", activeColor: "text-[#e85d24]", activeBg: "bg-[#e85d24]/5" },
                  ];

                  return dynamicNavLinks.map((link) => {
                    const isSpecificLink = link.href.includes("?");
                    const otherSpecificActive = dynamicNavLinks.some(l => l.href.includes("?") && currentPathWithSearch.includes(l.href));
                    let isActive = false;
                    if (link.href === "/") isActive = pathname === "/";
                    else if (isSpecificLink) isActive = currentPathWithSearch.includes(link.href);
                    else if (link.href === "/shop") isActive = pathname === "/shop" && !otherSpecificActive;
                    else isActive = pathname === link.href;

                    const isColored = !!(link as any).activeColor;
                    const hasChildren = (link as any).hasChildren;
                    
                    return (
                      <div 
                        key={link.label}
                        onMouseEnter={() => {
                          if (hasChildren) {
                            setCatOpen(true);
                            setActiveCategory((link as any).categoryId);
                          } else if (catOpen) {
                            // If moving to a link without children but menu is open, 
                            // we might want to keep it open or close it. 
                            // Usually better to close if it's not a category link.
                            setCatOpen(false);
                            setActiveCategory(null);
                          }
                        }}
                        className="relative"
                      >
                        <Link 
                          href={link.href} 
                          className={`flex items-center px-4 py-2 text-[12px] transition-all duration-300 rounded-lg font-medium whitespace-nowrap
                            ${isActive 
                              ? (isColored ? `${(link as any).activeColor} ${(link as any).activeBg} font-semibold` : "text-[#C4783A] font-semibold") 
                              : (isColored ? `hover:${(link as any).activeBg} ${(link as any).activeColor} font-medium` : "text-[#8A7966] hover:text-[#3D2B1A] hover:bg-[#F3EFE8]")}
                            ${catOpen && activeCategory === (link as any).categoryId ? "bg-[#F3EFE8] text-[#3D2B1A]" : ""}`}
                        >
                          {link.label}
                          {hasChildren && <ChevronDown className={cn("ml-1.5 h-3 w-3 transition-transform duration-300", catOpen && activeCategory === (link as any).categoryId && "rotate-180")} />}
                        </Link>
                      </div>
                    );
                  });
                })()}
              </div>
            </nav>
          </div>
        </div>

        {/* ── MEGA MENU OVERLAY ── */}
        {catOpen && (
          <>
            {/* Backdrop - Starts below the header */}
            <div 
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[9998] animate-in fade-in duration-300 pointer-events-none" 
              style={{ top: '100%' }} // This will be relative to the sticky header
            />
            
            <div 
              className="absolute inset-x-0 top-full bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-b border-[#DDD6C8] z-[9999] animate-in fade-in slide-in-from-top-1 duration-300"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => {
                setCatOpen(false);
                setActiveCategory(null);
              }}
            >
              <div className="max-w-[1400px] mx-auto p-8">
                {activeCategory ? (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-400">
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-xl font-bold text-[#3D2B1A] tracking-tight">
                        {categories?.find(c => c.id === activeCategory)?.name}
                      </h3>
                      <div className="h-px flex-1 bg-[#DDD6C8]/60" />
                      <Link 
                        href={`/shop?categoryId=${activeCategory}`}
                        onClick={() => setCatOpen(false)}
                        className="text-xs font-semibold text-[#C4783A] hover:text-[#3D2B1A] transition-colors"
                      >
                        Xem tất cả sản phẩm →
                      </Link>
                    </div>
                    
                    {(categories?.find(c => c.id === activeCategory)?.children?.length || 0) > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {categories?.find(c => c.id === activeCategory)?.children?.map(sub => (
                          <Link 
                            key={sub.id} 
                            href={`/shop?categoryId=${sub.id}`}
                            onClick={() => setCatOpen(false)}
                            className="group/sub p-4 rounded-2xl bg-[#FAF8F4] hover:bg-white transition-all border border-transparent hover:border-[#DDD6C8] hover:shadow-lg hover:shadow-[#3D2B1A]/5 flex flex-col items-center text-center gap-3"
                          >
                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-white border border-[#DDD6C8] group-hover/sub:scale-105 transition-all">
                              {sub.image ? (
                                <Image 
                                  src={getImageUrl(sub.image)} 
                                  alt={sub.name}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-[#C4B49A]">
                                  <LayoutGrid size={24} />
                                </div>
                              )}
                            </div>
                            <span className="text-sm font-bold text-[#3D2B1A] group-hover/sub:text-[#C4783A] transition-colors">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-[#C4B49A]">
                        <LayoutGrid size={40} className="mb-2 opacity-20" />
                        <p className="text-sm font-medium">Hiện chưa có danh mục con</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </header>

      {/* MOBILE SEARCH OVERLAY */}
      <div className={cn(
        "fixed inset-0 z-[100] bg-[#FAF8F4] transition-all duration-300 transform",
        isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 px-4 h-20 border-b border-[#DDD6C8]">
            <HeaderSearch onSearch={() => setIsSearchOpen(false)} isMobile />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSearchOpen(false)}
              className="font-bold text-[#8A7966] hover:text-[#3D2B1A]"
            >
              Hủy
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-[#FAF8F4]">
            <p className="text-xs font-bold text-[#8A7966] uppercase tracking-widest mb-4">Tìm kiếm phổ biến</p>
            <div className="flex flex-wrap gap-2">
              {["Đầm nữ", "Áo sơ mi", "Túi xách", "Giày cao gót"].map(tag => (
                <button 
                  key={tag}
                  onClick={() => {
                    router.push(`/shop?search=${tag}`);
                    setIsSearchOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-white border border-[#DDD6C8] text-xs font-semibold text-[#8A7966] hover:text-[#C4783A] hover:border-[#C4783A] transition-all"
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
      <aside className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-[#FAF8F4] shadow-2xl flex flex-col transition-transform duration-300 lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#DDD6C8] flex-shrink-0 bg-white">
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
          <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full text-[#8A7966] hover:bg-[#F3EFE8]"><X className="h-5 w-5" /></button>
        </div>
        <MobileMenu categories={categories || []} wishlistCount={wishlistCount} onClose={() => setMobileOpen(false)} mounted={mounted} />
      </aside>
    </>
  );
}
