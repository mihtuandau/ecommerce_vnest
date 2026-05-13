"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/cn";

import { useCategories } from "@/features/products/hooks";

export function Footer() {
  const { data: categoryData } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.data || [];
  const topCategories = categories.slice(0, 5);

  return (
    <footer className="bg-[#2A2420] text-[#C4B49A] overflow-hidden relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-14 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
               <div className="bg-white p-2 rounded-2xl transition-transform duration-300 group-hover:scale-105">
                 <Image src="/logoMT.png" alt="Logo" width={36} height={36} className="h-9 w-auto object-contain" />
               </div>
               <div className="flex flex-col">
                 <span className="text-lg font-semibold tracking-tight text-[#FAF8F4]" style={{ fontFamily: "'Playfair Display', serif" }}>MINHTUAN</span>
                 <span className="text-[10px] font-medium text-[#C4B49A] tracking-[0.2em] uppercase">Store</span>
               </div>
            </Link>
            
            <p className="text-[13.5px] text-[#C4B49A] leading-relaxed max-w-sm">
              Kiến tạo trải nghiệm mua sắm đẳng cấp với những sản phẩm công nghệ và thời trang hàng đầu. Chính hãng 100% — Đổi trả 30 ngày — Giao toàn quốc.
            </p>
            
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Send, href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className="h-9 w-9 rounded-lg flex items-center justify-center bg-white/[0.07] border border-white/10 text-[#C4B49A] hover:bg-[#C4783A] hover:text-white hover:border-[#C4783A] transition-all duration-300">
                  <social.icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-5">
              <h3 className="text-[12px] font-medium text-[#FAF8F4] uppercase tracking-[0.1em]">Danh mục</h3>
              <ul className="space-y-3">
                {topCategories.length > 0 ? (
                  topCategories.map((cat: any) => (
                    <li key={cat.id}>
                      <Link href={`/shop?categoryId=${cat.id}`} className="text-[13.5px] text-[#C4B49A] hover:text-[#FAF8F4] transition-colors duration-200">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  ["Điện tử", "Thời trang", "Gia dụng", "Sức khỏe", "Flash Sale"].map((item) => (
                    <li key={item}>
                      <Link href="/shop" className="text-[13.5px] text-[#C4B49A] hover:text-[#FAF8F4] transition-colors duration-200">
                        {item}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="space-y-5">
              <h3 className="text-[12px] font-medium text-[#FAF8F4] uppercase tracking-[0.1em]">Hỗ trợ</h3>
              <ul className="space-y-3">
                {[
                  { name: "Về chúng tôi", href: "/about" },
                  { name: "Chính sách đổi trả", href: "/policy/return" },
                  { name: "Hướng dẫn chọn size", href: "/support/faq" },
                  { name: "Tra cứu đơn hàng", href: "/order-lookup" },
                  { name: "Liên hệ", href: "/contact" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[13.5px] text-[#C4B49A] hover:text-[#FAF8F4] transition-colors duration-200">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-5">
            <h3 className="text-[12px] font-medium text-[#FAF8F4] uppercase tracking-[0.1em]">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="text-[13.5px] text-[#C4B49A]">📍 Tòa nhà Innovation, Khu CNC, TP. Thủ Đức</li>
              <li className="text-[13.5px] text-[#C4B49A]">📞 1900 8888 (miễn phí)</li>
              <li className="text-[13.5px] text-[#C4B49A]">✉️ support@minhtuan.vn</li>
              <li className="text-[13.5px] text-[#C4B49A]">⏰ 8:00 – 22:00 hàng ngày</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[12px] text-[#C4B49A]/50">
            © 2025 MINHTUAN SHOP. Bảo lưu mọi quyền.
          </span>
          <div className="flex gap-2">
            {["CASH", "VNPAY", "MoMo", "PayOS"].map(p => (
              <span key={p} className="px-2.5 py-1 text-[11px] text-[#C4B49A] bg-white/[0.07] border border-white/10 rounded">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
