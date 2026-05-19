"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/Dialog";
import { X, ZoomIn } from "lucide-react";
import { getImageUrl } from "@/utils/image";

interface ProductGalleryProps {
  images: { url: string }[];
  name: string;
}

export const ProductGallery = React.memo(function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  React.useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  const currentImage = getImageUrl(
    images?.[selectedImage]
      ? typeof images[selectedImage] === "string"
        ? images[selectedImage]
        : images[selectedImage].url
      : null
  );

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6 items-start">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 w-full md:w-20 shrink-0 overflow-x-auto md:overflow-y-auto scrollbar-hide pb-2 md:pb-0">
        {images?.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className={cn(
              "relative aspect-square w-16 md:w-full shrink-0 overflow-hidden rounded-2xl border transition-all duration-300",
              selectedImage === i
                ? "border-[#3D2B1A] shadow-md"
                : "border-[#F3EFE8] hover:border-[#C4B49A]"
            )}
          >
            <Image
              src={getImageUrl(img ? (typeof img === "string" ? img : img.url) : null)}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              className="object-contain"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="flex-1 relative aspect-square w-full overflow-hidden flex items-center justify-center bg-white rounded-[2rem] cursor-zoom-in group"
        onClick={() => setIsPreviewOpen(true)}
      >
        <Image
          src={currentImage}
          alt={name}
          fill
          priority
          className="object-contain p-2 md:p-4 transition-transform duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 800px"
        />

        <div className="absolute bottom-6 right-6 h-12 w-12 bg-white/90 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-xl border border-[#F3EFE8] flex items-center justify-center text-[#3D2B1A] translate-y-4 group-hover:translate-y-0">
          <ZoomIn size={20} />
        </div>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          hideCloseButton
          className="max-w-full h-full p-0 border-none bg-white shadow-none overflow-visible flex items-center justify-center"
        >
          <DialogTitle className="sr-only">Phóng to ảnh sản phẩm</DialogTitle>
          <DialogClose className="fixed top-8 right-8 z-50 h-12 w-12 rounded-full bg-[#3D2B1A] text-white flex items-center justify-center hover:bg-[#C4783A] transition-all shadow-xl">
            <X size={24} />
          </DialogClose>
          <div className="relative w-full h-[85vh]">
            <Image
              src={currentImage}
              alt={name}
              fill
              className="object-contain"
              sizes="95vw"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});
