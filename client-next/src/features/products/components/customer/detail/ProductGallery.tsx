"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/Dialog";
import { X } from "lucide-react";

interface ProductGalleryProps {
  images: { url: string }[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Reset selection when images list changes (e.g., when variant is selected)
  React.useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  const getImageUrl = (img: { url: string } | string | undefined) => {
    if (!img) return "/placeholder.png";
    const rawUrl = typeof img === 'string' ? img : img.url;
    return rawUrl?.startsWith('http') ? rawUrl : `/${rawUrl}`;
  };

  const currentImage = getImageUrl(images?.[selectedImage]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Vertical Thumbnails (Desktop) */}
      <div className="hidden md:flex flex-col gap-3 w-16 shrink-0">
        {images?.map((img, i) => (
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
      <div 
        className="flex-1 relative aspect-square max-h-[600px] overflow-hidden flex items-center justify-center p-0 cursor-zoom-in group"
        onClick={() => setIsPreviewOpen(true)}
      >
        <img
          src={currentImage}
          alt={name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Zoom Hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-slate-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
      </div>

      {/* Mobile Thumbnails */}
      <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide w-full">
        {images?.map((img, i) => (
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

      {/* Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent 
          hideCloseButton
          className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none overflow-visible flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Phóng to ảnh sản phẩm</DialogTitle>
          <DialogClose className="fixed top-12 right-6 sm:top-6 sm:right-6 z-50 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/70 transition-all">
            <X className="h-6 w-6" />
          </DialogClose>
          <img 
            src={currentImage} 
            alt={name} 
            className="max-w-full max-h-[90vh] object-contain rounded-sm shadow-xl"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
