"use client";
import Image from "next/image";

import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Banner } from "@/types/models";

interface HeroBannerProps {
  banners: Banner[];
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 6000); // Slightly slower for a more cinematic feel
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative h-[420px] md:h-[600px] lg:h-[750px] w-full overflow-hidden group">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image */}
          <Image
            src={banner.image || banner.imageUrl || "/placeholder.png"}
            alt={banner.title}
            fill
            className="object-cover transition-transform duration-[10000ms] ease-out scale-100 group-hover:scale-110"
            priority={index === 0}
            sizes="100vw"
          />
          
          {/* Cinematic Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent flex items-center">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl space-y-6 md:space-y-8 animate-in slide-in-from-left-8 duration-1000 ease-out">
                <div className="space-y-3 md:space-y-4">
                  <span className="inline-block text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-primary/20 backdrop-blur-md">
                    Minh Tuấn Shop Exclusive
                  </span>
                  <h2 className="text-3xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] md:leading-[1.05] tracking-tighter drop-shadow-2xl">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-sm md:text-xl text-white/80 line-clamp-2 max-w-lg font-medium leading-relaxed drop-shadow">
                      {banner.description}
                    </p>
                  )}
                </div>
                
                {banner.link && (
                  <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-4">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full px-6 md:px-10 h-11 md:h-14 text-sm md:text-lg font-bold shadow-2xl shadow-primary/40 transition-transform hover:scale-105 active:scale-95"
                    >
                      <Link href={banner.link}>Khám phá</Link>
                    </Button>
                    <button className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                      <Zap className="h-5 w-5 md:h-6 md:w-6 fill-primary text-primary" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + banners.length) % banners.length)
            }
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % banners.length)}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-20 h-14 w-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/20 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${
                  i === current ? "w-8 md:w-12 bg-primary" : "w-2 md:w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Sub-component for decorative icon
function Zap({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 14.71 13 3l-2.29 8.29H20l-9 11.71 2.29-8.29H4Z" />
    </svg>
  );
}
