"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Menu,
  X,
  Heart,
  LayoutGrid,
  Search,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { useDisclosure, useMediaQuery, useMounted, usePrevious } from "@/hooks";
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
import { getImageUrl } from "@/utils/image";
import type { SystemSettings } from "@/features/settings/types";
import type { Category } from "@/types/models";

const HeaderSearch = dynamic(
  () => import("./HeaderSearch").then((mod) => mod.HeaderSearch),
  {
    ssr: false,
    loading: () => <Skeleton className="h-11 w-full max-w-[550px] rounded-full" />,
  }
);

const MobileMenu = dynamic(
  () => import("./MobileMenu").then((mod) => mod.MobileMenu),
  {
    ssr: false,
    loading: () => <div className="h-full bg-white" />,
  }
);

const CartDropdown = dynamic(
  () =>
    import("@/features/cart/components/CartDropdown").then(
      (mod) => mod.CartDropdown
    ),
  {
    ssr: false,
    loading: () => (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full text-brand-taupe"
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>
    ),
  }
);

const NotificationBell = dynamic(
  () =>
    import("@/features/notifications/components/customer/NotificationBell").then(
      (mod) => mod.NotificationBell
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-10 w-10 rounded-full" />,
  }
);

type HeaderProps = {
  initialHasToken?: boolean;
  initialSettings?: SystemSettings | null;
  initialCategories?: Category[];
};

export function Header({
  initialHasToken,
  initialSettings,
  initialCategories = [],
}: HeaderProps) {
  const { user, logout, isLoading: authLoading } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const categories = initialCategories;
  const settings = initialSettings;

  const formattedThreshold = settings?.freeShippingThreshold
    ? Number(settings.freeShippingThreshold).toLocaleString("vi-VN") + "đ"
    : "500.000đ";
  const pathname = usePathname();
  const previousPathname = usePrevious(pathname);
  const mounted = useMounted();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const mobileMenu = useDisclosure(false);
  const mobileSearch = useDisclosure(false);

  const [catOpen, setCatOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (previousPathname && previousPathname !== pathname) {
      mobileMenu.close();
      mobileSearch.close();
    }
  }, [mobileMenu, mobileSearch, pathname, previousPathname]);

  useEffect(() => {
    if (isDesktop) {
      mobileMenu.close();
    }
  }, [isDesktop, mobileMenu]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="flex flex-col w-full pointer-events-auto">
          
          <div
            className={cn(
              "bg-primary text-brand-bronze/80 text-center text-[12px] tracking-[0.12em] hidden lg:block w-full transition-all duration-500 ease-in-out overflow-hidden",
              isVisible ? "h-[38px] py-2.5" : "h-0 opacity-0"
            )}
          >
            Miễn phí vận chuyển cho đơn từ{" "}
            <span className="text-brand-bronze font-medium">
              {mounted ? formattedThreshold : "500.000đ"}
            </span>{" "}
            · Đổi trả trong 30 ngày · Hotline:{" "}
            <span className="text-brand-bronze font-medium">
              {mounted ? settings?.storePhone || "1800 1234" : "1800 1234"}
            </span>
          </div>

          
          <header
            className={cn(
              "w-full bg-white transition-all duration-500 ease-in-out font-sans",
              isScrolled
                ? "shadow-[0_10px_30px_rgba(61,43,26,0.05)] border-b border-brand-ivory"
                : "border-b border-brand-ivory/50"
            )}
          >
            
            <div className="border-b border-brand-sand/40 h-16 flex items-center bg-white">
              <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-4">
                <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:min-w-[160px]">
                  <button
                    onClick={mobileMenu.open}
                    className="lg:hidden p-2 -ml-2 rounded-full text-brand-taupe hover:bg-brand-ivory transition-colors"
                  >
                    <Menu size={20} />
                  </button>
                  <Link href="/" className="flex items-center gap-2 group">
                    <Image
                      src="/logoMT.png"
                      alt="Logo"
                      width={40}
                      height={40}
                      className="h-10 w-auto object-contain"
                    />
                    <Image
                      src="/textlogo.png"
                      alt="Text"
                      width={140}
                      height={28}
                      className="hidden sm:block h-7 w-auto object-contain"
                    />
                  </Link>
                </div>
                <div className="hidden lg:flex flex-1 items-center justify-center px-8">
                  <HeaderSearch />
                </div>
                <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-3 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden h-9 w-9 rounded-full text-brand-taupe"
                    onClick={mobileSearch.open}
                  >
                    <Search size={20} />
                  </Button>
                  {mounted ? (
                    <>
                      <NotificationBell />
                      <CartDropdown />
                      {user ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-brand-cream/50 transition-all group outline-none">
                              <div className="relative w-9 h-9 rounded-full border border-brand-sand overflow-hidden ring-0 group-hover:ring-4 ring-brand-bronze/10 transition-all duration-300">
                                {user.avatar ? (
                                  <Image
                                    src={getImageUrl(user.avatar)}
                                    alt="User"
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-primary text-white text-[11px] font-bold">
                                    {user.name?.charAt(0)}
                                  </div>
                                )}
                              </div>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[280px] rounded-[24px] p-2.5 bg-white opacity-100 shadow-[0_30px_60px_rgba(61,43,26,0.18)] border border-brand-sand/60 animate-in fade-in zoom-in-95 duration-300 mt-2.5 z-[100]"
                          >
                            
                            <div className="px-3.5 py-4 mb-2 bg-brand-cream rounded-[18px] flex items-center gap-3.5 border border-brand-sand/20">
                              <div className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden shrink-0 shadow-md">
                                {user.avatar ? (
                                  <Image
                                    src={getImageUrl(user.avatar)}
                                    alt="User"
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-brand-espresso text-white text-[13px] font-bold font-serif">
                                    {user.name?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-[14px] font-bold text-brand-espresso truncate tracking-tight">
                                  {user.name}
                                </span>
                                <span className="text-[11px] text-brand-taupe truncate font-medium">
                                  {user.email}
                                </span>
                              </div>
                            </div>

                            <div className="p-1 space-y-0.5">
                              {(user.role === Role.ADMIN ||
                                user.role === Role.WAREHOUSE ||
                                user.role === Role.SALES) && (
                                <DropdownMenuItem
                                  asChild
                                  className="rounded-xl focus:bg-brand-cream/50 cursor-pointer transition-all duration-200"
                                >
                                  <Link
                                    href={ROUTES.ADMIN}
                                    className="flex items-center gap-3 px-3 py-2.5"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-brand-bronze/10 flex items-center justify-center text-brand-bronze shadow-sm">
                                      <ShieldCheck size={16} strokeWidth={2.5} />
                                    </div>
                                    <span className="text-[13px] font-bold text-brand-bronze">
                                      Quản trị hệ thống
                                    </span>
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem
                                asChild
                                className="rounded-xl focus:bg-brand-cream/50 cursor-pointer transition-all duration-200 group/item"
                              >
                                <Link
                                  href={ROUTES.ACCOUNT}
                                  className="flex items-center gap-3 px-3 py-2.5"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover/item:text-brand-espresso transition-colors">
                                    <UserIcon size={16} />
                                  </div>
                                  <span className="text-[13px] font-medium text-brand-espresso">
                                    Cài đặt tài khoản
                                  </span>
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                asChild
                                className="rounded-xl focus:bg-brand-cream/50 cursor-pointer transition-all duration-200 group/item"
                              >
                                <Link
                                  href="/orders"
                                  className="flex items-center gap-3 px-3 py-2.5"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover/item:text-brand-espresso transition-colors">
                                    <ShoppingBag size={16} />
                                  </div>
                                  <span className="text-[13px] font-medium text-brand-espresso">
                                    Lịch sử đơn hàng
                                  </span>
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                asChild
                                className="rounded-xl focus:bg-brand-cream/50 cursor-pointer transition-all duration-200 group/item"
                              >
                                <Link
                                  href={ROUTES.WISHLIST}
                                  className="flex items-center gap-3 px-3 py-2.5"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover/item:text-brand-espresso transition-colors relative">
                                    <Heart size={16} />
                                    {wishlistCount > 0 && (
                                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-white ring-1 ring-white">
                                        {wishlistCount}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[13px] font-medium text-brand-espresso">
                                    Sản phẩm yêu thích
                                  </span>
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                asChild
                                className="rounded-xl focus:bg-brand-cream/50 cursor-pointer transition-all duration-200 group/item"
                              >
                                <Link
                                  href="/support"
                                  className="flex items-center gap-3 px-3 py-2.5"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-brand-ivory flex items-center justify-center text-brand-taupe group-hover/item:text-brand-espresso transition-colors">
                                    <MessageCircle size={16} />
                                  </div>
                                  <span className="text-[13px] font-medium text-brand-espresso">
                                    Trung tâm hỗ trợ
                                  </span>
                                </Link>
                              </DropdownMenuItem>

                              <div className="h-[1px] bg-brand-sand/30 mx-3 my-2" />

                              <DropdownMenuItem
                                onClick={() => logout()}
                                className="rounded-xl text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer px-3 py-2.5 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                                    <LogOut size={16} />
                                  </div>
                                  <span className="text-[13px] font-bold">
                                    Đăng xuất
                                  </span>
                                </div>
                              </DropdownMenuItem>
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Link
                          href={ROUTES.LOGIN}
                          className="hidden lg:flex items-center gap-2 bg-primary text-white px-7 py-2.5 rounded-full text-xs font-bold hover:bg-brand-bronze transition-all shadow-sm hover:shadow-md"
                        >
                          Đăng nhập
                        </Link>
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

            
            <div
              className={cn(
                "hidden lg:block border-b border-brand-sand/30 bg-white transition-all duration-500 ease-in-out overflow-hidden",
                isVisible ? "h-11 opacity-100" : "h-0 opacity-0 pointer-events-none"
              )}
            >
              <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-11 flex items-center justify-center">
                <nav className="flex items-center gap-1">
                  {mounted ? (
                    (() => {
                      const categoryList = Array.isArray(categories)
                        ? categories
                        : (categories as any)?.data || [];
                      return [
                        { href: "/", label: "Trang chủ" },
                        { href: "/shop", label: "Cửa hàng" },
                        ...categoryList.slice(0, 8).map((cat: any) => ({
                          href: `/shop?categoryId=${cat.id}`,
                          label: cat.name,
                          categoryId: cat.id,
                          hasChildren: cat.children && cat.children.length > 0,
                        })),
                        { href: "/flash-sale", label: "Flash Sale 🔥", isHot: true },
                      ].map((link) => {
                        const isActive =
                          pathname === link.href ||
                          (link.href !== "/" && pathname.startsWith(link.href));
                        return (
                          <div
                            key={link.label}
                            className="relative group/nav"
                            onMouseEnter={() => {
                              if ((link as any).hasChildren) {
                                setCatOpen(true);
                                setActiveCategory((link as any).categoryId);
                              } else {
                                setCatOpen(false);
                              }
                            }}
                          >
                            <Link
                              href={link.href}
                              className={cn(
                                "px-4 py-1.5 rounded-lg text-[13px] font-medium transition-all font-sans nav-item-standard",
                                isActive
                                  ? "text-brand-bronze bg-brand-bronze/5"
                                  : "text-primary hover:bg-brand-cream hover:text-brand-bronze",
                                (link as any).isHot && "text-orange-600 font-bold"
                              )}
                            >
                              {link.label}
                            </Link>
                          </div>
                        );
                      });
                    })()
                  ) : (
                    <div className="flex items-center gap-6 font-sans">
                      <div className="px-4 py-1.5 text-[13px] font-medium text-primary nav-item-standard">
                        Trang chủ
                      </div>
                      <div className="px-4 py-1.5 text-[13px] font-medium text-primary nav-item-standard">
                        Cửa hàng
                      </div>
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <Skeleton className="w-20 h-4 rounded-md" />
                      <div className="px-4 py-1.5 text-[13px] font-bold text-orange-600 nav-item-standard">
                        Flash Sale 🔥
                      </div>
                    </div>
                  )}
                </nav>
              </div>
            </div>
          </header>
        </div>

        
        {catOpen && activeCategory && (
          <div
            className="absolute top-full left-0 w-full bg-white border-b border-brand-sand shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[50] pointer-events-auto"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <div className="max-w-[1400px] mx-auto p-10 grid grid-cols-5 gap-8">
              {categories
                ?.find((c) => c.id === activeCategory)
                ?.children?.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/shop?categoryId=${sub.id}`}
                    onClick={() => setCatOpen(false)}
                    className="flex flex-col items-center gap-3 group/sub"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-brand-cream border border-brand-sand flex items-center justify-center overflow-hidden group-hover/sub:border-brand-bronze transition-all">
                      {sub.image ? (
                        <Image
                          src={getImageUrl(sub.image)}
                          alt={sub.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <LayoutGrid className="text-brand-taupe/40" size={32} />
                      )}
                    </div>
                    <span className="text-sm font-bold text-primary group-hover/sub:text-brand-bronze">
                      {sub.name}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>

      
      <div className="h-[64px] lg:h-[146px] w-full" />

      
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-brand-cream transition-all duration-300",
          mobileSearch.isOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-4 px-4 h-20 border-b border-brand-sand bg-white">
            <HeaderSearch onSearch={mobileSearch.close} isMobile />
            <Button variant="ghost" onClick={mobileSearch.close}>
              Hủy
            </Button>
          </div>
          <div className="flex-1 p-6">
            <p className="text-xs font-bold text-brand-taupe uppercase tracking-widest mb-4">
              Phổ biến
            </p>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileMenu.isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={mobileMenu.close}
      />
      <aside
        className={cn(
          "fixed top-0 left-0 z-[110] h-full w-[300px] bg-white transition-transform lg:hidden",
          mobileMenu.isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 h-20 border-b border-brand-sand">
          <Link href="/" onClick={mobileMenu.close}>
            <Image src="/logoMT.png" alt="L" width={32} height={32} />
          </Link>
          <button onClick={mobileMenu.close}>
            <X />
          </button>
        </div>
        <MobileMenu
          categories={categories || []}
          wishlistCount={wishlistCount}
          onClose={mobileMenu.close}
          mounted={mounted}
        />
      </aside>
    </>
  );
}
