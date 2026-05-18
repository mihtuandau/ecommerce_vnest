"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  MessageCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Settings,
  Warehouse,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  Truck,
  Star,
  Bot,
  Bell,
  History,
  Key,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { handleAvatarError } from "@/utils/avatar";
import Image from "next/image";
import { usePermission } from "@/hooks/usePermission";

export interface NavSubItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<any>;
  permission: string | null;
  subItems?: NavSubItem[];
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

// Each item declares which permission is required.
// permission: null → always visible (no guard needed)
const navGroups: NavGroup[] = [
  {
    title: "TỔNG QUAN",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
      {
        label: "Thống kê",
        href: "/admin/reports",
        icon: BarChart3,
        permission: "report.view",
      },
    ],
  },
  {
    title: "SẢN PHẨM",
    items: [
      {
        label: "Sản phẩm",
        href: "/admin/products",
        icon: Package,
        permission: "product.manage",
      },
      {
        label: "Danh mục",
        href: "/admin/categories",
        icon: Layers,
        permission: "category.manage",
      },
      {
        label: "Thương hiệu",
        href: "/admin/brands",
        icon: ShieldCheck,
        permission: "product.manage",
      },
      {
        label: "Banner",
        href: "/admin/banners",
        icon: ImageIcon,
        permission: "banner.manage",
      },
      {
        label: "Khuyến mãi",
        href: "/admin/discounts",
        icon: Tag,
        permission: "discount.manage",
      },
    ],
  },
  {
    title: "BÁN HÀNG",
    items: [
      {
        label: "Đơn hàng",
        href: "/admin/orders",
        icon: ShoppingCart,
        permission: "order.manage",
      },
      {
        label: "Trả hàng",
        href: "/admin/returns",
        icon: RotateCcw,
        permission: "order.manage",
      },
      {
        label: "Thanh toán",
        href: "/admin/payments",
        icon: CreditCard,
        permission: "order.manage",
      },
    ],
  },
  {
    title: "KHÁCH HÀNG",
    items: [
      {
        label: "Người dùng",
        href: "/admin/users",
        icon: Users,
        permission: "user.manage",
      },
      {
        label: "Đánh giá",
        href: "/admin/reviews",
        icon: Star,
        permission: "product.manage",
      },
      {
        label: "Chat hỗ trợ",
        href: "/admin/chat",
        icon: MessageCircle,
        permission: "chat.support",
      },
      {
        label: "AI chatbot",
        href: "/admin/ai-chatbot",
        icon: Bot,
        permission: "settings.manage",
      },
    ],
  },
  {
    title: "HỆ THỐNG",
    items: [
      {
        label: "Thông báo",
        href: "/admin/notifications",
        icon: Bell,
        permission: "settings.manage",
      },
      {
        label: "Nhật ký",
        href: "/admin/logs",
        icon: History,
        permission: "settings.manage",
      },
      {
        label: "Phân quyền",
        href: "/admin/permissions",
        icon: Key,
        permission: "user.manage",
      },
      {
        label: "Cài đặt",
        href: "/admin/settings",
        icon: Settings,
        permission: null,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { can } = usePermission();

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Auto-expand menu that contains the active route
  useEffect(() => {
    navGroups.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems) {
          const isSubActive = item.subItems.some(sub => 
            pathname === sub.href || (sub.href !== "/admin" && pathname.startsWith(sub.href + "/"))
          );
          if (isSubActive) setExpandedMenu(item.label);
        }
      });
    });
  }, [pathname]);

  // Filter groups: only show items the user has permission for,
  // hide entire group if no items are visible
  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.permission === null ? true : can(item.permission)
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-[#18181b] text-zinc-300 transition-all duration-300 ease-in-out shadow-2xl z-20 border-r border-white/5 h-screen sticky top-0",
        isCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-6 mb-2 mt-2">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-extrabold text-sm shadow-md group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          {!isCollapsed && (
            <span className="font-medium text-[15px] tracking-tight leading-none text-white/95">
              Admin Panel
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto custom-sidebar-scrollbar pt-2">
        {visibleGroups.map((group, groupIdx) => (
          <div key={groupIdx} className={cn("space-y-2 pb-2", groupIdx > 0 && "pt-4 border-t border-white/5")}>
            {!isCollapsed && (
              <p className="px-3 text-[12.5px] font-semibold text-slate-400 mb-2 ml-1">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const hasSub = !!item.subItems;
                const isExpanded = expandedMenu === item.label;
                const isActive = hasSub 
                  ? item.subItems!.some(sub => pathname === sub.href || (sub.href !== "/admin" && pathname.startsWith(sub.href + "/")))
                  : (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href!)));

                const ItemWrapper = hasSub ? "button" : Link;
                const itemProps = hasSub 
                  ? { onClick: () => setExpandedMenu(isExpanded ? null : item.label), className: "w-full" } 
                  : { href: item.href! };

                return (
                  <div key={item.label} className="flex flex-col">
                  <ItemWrapper
                    {...(itemProps as any)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-[13px] font-normal transition-all duration-300",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-white/10 text-white"
                          : "bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                    </div>

                    {!isCollapsed && (
                      <span
                        className={cn(
                          "flex-1 truncate transition-all duration-300",
                          isActive ? "text-white" : "group-hover:translate-x-1"
                        )}
                      >
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-md text-xs font-medium tracking-tight",
                          item.badge === "New"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}

                    {!isCollapsed && hasSub && (
                      <ChevronDown className={cn("h-4 w-4 text-slate-500 transition-transform duration-300", isExpanded && "rotate-180")} />
                    )}

                    {isActive && !hasSub && (
                      <div className="absolute left-0 w-1 h-5 bg-white rounded-r-full" />
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-6 rounded-lg px-3 py-2 bg-slate-900 text-white text-xs font-normal opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl border border-white/5">
                        {item.label}
                      </div>
                    )}
                  </ItemWrapper>
                  
                  {/* Submenu */}
                  {hasSub && !isCollapsed && (
                    <div className={cn("overflow-hidden transition-all duration-300 ease-in-out", isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0")}>
                      <div className="flex flex-col gap-1 pl-11 pr-3 py-1">
                        {item.subItems!.map(sub => {
                           const isSubActive = pathname === sub.href;
                           return (
                             <Link key={sub.href} href={sub.href} className={cn(
                               "py-1 px-3 text-[12px] rounded-lg transition-colors flex items-center",
                               isSubActive ? "text-white font-normal bg-white/8" : "text-slate-400/80 hover:text-white hover:bg-white/5"
                             )}>
                               {sub.label}
                             </Link>
                           )
                        })}
                      </div>
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 bg-white/[0.01] border-t border-white/5">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-300">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
              {(user as any).avatar ? (
                <Image
                  src={(user as any).avatar}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  onError={(e) => handleAvatarError(e as any, user.name, user.email)}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary font-medium text-[10px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-normal truncate leading-tight text-white/85">
                {user.name || "Người dùng"}
              </p>
              <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                {{
                  ADMIN: "Quản trị viên",
                  KHO: "Quản lý kho",
                  BAN_HANG: "Bán hàng",
                  CUSTOMER: "Khách hàng",
                }[user.role as string] ?? user.role}
              </p>
            </div>
            {/* Logout */}
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
        {isCollapsed && user && (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
              {(user as any).avatar ? (
                <Image
                  src={(user as any).avatar}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  onError={(e) => handleAvatarError(e as any, user.name, user.email)}
                />
              ) : (
                <span className="text-primary font-bold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 h-7 w-7 rounded-lg border border-white/10 bg-[#1e293b] text-slate-400 flex items-center justify-center shadow-xl hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 z-30 group"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5" />
        )}
      </button>
    </aside>
  );
}
