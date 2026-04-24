"use client";

import Link from "next/link";
import { Search, Menu, ChevronDown, Zap, Tag, Sparkles, X, ChevronRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CartDrawer } from "@/features/cart/components/CartDrawer";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { useCategories } from "@/features/categories/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

const NAV_LINKS = [
  { href: "/",           label: "Trang chủ" },
  { href: "/shop",       label: "Cửa hàng"  },
  { href: "/new",        label: "Hàng mới",  icon: Sparkles },
  { href: "/flash-sale", label: "Flash Sale", icon: Zap, activeColor: "text-[#e85d24]", activeBg: "bg-[#e85d24]/5" },
  { href: "/deals",      label: "Ưu đãi",    icon: Tag },
];

export function Header() {
  const { user, clearAuth } = useAuthStore();
  const { data: categories } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [catOpen, setCatOpen]       = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const catRef = useRef<HTMLDivElement>(null);
  const categoryList = Array.isArray(categories) ? categories : [];
  const activeCategoryId = searchParams.get("category");

  // Đóng category dropdown khi click ngoài
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Khoá scroll body khi mobile menu mở
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Đóng mobile menu khi đổi route
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-lg border-slate-200/50" 
            : "bg-white border-transparent"
        }`}
      >

        {/* ── TOP BAR ── */}
        <div className="border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-18 lg:h-18 items-center gap-4 py-3 lg:py-0">

              {/* LEFT — Hamburger (mobile) + Logo */}
              <div className="flex shrink-0 items-center gap-2 min-w-[160px]">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 -ml-2 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Mở menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/" className="flex items-center gap-2 group">
                  <img
                    src="/logoMT.png"
                    alt="MINHTUANSHOP"
                    className="h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                  <img
                    src="/textlogo.png"
                    alt="MINHTUANSHOP"
                    className="hidden sm:block h-7 w-auto object-contain"
                  />
                </Link>
              </div>

              <div className="hidden lg:flex flex-1 items-center justify-center px-8">
                <div className="relative w-full max-w-2xl group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="Bạn đang tìm kiếm gì hôm nay?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-12 pr-4 h-12 rounded-full bg-slate-100 border-transparent focus-visible:bg-white focus-visible:border-primary/30 focus-visible:ring-4 focus-visible:ring-primary/10 text-sm transition-all"
                  />
                </div>
              </div>

              {/* RIGHT — Cart + User */}
              <div className="flex shrink-0 items-center justify-end gap-1 min-w-[160px]">
                <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full text-slate-600 hover:text-primary hover:bg-primary/5 transition-all" asChild>
                  <Link href={ROUTES.WISHLIST}>
                    <Heart className="h-6 w-6" />
                  </Link>
                </Button>
                <CartDrawer />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-11 w-11 rounded-full">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-base shadow-lg shadow-primary/20">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-slate-100">
                      <DropdownMenuLabel>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild><Link href={ROUTES.ACCOUNT}>Tài khoản của tôi</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href={ROUTES.ORDERS}>Đơn hàng của tôi</Link></DropdownMenuItem>
                      {user.role === "ADMIN" && (
                        <DropdownMenuItem asChild className="text-primary font-bold">
                          <Link href={ROUTES.ADMIN}>Quản trị hệ thống</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => clearAuth()}
                      >
                        Đăng xuất
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild size="sm" className="rounded-full px-5 h-9 text-sm font-semibold">
                    <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
                  </Button>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* ── BOTTOM BAR: Desktop nav ── */}
        <div className="hidden lg:block border-b border-slate-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-12 gap-1">

              {/* Nav links */}
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                const isColored = !!link.activeColor;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap
                      ${isActive
                        ? isColored ? `${link.activeColor} ${link.activeBg}` : "bg-primary text-white"
                        : isColored ? `${link.activeColor} hover:${link.activeBg}` : "text-slate-600 hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {link.label}
                  </Link>
                );
              })}

              {/* Danh mục dropdown */}
              <div className="relative" ref={catRef}>
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200
                    ${catOpen ? "bg-slate-100 text-primary" : "text-slate-600 hover:text-primary hover:bg-primary/5"}`}
                >
                  Danh mục
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
                </button>

                {catOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-[9999] p-2 animate-in fade-in-0 slide-in-from-top-2 duration-150">
                    {categoryList.length === 0 ? (
                      <p className="text-xs text-slate-400 px-4 py-3 text-center">Đang tải...</p>
                    ) : (
                      <div className="max-h-80 overflow-y-auto scrollbar-thin">
                        {categoryList.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.id}`}
                            onClick={() => setCatOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all
                              ${activeCategoryId === String(cat.id)
                                ? "bg-primary text-white"
                                : "text-slate-500 hover:bg-primary/5 hover:text-primary"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${activeCategoryId === String(cat.id) ? "bg-white" : "bg-slate-300"}`} />
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

      </header>

      {/* ════════════════════════════════════════
          MOBILE MENU DRAWER
      ════════════════════════════════════════ */}

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden
          ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[300px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-100 flex-shrink-0">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <img src="/logoMT.png" alt="MINHTUANSHOP" className="h-8 w-auto object-contain" />
            <img src="/textlogo.png" alt="MINHTUANSHOP" className="h-5 w-auto object-contain" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search trong mobile menu */}
        <div className="px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-9 h-9 rounded-full bg-slate-100 border-transparent text-sm"
            />
          </div>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-3 space-y-0.5">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-primary/5 hover:text-primary"}`}
                >
                  {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
                  {link.label}
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              );
            })}
            
            {/* Wishlist Link in Mobile Drawer */}
            <Link
              href={ROUTES.WISHLIST}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all"
            >
              <Heart className="h-4 w-4 flex-shrink-0" />
              Danh sách yêu thích
            </Link>
          </div>

          {/* Danh mục — collapsible */}
          <div className="mt-4 px-3">
            <button
              onClick={() => setMobileCatOpen(!mobileCatOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-widest"
            >
              Danh mục sản phẩm
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${mobileCatOpen ? "rotate-180" : ""}`} />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ${mobileCatOpen ? "max-h-[400px]" : "max-h-0"}`}>
              <div className="space-y-0.5 pt-1">
                {categoryList.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.id}`}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all
                      ${activeCategoryId === String(cat.id)
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-slate-600 hover:bg-primary/5 hover:text-primary font-medium"
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* User section ở cuối drawer */}
        <div className="flex-shrink-0 border-t border-slate-100 p-4">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href={ROUTES.ACCOUNT} className="text-center text-xs font-semibold py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                  Tài khoản
                </Link>
                <Link href={ROUTES.ORDERS} className="text-center text-xs font-semibold py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">
                  Đơn hàng
                </Link>
              </div>
              <button
                onClick={() => { clearAuth(); setMobileOpen(false); }}
                className="w-full text-xs font-semibold py-2 rounded-xl text-destructive hover:bg-destructive/5 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Button asChild className="w-full rounded-full font-semibold">
              <Link href={ROUTES.LOGIN}>Đăng nhập / Đăng ký</Link>
            </Button>
          )}
        </div>

      </div>
    </>
  );
}
