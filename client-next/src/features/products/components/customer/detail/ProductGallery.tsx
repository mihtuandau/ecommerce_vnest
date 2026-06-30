"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, X, ZoomIn } from "lucide-react";
import { cn } from "@/utils/cn";
import { getImageUrl } from "@/utils/image";
import { useToast } from "@/hooks/useToast";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useWishlistStore } from "@/features/wishlist/store/wishlist.store";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/Dialog";
import type { Product } from "@/types/models";

interface ProductGalleryProps {
  images: { url: string }[];
  name: string;
  product: Product;
}

export const ProductGallery = React.memo(function ProductGallery({
  images,
  name,
  product,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { success, error } = useToast();
  const user = useAuthStore((state) => state.user);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorite = isInWishlist(String(product.id));

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

  const handleToggleWishlist = () => {
    if (!user) {
      error("Vui lòng đăng nhập để sử dụng chức năng yêu thích!");
      return;
    }

    toggleWishlist({
      id: String(product.id),
      variantId: product.variants?.[0]?.id || product.id,
      name: product.name,
      price: product.price || product.basePrice,
      imageUrl: currentImage,
      slug: product.slug,
      stock: product.stock,
      categoryId: product.categoryId,
      categoryName: product.category?.name || "Bộ sưu tập LUXE",
    });

    if (!isFavorite) success("Đã thêm vào danh sách yêu thích");
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: name,
          text: `Xem sản phẩm ${name}`,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      success("Đã sao chép liên kết sản phẩm");
    } catch (err) {
      if ((err as DOMException)?.name === "AbortError") return;
      error("Chưa thể chia sẻ sản phẩm, vui lòng thử lại");
    }
  };

  return (
    <div className="flex flex-col-reverse items-start gap-6 md:flex-row">
      <div className="flex w-full shrink-0 gap-3 overflow-x-auto pb-2 scrollbar-hide md:w-20 md:flex-col md:overflow-y-auto md:pb-0">
        {images?.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedImage(i)}
            className={cn(
              "relative aspect-square w-16 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 md:w-full",
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

      <div className="group relative flex aspect-square w-full flex-1 items-center justify-center overflow-hidden rounded-[2rem] bg-white">
        <Image
          src={currentImage}
          alt={name}
          fill
          priority
          className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-[1.03] md:p-4"
          sizes="(max-width: 768px) 100vw, 800px"
        />

        <div className="absolute right-5 top-5 z-10 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleToggleWishlist}
            aria-label="Thêm vào yêu thích"
            title="Thêm vào yêu thích"
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur-md transition-all active:scale-95",
              isFavorite
                ? "border-brand-bronze bg-brand-bronze text-white"
                : "border-brand-sand/60 text-primary hover:border-brand-bronze hover:bg-brand-ivory hover:text-brand-bronze"
            )}
          >
            <Heart
              size={18}
              strokeWidth={1.9}
              className={cn(isFavorite && "fill-current")}
            />
          </button>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            aria-label="Phóng to ảnh"
            title="Phóng to ảnh"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand/60 bg-white/90 text-primary shadow-sm backdrop-blur-md transition-all hover:border-brand-bronze hover:bg-brand-ivory hover:text-brand-bronze active:scale-95"
          >
            <ZoomIn size={18} strokeWidth={1.9} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Chia sẻ sản phẩm"
            title="Chia sẻ sản phẩm"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand/60 bg-white/90 text-primary shadow-sm backdrop-blur-md transition-all hover:border-brand-bronze hover:bg-brand-ivory hover:text-brand-bronze active:scale-95"
          >
            <Share2 size={18} strokeWidth={1.9} />
          </button>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent
          hideCloseButton
          className="flex h-full max-w-full items-center justify-center overflow-visible border-none bg-white p-0 shadow-none"
        >
          <DialogTitle className="sr-only">Phóng to ảnh sản phẩm</DialogTitle>
          <DialogClose className="fixed right-8 top-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#3D2B1A] text-white shadow-xl transition-all hover:bg-[#C4783A]">
            <X size={24} />
          </DialogClose>
          <div className="relative h-[85vh] w-full">
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
