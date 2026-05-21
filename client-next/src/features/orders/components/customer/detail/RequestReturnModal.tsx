"use client";

import React, { useState } from "react";
import Image from "next/image";
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
import { returnsApi } from "@/features/returns/api/index";
import { Camera, X, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { productsApi } from "@/features/products/api/products.api";
import { cn } from "@/utils/cn";

interface RequestReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  orderCode: string;
  onSuccess: () => void;
  isGuest?: boolean;
  contact?: string;
  orderItems?: Array<{ id: number; quantity: number }>;
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
  orderItems = [],
}: RequestReturnModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        productsApi.uploadImage(file)
      );
      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (err) {
      toastError("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    if (images.length === 0) {
      return toastError("Vui lòng tải lên ít nhất một hình ảnh bằng chứng");
    }

    if (orderItems.length === 0) {
      return toastError("Không tìm thấy sản phẩm trong đơn để trả hàng");
    }

    const items = orderItems.map((item) => ({
      orderItemId: item.id,
      quantity: item.quantity,
    }));

    setIsSubmitting(true);
    try {
      if (isGuest) {
        await returnsApi.createGuestReturnRequest({
          orderCode,
          contact: contact || "",
          reason: data.reason,
          details: data.details,
          images,
          items,
        });
      } else {
        await returnsApi.createReturnRequest({
          orderId: Number(orderId),
          reason: data.reason,
          details: data.details,
          images,
          items,
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
      <DialogContent className="sm:max-w-[550px] rounded-2xl p-0 overflow-hidden border-[#DDD6C8] shadow-2xl bg-white font-sans-brand">
        <div className="px-8 py-6 border-b border-[#DDD6C8] bg-[#FAF8F4]">
          <DialogTitle className="text-2xl font-bold text-[#3D2B1A] font-serif-brand">
            Yêu cầu trả hàng
          </DialogTitle>
          <p className="text-[12px] text-[#8A7966] font-bold uppercase tracking-[0.1em] mt-1">
            Đơn hàng #{orderCode}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-[#3D2B1A] uppercase tracking-[0.06em]">
                Lý do trả hàng <span className="text-[#C44040]">*</span>
              </Label>
              <select
                {...register("reason", { required: "Vui lòng chọn lý do" })}
                className="w-full h-12 bg-white border border-[#DDD6C8] rounded-xl px-4 text-[13.5px] text-[#3D2B1A] focus:outline-none focus:border-[#C4B49A] transition-all font-medium appearance-none"
              >
                <option value="">Chọn lý do phù hợp...</option>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="text-[11px] text-[#C44040] font-bold ml-1">
                  {errors.reason.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-[13px] font-bold text-[#3D2B1A] uppercase tracking-[0.06em]">
                Mô tả chi tiết
              </Label>
              <Textarea
                {...register("details")}
                placeholder="Vui lòng mô tả rõ tình trạng sản phẩm để LUXE hỗ trợ bạn tốt nhất..."
                className="min-h-[120px] rounded-xl p-4 resize-none !bg-white !border-[#DDD6C8] !text-[#3D2B1A] placeholder:text-[#8A7966]/50 text-[13.5px] focus-visible:!ring-0 focus-visible:!border-[#C4B49A] transition-all outline-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[13px] font-bold text-[#3D2B1A] uppercase tracking-[0.06em]">
                Hình ảnh bằng chứng <span className="text-[#C44040]">*</span>
              </Label>
              <div className="grid grid-cols-4 gap-3">
                {images.map((url, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#DDD6C8] group shadow-sm"
                  >
                    <Image src={url} alt="Evidence" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-[#C44040] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#DDD6C8] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C4783A] hover:bg-[#FAF8F4] transition-all group">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                    {isUploading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Camera
                        size={20}
                        className="text-[#8A7966] group-hover:text-[#C4783A] transition-colors"
                      />
                    )}
                    <span className="text-[10px] font-bold text-[#8A7966] uppercase tracking-widest group-hover:text-[#C4783A] transition-colors">
                      Tải ảnh
                    </span>
                  </label>
                )}
              </div>
              <p className="text-[11px] text-[#8A7966] font-medium flex items-center gap-1.5 italic">
                <AlertCircle size={13} className="text-[#C4783A]" />
                Tải lên ít nhất 1 ảnh rõ nét về tình trạng sản phẩm (Tối đa 4 ảnh)
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-[#DDD6C8]">
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full h-12 bg-[#3D2B1A] text-white rounded-xl font-bold text-[13.5px] transition-all hover:bg-[#2A2420] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting && <Spinner size="sm" variant="white" />}
              {isSubmitting ? "Đang gửi yêu cầu..." : "Gửi yêu cầu trả hàng"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full h-12 bg-white border border-[#DDD6C8] text-[#8A7966] hover:text-[#8A7966] rounded-xl font-bold text-[13.5px] transition-all hover:bg-[#FAF8F4] hover:border-[#C4B49A]"
            >
              Quay lại
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
