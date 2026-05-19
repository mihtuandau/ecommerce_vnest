"use client";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/types/models";
import { ArrowRight, Sparkles } from "lucide-react";
import { BANNERS_MESSAGES } from "../../constants";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  // Use the first active banner from data, fallback to placeholder if none
  const banner = banners?.[0];

  return (
    <section className="relative w-full flex flex-col lg:flex-row overflow-hidden bg-[#FAF8F4]">
      {/* LEFT CONTENT */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-16 px-6 lg:py-24 lg:px-16 xl:px-24">
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E8E0D0]/50 border border-[#E8E0D0] px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4783A] animate-pulse" />
            <span className="text-[11px] font-bold text-[#8A7966] tracking-[0.2em] uppercase">
              {banner?.title?.split(" ")[0] || "Bộ sưu tập"} 2025
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] text-[#3D2B1A] tracking-tight font-serif-brand font-bold">
            {banner?.title ? (
              <>
                {banner.title.split(" ").slice(0, 2).join(" ")} <br />
                <em className="text-[#C4783A] not-italic">
                  {banner.title.split(" ").slice(2, 4).join(" ")}
                </em>
                <br />
                {banner.title.split(" ").slice(4).join(" ")}
              </>
            ) : (
              <>
                Phong cách <br />
                <em className="text-[#C4783A] not-italic">tỏa sáng</em>
                <br />
                từng ngày
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-[15px] text-[#8A7966] leading-relaxed max-w-sm">
            {banner?.description ||
              "Khám phá hàng ngàn sản phẩm thời trang chính hãng, từ các thương hiệu trong nước đến quốc tế. Phong cách của bạn, sự lựa chọn của bạn."}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link
              href={banner?.link || "/shop"}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#3D2B1A] hover:bg-[#C4783A] text-[#FAF8F4] px-12 py-4 rounded-full text-[14px] font-bold transition-all duration-300 shadow-xl shadow-[#3D2B1A]/10 active:scale-95"
            >
              {BANNERS_MESSAGES.CTA_PRIMARY}
            </Link>
            <Link
              href="/collections"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[14px] font-bold text-[#3D2B1A] border border-[#DDD6C8] hover:border-[#C4783A] hover:bg-white transition-all duration-300"
            >
              {BANNERS_MESSAGES.CTA_SECONDARY}{" "}
              <ArrowRight className="w-4 h-4 text-[#8A7966]" />
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-10 border-t border-[#DDD6C8]/60 mt-10">
            <div>
              <p className="text-2xl text-[#3D2B1A] font-sans font-semibold">12K+</p>
              <p className="text-[10px] text-[#8A7966] font-bold tracking-widest uppercase mt-1">
                Sản phẩm
              </p>
            </div>
            <div>
              <p className="text-2xl text-[#3D2B1A] font-sans font-semibold">200+</p>
              <p className="text-[10px] text-[#8A7966] font-bold tracking-widest uppercase mt-1">
                Thương hiệu
              </p>
            </div>
            <div>
              <p className="text-2xl text-[#3D2B1A] font-sans font-semibold">98%</p>
              <p className="text-[10px] text-[#8A7966] font-bold tracking-widest uppercase mt-1">
                Hài lòng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-full lg:w-1/2 relative min-h-[600px] lg:min-h-0 bg-[#E8E0D0] overflow-hidden flex items-center justify-center">
        {/* Abstract design elements */}
        <div className="absolute w-[400px] h-[400px] lg:w-[550px] lg:h-[550px] rounded-full border border-[#C4B49A]/30 flex items-center justify-center animate-spin-slow">
          <div className="w-[300px] h-[300px] lg:w-[420px] lg:h-[420px] rounded-full bg-[#C4B49A]/10 flex items-center justify-center">
            <div className="w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] rounded-full bg-[#C4B49A]/20 flex items-center justify-center">
              <span className="text-[#3D2B1A] text-center italic text-xl opacity-60 font-serif">
                Thời trang <br />
                không chỉ là <br />
                quần áo
              </span>
            </div>
          </div>
        </div>

        {/* Floating Accent Card */}
        <div className="absolute bottom-8 right-8 lg:bottom-16 lg:right-16 z-20 w-64 md:w-72 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-[0_32px_80px_rgba(61,43,26,0.15)] border border-white transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-3xl">
          <div className="bg-[#FAF8F4] h-48 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center border border-[#DDD6C8]/40">
            {banner && (banner.image || banner.imageUrl) ? (
              <Image
                src={(banner.image || banner.imageUrl) as string}
                alt="Banner Card"
                fill
                className="object-cover"
              />
            ) : (
              <Sparkles className="w-10 h-10 text-[#C4783A]/20" />
            )}
          </div>
          <p className="text-[10px] text-[#C4783A] font-bold uppercase tracking-[0.2em] mb-1">
            Mùa hè 2025
          </p>
          <p className="text-[14px] font-bold text-[#3D2B1A] mb-3 leading-tight line-clamp-1">
            {banner?.title || "Premium Collection"}
          </p>
          <div className="flex items-center justify-between border-t border-[#F3EFE8] pt-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#8A7966] uppercase tracking-wider font-bold">
                Giá ưu đãi
              </span>
              <span className="text-[16px] font-bold text-[#3D2B1A] font-sans">
                890.000đ
              </span>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex text-[#C4783A] text-[10px] mb-0.5">★★★★★</div>
              <span className="text-[#8A7966] text-[9px] font-bold">428 REVIEWS</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
