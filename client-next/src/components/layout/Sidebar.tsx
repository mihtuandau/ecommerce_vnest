"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  History,
  Image as ImageIcon,
  Key,
  Layers,
  LayoutDashboard,
  MessageCircle,
  Package,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Users,
} from "lucide-react";
import { ROLE_CONFIG } from "@/features/permissions/constants/index";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { ROUTES } from "@/constants/routes";
import { usePermission } from "@/hooks/usePermission";
import { Role } from "@/types/enums";
import { handleAvatarError } from "@/utils/avatar";
import { cn } from "@/utils/cn";

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

const navGroups: NavGroup[] = [
  {
    title: "TỔNG QUAN",
    items: [
      {
        label: "Dashboard",
        href: ROUTES.ADMIN,
        icon: LayoutDashboard,
        permission: "dashboard.view",
      },
      {
        label: "Thống kê",
        href: ROUTES.ADMIN_REPORTS,
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
        href: ROUTES.ADMIN_PRODUCTS,
        icon: Package,
        permission: "product.manage",
      },
      {
        label: "Danh mục",
        href: ROUTES.ADMIN_CATEGORIES,
        icon: Layers,
        permission: "category.manage",
      },
      {
        label: "Thương hiệu",
        href: ROUTES.ADMIN_BRANDS,
        icon: ShieldCheck,
        permission: "product.manage",
      },
      {
        label: "Banner",
        href: ROUTES.ADMIN_BANNERS,
        icon: ImageIcon,
        permission: "banner.manage",
      },
      {
        label: "Khuyến mãi",
        href: ROUTES.ADMIN_DISCOUNTS,
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
        href: ROUTES.ADMIN_ORDERS,
        icon: ShoppingCart,
        permission: "order.manage",
      },
      {
        label: "Trả hàng",
        href: ROUTES.ADMIN_RETURNS,
        icon: RotateCcw,
        permission: "order.manage",
      },
      {
        label: "Thanh toán",
        href: ROUTES.ADMIN_PAYMENTS,
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
        href: ROUTES.ADMIN_USERS,
        icon: Users,
        permission: "user.manage",
      },
      {
        label: "Đánh giá",
        href: ROUTES.ADMIN_REVIEWS,
        icon: Star,
        permission: "product.manage",
      },
      {
        label: "Chat hỗ trợ",
        href: ROUTES.ADMIN_CHAT,
        icon: MessageCircle,
        permission: "chat.support",
      },
      {
        label: "AI chatbot",
        href: ROUTES.ADMIN_AI_CHATBOT,
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
        href: ROUTES.ADMIN_NOTIFICATIONS,
        icon: Bell,
        permission: "settings.manage",
      },
      {
        label: "Nhật ký",
        href: ROUTES.ADMIN_LOGS,
        icon: History,
        permission: "settings.manage",
      },
      {
        label: "Phân quyền",
        href: ROUTES.ADMIN_PERMISSIONS,
        icon: Key,
        permission: "user.manage",
      },
      {
        label: "Cài đặt",
        href: ROUTES.ADMIN_SETTINGS,
        icon: Settings,
        permission: null,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { can } = usePermission();

  useEffect(() => {
    navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (!item.subItems) return;

        const isSubActive = item.subItems.some(
          (sub) =>
            pathname === sub.href ||
            (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`))
        );

        if (isSubActive) {
          setExpandedMenu(item.label);
        }
      });
    });
  }, [pathname]);

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
        "relative flex flex-col bg-white text-slate-600 transition-all duration-300 ease-in-out shadow-[8px_0_30px_rgba(15,23,42,0.04)] z-20 border-r border-slate-200/80 h-screen sticky top-0",
        isCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      <div className="flex h-16 items-center px-6 mb-2 mt-2">
        <Link href={ROUTES.ADMIN} className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-teal-700 flex items-center justify-center text-white font-semibold text-sm shadow-sm group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-[15px] tracking-tight leading-none text-slate-800">
              Admin Panel
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-6 p-4 overflow-y-auto custom-sidebar-scrollbar pt-2">
        {visibleGroups.map((group, groupIdx) => (
          <div
            key={group.title}
            className={cn(
              "space-y-2 pb-2",
              groupIdx > 0 && "pt-4 border-t border-slate-100"
            )}
          >
            {!isCollapsed && (
              <p className="px-3 text-xs font-medium uppercase tracking-[0.12em] text-slate-400 mb-2 ml-1">
                {group.title}
              </p>
            )}

            <div className="space-y-1">
              {group.items.map((item) => {
                const hasSub = !!item.subItems;
                const isExpanded = expandedMenu === item.label;
                const isActive = hasSub
                  ? item.subItems!.some(
                      (sub) =>
                        pathname === sub.href ||
                        (sub.href !== "/admin" && pathname.startsWith(`${sub.href}/`))
                    )
                  : pathname === item.href ||
                    (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

                const ItemWrapper = hasSub ? "button" : Link;
                const itemProps = hasSub
                  ? {
                      onClick: () => setExpandedMenu(isExpanded ? null : item.label),
                      className: "w-full",
                    }
                  : { href: item.href! };

                return (
                  <div key={item.label} className="flex flex-col">
                    <ItemWrapper
                      {...(itemProps as any)}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-teal-50 text-teal-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300",
                          isActive
                            ? "bg-teal-100 text-teal-700"
                            : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-slate-700 group-hover:shadow-sm"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                      </div>

                      {!isCollapsed && (
                        <span
                          className={cn(
                            "flex-1 truncate transition-all duration-300",
                            isActive ? "text-teal-900" : "group-hover:translate-x-1"
                          )}
                        >
                          {item.label}
                        </span>
                      )}

                      {!isCollapsed && item.badge && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 rounded-md text-xs font-medium",
                            item.badge === "New"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-teal-50 text-teal-700"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {!isCollapsed && hasSub && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-slate-500 transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )}
                        />
                      )}

                      {isActive && !hasSub && (
                        <div className="absolute left-0 w-1 h-5 bg-teal-600 rounded-r-full" />
                      )}

                      {isCollapsed && (
                        <div className="absolute left-full ml-6 rounded-lg px-3 py-2 bg-slate-900 text-white text-xs font-normal opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl border border-slate-800">
                          {item.label}
                        </div>
                      )}
                    </ItemWrapper>

                    {hasSub && !isCollapsed && (
                      <div
                        className={cn(
                          "overflow-hidden transition-all duration-300 ease-in-out",
                          isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="flex flex-col gap-1 pl-11 pr-3 py-1">
                          {item.subItems!.map((sub) => {
                            const isSubActive = pathname === sub.href;

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={cn(
                                  "py-1 px-3 text-sm rounded-lg transition-colors flex items-center",
                                  isSubActive
                                    ? "text-teal-800 font-medium bg-teal-50"
                                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                )}
                              >
                                {sub.label}
                              </Link>
                            );
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

      <div className="p-4 bg-slate-50/60 border-t border-slate-100">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl transition-all duration-300">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-200 overflow-hidden shrink-0 shadow-sm">
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
                <div className="h-full w-full flex items-center justify-center text-teal-700 font-medium text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight text-slate-700">
                {user.name || "Người dùng"}
              </p>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                {ROLE_CONFIG[user.role as Role]?.label ?? user.role}
              </p>
            </div>

            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
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
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-slate-200 overflow-hidden shadow-sm">
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
                <span className="text-teal-700 font-semibold text-xs">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
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

      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-20 h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center shadow-lg hover:text-teal-700 hover:bg-teal-50 hover:border-teal-200 transition-all duration-300 z-30 group"
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
