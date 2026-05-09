"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

import { useCategories } from "@/features/products/hooks";

export function Footer() {
  const { data: categoryData } = useCategories();
  const categories = Array.isArray(categoryData) ? categoryData : categoryData?.data || [];
  const topCategories = categories.slice(0, 4);

  return (
    <footer className="bg-primary text-white overflow-hidden relative">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-10">
            <Link href="/" className="flex items-center gap-3 group">
               <div className="bg-white p-2 rounded-2xl shadow-xl shadow-black/5 transition-transform duration-300 group-hover:scale-105">
                 <Image src="/logoMT.png" alt="Logo" width={40} height={40} className="h-10 w-auto object-contain" />
               </div>
               <div className="flex flex-col">
                 <span className="text-xl font-black tracking-tighter">MINHTUAN</span>
                 <span className="text-[10px] font-bold text-white/60 tracking-[0.3em] uppercase">Store</span>
               </div>
            </Link>
            
            <p className="text-sm text-white/70 leading-relaxed max-w-sm font-medium">
              Kiến tạo trải nghiệm mua sắm đẳng cấp với những sản phẩm công nghệ và thời trang hàng đầu. Minh Tuấn Shop - Nơi chất lượng hội tụ cùng phong cách sống hiện đại.
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: Facebook, color: "hover:bg-blue-600", href: "#" },
                { icon: Instagram, color: "hover:bg-pink-600", href: "#" },
                { icon: Twitter, color: "hover:bg-sky-500", href: "#" },
                { icon: Send, color: "hover:bg-blue-500", href: "#" }
              ].map((social, i) => (
                <Link key={i} href={social.href} className={cn(
                  "h-11 w-11 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 text-white/80 transition-all duration-300 hover:text-white hover:scale-110 hover:shadow-lg",
                  social.color
                )}>
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            <div className="space-y-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Sản phẩm</h3>
              <ul className="space-y-4">
                {topCategories.length > 0 ? (
                  topCategories.map((cat: any) => (
                    <li key={cat.id}>
                      <Link href={`/shop?categoryId=${cat.id}`} className="text-sm text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                        <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  ["Điện tử", "Thời trang", "Gia dụng", "Sức khỏe"].map((item) => (
                    <li key={item}>
                      <Link href="/shop" className="text-sm text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                        <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                        {item}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Hỗ trợ</h3>
              <ul className="space-y-4">
                {[
                  { name: "Về Minh Tuấn Shop", href: "/about" },
                  { name: "Câu hỏi thường gặp", href: "/support/faq" },
                  { name: "Chính sách giao hàng", href: "/policy/shipping" },
                  { name: "Đổi trả & Hoàn tiền", href: "/policy/return" },
                  { name: "Bảo mật thông tin", href: "/policy/privacy" },
                  { name: "Điều khoản dịch vụ", href: "/policy/terms" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-sm text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                      <span className="h-px w-0 bg-white transition-all duration-300 group-hover:w-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-3 space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Liên hệ</h3>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start group">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white/60 group-hover:bg-white group-hover:text-primary transition-all">
                  <MapPin size={18} />
                </div>
                <span className="text-sm text-white/70 leading-relaxed font-medium">Tòa nhà Innovation, Khu Công nghệ cao, TP. Thủ Đức, HCM</span>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white/60 group-hover:bg-white group-hover:text-primary transition-all">
                  <Phone size={18} />
                </div>
                <span className="text-sm text-white/70 font-medium">1900 8888</span>
              </li>
              <li className="flex gap-4 items-center group">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-white/60 group-hover:bg-white group-hover:text-primary transition-all">
                  <Mail size={18} />
                </div>
                <span className="text-sm text-white/70 font-medium">support@minhtuan.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
            © 2026 MINHTUAN SHOP
          </p>
          <div className="flex items-center gap-8">
             <Link href="/policy/privacy" className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Privacy</Link>
             <Link href="/policy/terms" className="text-[11px] font-bold text-white/40 hover:text-white transition-colors uppercase tracking-widest">Terms</Link>
             <div className="h-4 w-px bg-white/10" />
             <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">Designed by Minh Tuấn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
