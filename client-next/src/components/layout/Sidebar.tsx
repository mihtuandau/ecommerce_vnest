"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Layers, ShoppingCart, Users,
  Tag, Image, MessageCircle, BarChart3, ChevronLeft,
  ChevronRight, Settings, Warehouse,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { usePermission } from "@/hooks/usePermission";

// Each item declares which permission is required.
// permission: null → always visible (no guard needed)
const navGroups = [
  {
    title: "Tổng quan",
    items: [
      { label: "Dashboard",   href: "/admin",          icon: LayoutDashboard, permission: "dashboard.view" },
      { label: "Báo cáo",     href: "/admin/reports",  icon: BarChart3,        permission: "report.view" },
    ],
  },
  {
    title: "Quản lý sản phẩm",
    items: [
      { label: "Sản phẩm",   href: "/admin/products",   icon: Package,   permission: "product.manage" },
      { label: "Danh mục",   href: "/admin/categories", icon: Layers,    permission: "category.manage" },
      { label: "Kho hàng",   href: "/admin/inventory",  icon: Warehouse, permission: "inventory.manage" },
      { label: "Khuyến mãi", href: "/admin/discounts",  icon: Tag,       permission: "discount.manage" },
    ],
  },
  {
    title: "Kinh doanh & Khách hàng",
    items: [
      { label: "Đơn hàng",    href: "/admin/orders", icon: ShoppingCart, permission: "order.manage", badge: "3" },
      { label: "Người dùng",  href: "/admin/users",  icon: Users,        permission: "user.manage" },
      { label: "Chat",        href: "/admin/chat",   icon: MessageCircle,permission: "chat.support", badge: "New" },
    ],
  },
  {
    title: "Cài đặt hệ thống",
    items: [
      { label: "Banner",   href: "/admin/banners",  icon: Image,    permission: "banner.manage" },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings, permission: "settings.manage" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { can } = usePermission();

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
        "relative flex flex-col bg-[#0f172a] text-slate-200 transition-all duration-300 ease-in-out shadow-2xl z-20 border-r border-white/5 h-screen sticky top-0",
        isCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center px-6 mb-2 mt-2">
        <Link href="/admin" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
            V
          </div>
          {!isCollapsed && (
            <span className="font-black text-lg tracking-tighter leading-none text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 uppercase">ADMIN PANEL</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 p-4 overflow-y-auto custom-sidebar-scrollbar pt-2">
        {visibleGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-2">
            {!isCollapsed && (
              <h4 className="px-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500/80 mb-3 ml-1">
                {group.title}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-300",
                      isActive
                        ? "bg-white/5 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                        : "text-slate-400 hover:bg-white/[0.02] hover:text-white"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-300",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                        : "bg-slate-800/30 text-slate-400 group-hover:bg-slate-800/60 group-hover:text-white"
                    )}>
                      <item.icon className="h-4 w-4 shrink-0" />
                    </div>

                    {!isCollapsed && (
                      <span className={cn("flex-1 truncate transition-all duration-300", isActive ? "text-white" : "group-hover:translate-x-1")}>
                        {item.label}
                      </span>
                    )}

                    {!isCollapsed && item.badge && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-tight",
                        item.badge === "New" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                      )}>
                        {item.badge}
                      </span>
                    )}

                    {isActive && <div className="absolute left-0 w-1 h-5 bg-primary rounded-r-full" />}

                    {isCollapsed && (
                      <div className="absolute left-full ml-6 rounded-lg px-3 py-2 bg-slate-900 text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-50 shadow-2xl border border-white/5">
                        {item.label}
                      </div>
                    )}
                  </Link>
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
                <img src={(user as any).avatar} alt={user.name || "User"} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary font-bold text-[10px]">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold truncate leading-tight text-white/90">{user.name || "Người dùng"}</p>
              <p className="text-[10px] text-slate-500 truncate font-medium mt-0.5">
                {{ ADMIN: "Quản trị viên", KHO: "Quản lý kho", BAN_HANG: "Bán hàng", CUSTOMER: "Khách hàng" }[user.role as string] ?? user.role}
              </p>
            </div>
            {/* Logout */}
            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
        {isCollapsed && user && (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 overflow-hidden">
              {(user as any).avatar ? (
                <img src={(user as any).avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-primary font-bold text-[10px]">{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
              )}
            </div>
            <button onClick={logout} title="Đăng xuất" className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
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
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
