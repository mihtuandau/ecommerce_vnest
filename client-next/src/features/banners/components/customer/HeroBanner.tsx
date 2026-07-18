"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Banner } from "@/types/models";
import { ArrowRight } from "lucide-react";
import { BANNERS_MESSAGES } from "@/features/banners/constants";
import { cn } from "@/utils/cn";

interface HeroBannerProps {
  banners: Banner[];
}

const AUTOPLAY_MS = 6000;

export function HeroBanner({ banners }: HeroBannerProps) {
  const slides = useMemo(
    () => [...(banners || [])].sort((a, b) => a.displayOrder - b.displayOrder),
    [banners]
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hasMultiple = slides.length > 1;

  // Keep active index valid if the banner list changes underneath us
  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [slides.length, active]);

  useEffect(() => {
    if (!hasMultiple || paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [hasMultiple, paused, slides.length]);

  const banner = slides[active];

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden bg-brand-espresso"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.length > 0 ? (
        slides.map((slide, i) => {
          const img = slide.image || slide.imageUrl;
          if (!img) return null;
          return (
            <Image
              key={slide.id}
              src={img as string}
              alt={slide.title || "LUXE"}
              fill
              priority={i === 0}
              className={cn(
                "object-cover transition-opacity duration-1000 ease-in-out",
                i === active ? "opacity-100 animate-kenburns" : "opacity-0"
              )}
              sizes="100vw"
            />
          );
        })
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center font-serif text-white/[0.05] text-[26rem] leading-none select-none"
          aria-hidden
        >
          01
        </span>
      )}

      {/* Scrim: darkest at left where text sits, fading toward the photo on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-espresso via-brand-espresso/75 to-brand-espresso/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-espresso/60 via-transparent to-transparent" />

      <div className="relative z-10 w-full h-full min-h-screen flex items-center pt-28 lg:pt-32 pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-12">
          <div
            key={banner?.id ?? "empty"}
            className="w-full max-w-xl space-y-8"
          >
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-700 fill-mode-both">
              <span className="font-sans text-[11px] font-bold tracking-[0.2em] text-brand-accent">
                N° 0{active + 1}
              </span>
              <span className="h-px w-8 bg-white/30" />
              <span className="text-[11px] font-bold text-white/70 tracking-[0.2em] uppercase">
                {banner?.title?.split(" ")[0] || "Bộ sưu tập"} 2025
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] leading-[1.05] text-white tracking-tight font-serif font-bold drop-shadow-sm animate-in fade-in slide-in-from-left-6 duration-700 delay-150 fill-mode-both">
              {banner?.title ? (
                <>
                  {banner.title.split(" ").slice(0, 2).join(" ")} <br />
                  <em className="text-brand-accent not-italic">
                    {banner.title.split(" ").slice(2, 4).join(" ")}
                  </em>
                  <br />
                  {banner.title.split(" ").slice(4).join(" ")}
                </>
              ) : (
                <>
                  Phong cách <br />
                  <em className="text-brand-accent not-italic">tỏa sáng</em>
                  <br />
                  từng ngày
                </>
              )}
            </h1>

            <p className="text-[15px] text-white/75 leading-relaxed max-w-sm animate-in fade-in slide-in-from-left-6 duration-700 delay-300 fill-mode-both">
              {banner?.description ||
                "Khám phá hàng ngàn sản phẩm thời trang chính hãng, từ các thương hiệu trong nước đến quốc tế. Phong cách của bạn, sự lựa chọn của bạn."}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
              <Link
                href={banner?.link || "/shop"}
                className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-accent hover:bg-white hover:text-brand-espresso text-white px-12 py-4 rounded-full text-[14px] font-bold transition-all duration-300 shadow-xl shadow-black/20 active:scale-95"
              >
                {BANNERS_MESSAGES.CTA_PRIMARY}
              </Link>
              <Link
                href="/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[14px] font-bold text-white border border-white/30 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                {BANNERS_MESSAGES.CTA_SECONDARY}{" "}
                <ArrowRight className="w-4 h-4 text-white/70" />
              </Link>
            </div>

            <div className="flex gap-10 pt-10 border-t border-white/20 mt-10 animate-in fade-in duration-700 delay-700 fill-mode-both">
              <div>
                <p className="text-2xl text-white font-sans font-semibold">
                  12K+
                </p>
                <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase mt-1">
                  Sản phẩm
                </p>
              </div>
              <div>
                <p className="text-2xl text-white font-sans font-semibold">
                  200+
                </p>
                <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase mt-1">
                  Thương hiệu
                </p>
              </div>
              <div>
                <p className="text-2xl text-white font-sans font-semibold">
                  98%
                </p>
                <p className="text-[10px] text-white/60 font-bold tracking-widest uppercase mt-1">
                  Hài lòng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasMultiple && (
        <div className="absolute bottom-8 left-6 lg:left-12 z-10 flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem banner ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "h-[3px] rounded-full transition-all duration-500",
                i === active
                  ? "w-8 bg-brand-accent"
                  : "w-4 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
