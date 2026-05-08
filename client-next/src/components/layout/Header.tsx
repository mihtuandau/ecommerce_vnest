"use client";

import Link from "next/link";
import { Menu, X, ChevronDown, Sparkles, Heart, Zap, ChevronRight, Tag } from "lucide-react";
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

const normalizeImagePath = (path: any) => {
  if (typeof path !== 'string' || !path) return "/placeholder.png";
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return `/${path.replace(/\\/g, '/').replace(/^\//, '')}`;
};

export function Header() {
  const { user, logout, isLoading: authLoading } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { data: categories } = useCategories();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [catOpen, setCatOpen]       = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
      <header className={`w-full relative z-40 transition-all duration-300 border-b ${isScrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-slate-200/50" : "bg-white border-transparent"}`}>
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
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-600 hover:text-primary hover:bg-primary/5 transition-all relative" asChild>
                  <Link href={ROUTES.WISHLIST}>
                    <Heart className="h-6 w-6" />
                    {mounted && wishlistItems.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>
                </Button>
                <CartDropdown />
                
                {!mounted ? (
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100/50" />
                  </div>
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full overflow-hidden border border-slate-100 p-0.5 relative">
                        {user.avatar ? (
                          <Image
                            src={normalizeImagePath(user.avatar)}
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
                    className={`flex items-center gap-2 px-5 py-2 text-sm transition-all duration-300 rounded-full
                      ${isActive 
                        ? (isColored ? `${link.activeColor} ${link.activeBg}` : "text-primary font-bold bg-primary/5") 
                        : (isColored ? `hover:${link.activeBg} ${link.activeColor}` : "text-slate-500 hover:text-primary hover:bg-slate-50 font-semibold")}`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="h-4 w-px bg-slate-100 mx-2" />

              <div className="relative" ref={catRef}>
                <button 
                  onClick={() => setCatOpen(!catOpen)} 
                  className={`flex items-center gap-2 px-5 py-2 text-sm transition-all duration-300 rounded-full
                    ${catOpen ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:text-primary hover:bg-slate-50 font-semibold"}`}
                >
                  Danh mục
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
                </button>
                {catOpen && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-[9999] p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {categories?.map((cat) => (
                        <Link key={cat.id} href={`/shop?categoryId=${cat.id}`} onClick={() => setCatOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-500 hover:bg-slate-50 hover:text-primary transition-all">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

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
        <MobileMenu user={user} categories={categories || []} wishlistCount={wishlistItems.length} onClose={() => setMobileOpen(false)} mounted={mounted} />
      </aside>
    </>
  );
}
