"use client";

import React from "react";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";

import { adminUI } from "@/constants/admin-ui";

interface MediaProps {
  images: string[];
  isUploading: boolean;
  onImageAdd: () => void;
  onImageRemove: (index: number) => void;
}

export function Media({ images, isUploading, onImageAdd, onImageRemove }: MediaProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-4">
        <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
          <ImagePlus className="h-4 w-4 text-slate-500" /> Hình ảnh sản phẩm
        </h3>
        <span className="shrink-0 text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase leading-none h-fit">
          Đã tải: {images.length}/10
        </span>
      </div>

      <div className="p-6 space-y-6">
        <p className="text-xs text-slate-500 font-medium -mt-2">
          Ảnh đầu tiên sẽ được chọn làm ảnh đại diện cho sản phẩm.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-slate-400 transition-all group shadow-sm bg-slate-50"
            >
              <Image
                src={url}
                alt="Product"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-lg shadow-sm">
                  Ảnh đại diện
                </div>
              )}
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={onImageAdd}
              disabled={isUploading}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-400 hover:bg-slate-50/50 flex flex-col items-center justify-center gap-3 transition-all duration-200 text-slate-400 hover:text-slate-600 group relative overflow-hidden focus:outline-none focus:ring-4 focus:ring-slate-100/50"
            >
              {isUploading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center transition-colors">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center px-1">
                    Tải ảnh lên
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
