"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/cn";

import { useCategories } from "@/features/products/hooks";
import { useSystemSettings } from "@/features/settings/hooks";

export function Footer() {
  const { data: categoryData } = useCategories();
  const { data: settingsData } = useSystemSettings();
  const settings = settingsData?.data || settingsData;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.data || [];
  const topCategories = categories.slice(0, 5);

  return (
    <footer className="bg-primary text-brand-taupe overflow-hidden relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-white p-2 rounded-2xl transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logoMT.png"
                  alt="Logo"
                  width={36}
                  height={36}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold tracking-tight text-brand-cream font-serif">
                  {mounted ? settings?.storeName || "LUXE" : "LUXE"}
                </span>
              </div>
            </Link>

            <p className="text-[13.5px] text-brand-taupe leading-relaxed max-w-sm">
              Kiến tạo trải nghiệm mua sắm đẳng cấp với những sản phẩm công nghệ và thời
              trang hàng đầu. Chính hãng 100% — Đổi trả 30 ngày — Giao toàn quốc.
            </p>

            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#", style: "hover:text-blue-600" },
                { icon: Instagram, href: "#", style: "hover:text-pink-500" },
                { icon: Twitter, href: "#", style: "hover:text-blue-400" },
                { icon: Send, href: "#", style: "hover:text-pink-500" },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`h-9 w-9 rounded-lg flex items-center border border-white/10 justify-center text-brand-taupe transition-all duration-300 ${social.style}`}
                >
                  <social.icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-[14px] font-bold text-brand-cream font-serif">
                Danh mục
              </h3>
              <ul className="space-y-3">
                {topCategories.length > 0
                  ? topCategories.map((cat: any) => (
                      <li key={cat.id}>
                        <Link
                          href={`/shop?categoryId=${cat.id}`}
                          className="text-[13.5px] text-brand-taupe hover:text-brand-cream transition-colors duration-200"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  : ["Điện tử", "Thời trang", "Gia dụng", "Sức khỏe", "Flash Sale"].map(
                      (item) => (
                        <li key={item}>
                          <Link
                            href="/shop"
                            className="text-[13.5px] text-brand-taupe hover:text-brand-cream transition-colors duration-200"
                          >
                            {item}
                          </Link>
                        </li>
                      )
                    )}
              </ul>
            </div>
            <div className="space-y-5">
              <h3 className="text-[14px] font-bold text-brand-cream font-serif">
                Hỗ trợ
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Về chúng tôi", href: "/about" },
                  { name: "Chính sách đổi trả", href: "/policy/return" },
                  { name: "Hướng dẫn chọn size", href: "/support/faq" },
                  { name: "Tra cứu đơn hàng", href: "/order-lookup" },
                  { name: "Liên hệ", href: "/contact" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-[13.5px] text-brand-taupe hover:text-brand-cream transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-[14px] font-bold text-brand-cream font-serif">
              Liên hệ
            </h3>
            <ul className="space-y-4">
              <li className="text-[13.5px] text-brand-taupe">
                {mounted
                  ? settings?.storeAddress ||
                    "109/47/1A Đường số 8, Phường Linh Xuân, TP Thủ Đức, TP Hồ Chí Minh"
                  : "109/47/1A Đường số 8, Phường Linh Xuân, TP Thủ Đức, TP Hồ Chí Minh"}
              </li>
              <li className="text-[13.5px] text-brand-taupe">
                {mounted ? settings?.storePhone || "1900 8888" : "1900 8888"}
              </li>
              <li className="text-[13.5px] text-brand-taupe">
                {mounted
                  ? settings?.storeEmail || "support@luxe.vn"
                  : "support@luxe.vn"}
              </li>
              <li className="text-[13.5px] text-brand-taupe">8:00 – 22:00 hàng ngày</li>
            </ul>
          </div>
        </div>

        
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[12px] text-brand-taupe/50">
            © 2026 {mounted ? settings?.storeName || "LUXE" : "LUXE"} All rights
            reserved.
          </span>
          <div className="flex gap-2">
            {["CASH", "VNPAY", "MoMo"].map((p) => (
              <span
                key={p}
                className="px-2.5 py-1 text-[11px] text-brand-taupe bg-white/[0.07] border border-white/10 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
