"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2 group p-2 rounded-xl w-fit bg-white">
              <div className="relative h-10 w-24">
                <Image
                  src="/logoMT.png"
                  alt="MINHTUANSHOP"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-7 w-32">
                <Image
                  src="/textlogo.png"
                  alt="MINHTUANSHOP"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm text-blue-50/90 leading-relaxed max-w-sm font-medium">
              Nền tảng thương mại điện tử hàng đầu cung cấp các sản phẩm chất lượng cao với trải nghiệm mua sắm tuyệt vời, giao diện tối giản và tốc độ vượt trội.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white hover:text-[#1565C0] text-white transition-all border border-white/20">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white hover:text-[#E1306C] text-white transition-all border border-white/20">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 bg-white/10 hover:bg-white hover:text-[#1DA1F2] text-white transition-all border border-white/20">
                <Twitter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6">Sản phẩm</h3>
            <ul className="space-y-4">
              <li><Link href="/category/dien-tu" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Điện tử & Công nghệ</Link></li>
              <li><Link href="/category/thoi-trang" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Thời trang cao cấp</Link></li>
              <li><Link href="/category/gia-dung" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Nhà cửa & Đời sống</Link></li>
              <li><Link href="/category/suc-khoe" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Sức khỏe & Sắc đẹp</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6">Hỗ trợ</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Về Minh Tuấn Shop</Link></li>
              <li><Link href="/support/faq" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link href="/policy/shipping" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Chính sách giao hàng</Link></li>
              <li><Link href="/policy/return" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Đổi trả & Hoàn tiền</Link></li>
              <li><Link href="/policy/privacy" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Bảo mật thông tin</Link></li>
              <li><Link href="/policy/terms" className="text-[13px] font-normal text-white/80 hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-6">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin className="h-4 w-4 shrink-0 text-white/60 mt-0.5" />
                <span className="text-[13px] font-normal text-white/90 leading-snug">Tòa nhà Innovation, Khu Công nghệ cao, TP. Thủ Đức, HCM</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-[13px] font-normal text-white">1900 8888</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="h-4 w-4 shrink-0 text-white/60" />
                <span className="text-[13px] font-normal text-white/90">support@minhtuan.vn</span>
              </li>
              <li className="pt-2">
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white hover:text-primary rounded-full text-xs font-bold transition-all border border-white/10">
                  Gửi lời nhắn <Send className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-medium text-white/60">
            © 2025 Minh Tuấn Shop. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/60">Thiết kế bởi Minh Tuấn</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
