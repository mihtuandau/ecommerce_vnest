"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Award,
  Star,
  LogOut,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

export function AccountSidebar({ orderCount = 0 }: { orderCount?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, logout } = useAuthStore();
  const currentUrl =
    pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

  const menuGroups: { title: string; items: SidebarItem[] }[] = [
    {
      title: "Tài khoản",
      items: [
        { label: "Hồ sơ cá nhân", href: "/account?tab=info", icon: User },
        { label: "Bảo mật", href: "/account?tab=security", icon: ShieldCheck },
      ],
    },
    {
      title: "Mua sắm",
      items: [
        { label: "Địa chỉ của tôi", href: "/account?tab=address", icon: MapPin },
        // { label: "Đơn hàng", href: "/orders", icon: ShoppingBag, badge: orderCount }, // Removed as requested
        { label: "Đánh giá của tôi", href: "/account?tab=reviews", icon: Star },
      ],
    },
    {
      title: "Khác",
      items: [{ label: "Thông báo", href: "/account?tab=notifications", icon: Bell }],
    },
  ];

  if (!user) return null;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden sticky top-32 shadow-[0_10px_30px_rgba(61,43,26,0.05)]">
        
        <div className="p-6 border-b border-brand-sand/50 text-center bg-brand-ivory/20">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden bg-brand-ivory ring-1 ring-brand-sand flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-brand-espresso font-serif">
                  {user.name?.charAt(0)}
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base font-semibold text-brand-espresso mb-1">
            {user.name}
          </h3>
          <p className="text-[12px] text-brand-taupe">{user.email}</p>
        </div>

        
        <nav className="p-2 space-y-4 py-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              <div className="px-4 mb-1.5">
                <span className="text-[11px] font-semibold text-brand-taupe/80 uppercase tracking-wider">
                  {group.title}
                </span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = currentUrl === item.href || pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all group relative",
                        isActive
                          ? "bg-brand-ivory text-brand-espresso font-semibold"
                          : "text-brand-taupe hover:bg-brand-ivory/50 hover:text-brand-espresso font-medium"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-1 bg-brand-espresso rounded-r-full" />
                      )}
                      <item.icon
                        size={16}
                        className={cn(
                          "shrink-0",
                          isActive
                             ? "text-brand-espresso"
                            : "text-brand-taupe group-hover:text-brand-espresso"
                        )}
                      />
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-brand-bronze text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="px-2 pt-2 border-t border-brand-sand/50">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all group font-medium"
            >
              <LogOut size={16} className="shrink-0" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
