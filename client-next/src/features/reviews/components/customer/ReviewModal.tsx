"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Star, Camera, X, CheckCircle2, ImagePlus } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { useCreateReview } from "../../hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { api } from "@/lib/axios";
import { useToast } from "@/hooks/useToast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  orderId: number;
  orderCode?: string;
  productName: string;
  variantName?: string;
  productImage?: string;
}

export function ReviewModal({
  isOpen,
  onClose,
  productId,
  orderId,
  orderCode,
  productName,
  variantName,
  productImage,
}: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createReview, isPending } = useCreateReview();
  const { success, error: toastError } = useToast();
  const queryClient = useQueryClient();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (selectedFiles.length + newFiles.length > 5) {
        toastError("Chỉ được tải lên tối đa 5 ảnh");
        return;
      }
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Không ép buộc nhập text quá cứng nhắc nếu đã có ảnh
    if (!comment.trim() && selectedFiles.length === 0) {
      toastError("Vui lòng nhập nhận xét hoặc thêm hình ảnh");
      return;
    }

    try {
      setIsUploading(true);
      let imageUrls: string[] = [];

      // Upload hình ảnh trước
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("files", file);
        });

        const uploadRes = await api.post("/upload/images", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // uploadRes.data.urls chứa mảng URL trả về
        imageUrls = uploadRes.data.urls || [];
      }

      // Gửi review kèm URL hình ảnh
      createReview(
        {
          productId: Number(productId),
          orderId: Number(orderId),
          rating,
          comment,
          images: imageUrls,
        },
        {
          onSuccess: () => {
            success("Cảm ơn bạn đã đánh giá sản phẩm!");
            queryClient.invalidateQueries({ queryKey: ["reviews", "product", productId] });
            queryClient.invalidateQueries({ queryKey: ["order", String(orderId)] });
            onClose();
            setComment("");
            setRating(5);
            setSelectedFiles([]);
          },
          onError: (err: any) => {
            toastError(err.response?.data?.message || err.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
          },
        }
      );
    } catch (err) {
      console.error(err);
      toastError("Có lỗi xảy ra khi tải ảnh lên, vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  const ratingTexts: Record<number, string> = {
    1: "Rất tệ",
    2: "Tệ",
    3: "Bình thường",
    4: "Tốt",
    5: "Tuyệt vời",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 border-none rounded-[28px] bg-white shadow-2xl flex flex-col overflow-visible">
        <DialogTitle className="sr-only">Đánh giá sản phẩm</DialogTitle>
        
        {/* Header */}
        <div className="p-6 pb-4 bg-slate-50/50 border-b border-slate-100 rounded-t-[28px] flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-900">Đánh giá sản phẩm</h2>
            <p className="text-[11px] text-slate-500 font-medium">Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Always side-by-side on sm+ screens */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr,200px] gap-5 items-center">
            {/* Product Summary */}
            <div className="flex items-center gap-4 p-3.5 bg-slate-50/50 rounded-[20px] border border-slate-100 min-w-0">
              <div className="h-16 w-16 rounded-xl bg-white p-1 border border-slate-200 shrink-0 shadow-sm relative overflow-hidden">
                <Image 
                  src={productImage || "/placeholder.png"} 
                  alt={productName || "Product"} 
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-slate-900 truncate leading-tight" title={productName}>
                  {productName}
                </h4>
                {variantName && (
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                    Phân loại: <span className="text-slate-700">{variantName}</span>
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">
                    <CheckCircle2 size={10} className="text-emerald-500" />
                    Đã mua hàng
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex flex-col items-center justify-center gap-2.5 sm:border-l sm:border-slate-100 pl-0 sm:pl-5">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-all duration-200 hover:scale-125 active:scale-75 focus:outline-none"
                  >
                    <span 
                      className={cn(
                        "text-3xl transition-all duration-300 cursor-pointer select-none",
                        (hoverRating || rating) >= star
                          ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]"
                          : "text-slate-100"
                      )}
                    >
                      ★
                    </span>
                  </button>
                ))}
              </div>
              <div className="h-6 flex items-center">
                { (hoverRating || rating) > 0 && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100/50 animate-in fade-in zoom-in duration-300">
                    {ratingTexts[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comment Area & Upload */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-500 px-1 tracking-wide">
              Nhận xét của bạn
            </label>
            <div className="rounded-[20px] bg-slate-50 border border-slate-200 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/5 transition-all overflow-hidden shadow-sm">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Bạn thích điểm gì? Chất liệu, form, size có đúng không? Đóng gói ra sao?..."
                className="w-full min-h-[100px] max-h-[200px] p-4 bg-transparent outline-none text-[13px] text-slate-800 placeholder:text-slate-400"
              />
              
              {/* Media Upload Area */}
              <div className="px-4 pb-3 flex items-center gap-2">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 w-14 rounded-xl border border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary transition-colors cursor-pointer shrink-0"
                >
                  <ImagePlus size={18} />
                  <span className="text-[8px] font-medium">Thêm ảnh</span>
                </button>
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2">
                  {selectedFiles.length > 0 ? (
                    selectedFiles.map((file, idx) => (
                      <div key={idx} className="h-14 w-14 rounded-xl border border-slate-200 shrink-0 relative group overflow-hidden">
                        <Image 
                          src={URL.createObjectURL(file)} 
                          alt="preview" 
                          width={56}
                          height={56}
                          unoptimized
                          className="h-full w-full object-cover" 
                        />
                        <button 
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium pl-1">Thêm ảnh thực tế để bài viết sinh động hơn!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-auto flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 rounded-[16px] h-12 text-[14px] font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isPending || isUploading}
            className="flex-[1.5] rounded-[16px] h-12 text-[14px] font-bold bg-primary hover:bg-[#0d47a1] text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {(isPending || isUploading) ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" variant="white" />
                {isUploading ? "Đang tải ảnh..." : "Đang gửi..."}
              </span>
            ) : (
              "Gửi đánh giá"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  );
}
