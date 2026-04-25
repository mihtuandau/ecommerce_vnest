"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: any[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Reset selection when images list changes (e.g., when variant is selected)
  React.useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  const getImageUrl = (img: any) => {
    const rawUrl = typeof img === 'string' ? img : img?.url || "";
    return rawUrl?.startsWith('http') ? rawUrl : `/${rawUrl}`;
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Vertical Thumbnails (Desktop) */}
      <div className="hidden md:flex flex-col gap-3 w-16 shrink-0">
        {images?.map((img: any, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-xl border transition-all",
              selectedImage === i ? "border-slate-900 shadow-sm" : "border-slate-100 hover:border-slate-300"
            )}
          >
            <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="flex-1 relative aspect-square max-h-[600px] overflow-hidden flex items-center justify-center p-0">
        <img
          src={getImageUrl(images?.[selectedImage])}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Mobile Thumbnails */}
      <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full">
        {images?.map((img: any, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={cn(
              "relative h-14 w-14 flex-shrink-0 aspect-square overflow-hidden rounded-xl border transition-all",
              selectedImage === i ? "border-slate-900 shadow-sm" : "border-slate-100"
            )}
          >
            <img src={getImageUrl(img)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
