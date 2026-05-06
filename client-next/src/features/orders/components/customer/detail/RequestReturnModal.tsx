"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/hooks/useToast";
import { returnsApi } from "@/features/returns/api";
import { Camera, X, Loader2, AlertCircle } from "lucide-react";
import { productsApi } from "@/features/products/api";
import { cn } from "@/utils/cn";

interface RequestReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderCode: string;
  onSuccess: () => void;
  isGuest?: boolean;
  contact?: string;
}

const REASONS = [
  "Sản phẩm lỗi/hỏng do nhà sản xuất",
  "Giao sai sản phẩm / kích thước / màu sắc",
  "Sản phẩm không giống mô tả",
  "Sản phẩm bị bể vỡ khi vận chuyển",
  "Lý do khác",
];

export function RequestReturnModal({
  isOpen,
  onClose,
  orderId,
  orderCode,
  onSuccess,
  isGuest,
  contact,
}: RequestReturnModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => productsApi.uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...urls]);
    } catch (err) {
      toastError("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0) {
      return toastError("Vui lòng tải lên ít nhất một hình ảnh bằng chứng");
    }

    console.log("[RequestReturnModal] Submitting return request:", {
      isGuest,
      orderId: Number(orderId),
      orderCode,
      contact,
      data
    });
    
    setIsSubmitting(true);
    try {
      if (isGuest) {
        await returnsApi.createGuestReturnRequest({
          orderCode,
          contact: contact || "",
          reason: data.reason,
          details: data.details,
          images,
        });
      } else {
        await returnsApi.createReturnRequest({
          orderId: Number(orderId),
          reason: data.reason,
          details: data.details,
          images,
        });
      }
      success("Yêu cầu trả hàng đã được gửi thành công");
      reset();
      setImages([]);
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
        <DialogHeader className="px-6 py-5 bg-slate-50/50 border-b border-slate-100">
          <DialogTitle className="text-lg font-bold text-slate-900">Yêu cầu trả hàng</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium text-[11px]">
            Đơn hàng #{orderCode}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-700">Lý do trả hàng <span className="text-rose-500">*</span></Label>
              <select
                {...register("reason", { required: "Vui lòng chọn lý do" })}
                className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-[13px] focus:outline-none focus:border-primary/50 transition-all font-medium"
              >
                <option value="">Chọn lý do...</option>
                {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.reason && <p className="text-[11px] text-rose-500 font-medium ml-1">{errors.reason.message as string}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-semibold text-slate-700">Mô tả chi tiết</Label>
              <Textarea
                {...register("details")}
                placeholder="Vui lòng mô tả rõ tình trạng sản phẩm..."
                className="min-h-[100px] rounded-xl p-3 resize-none !bg-white !border-[0.5px] !border-slate-200 !text-slate-900 placeholder:text-slate-400 text-[13px] focus-visible:!ring-0 focus-visible:!border-primary/50 transition-all outline-none !ring-offset-0"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[13px] font-semibold text-slate-700">Hình ảnh bằng chứng <span className="text-rose-500">*</span></Label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                    <img src={url} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                    {isUploading ? <Loader2 size={18} className="animate-spin text-primary" /> : <Camera size={18} className="text-slate-400 group-hover:text-primary transition-colors" />}
                    <span className="text-[10px] font-semibold text-slate-400 group-hover:text-primary transition-colors">Tải ảnh</span>
                  </label>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 italic">
                <AlertCircle size={12} />
                Tải lên ít nhất 1 ảnh rõ nét về tình trạng sản phẩm
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="h-10 rounded-lg font-semibold text-slate-500 text-[13px]">
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading} className="h-10 rounded-lg px-6 font-semibold bg-primary hover:bg-slate-800 shadow-sm transition-all text-[13px]">
              {isSubmitting ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
