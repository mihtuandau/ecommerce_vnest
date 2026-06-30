"use client";

import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface MediaProps {
  images: string[];
  isUploading: boolean;
  onImageAdd: () => void;
  onImageRemove: (index: number) => void;
}

export function Media({ images, isUploading, onImageAdd, onImageRemove }: MediaProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/30 px-6 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <ImagePlus className="h-4 w-4 text-slate-500" />
          Hình ảnh sản phẩm
        </h3>
        <span className="h-fit shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium leading-none text-slate-600">
          Đã tải: {images.length}/10
        </span>
      </div>

      <div className="space-y-6 p-6">
        <p className="-mt-2 text-xs font-medium text-slate-500">
          Ảnh đầu tiên sẽ được chọn làm ảnh đại diện cho sản phẩm.
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-2xl border-2 border-transparent bg-slate-50 shadow-sm transition-all hover:border-teal-500"
            >
              <Image
                src={url}
                alt="Product"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onImageRemove(index)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-lg transition-transform hover:scale-110"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute left-2.5 top-2.5 rounded-lg bg-teal-700 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
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
              className="group relative flex aspect-square flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 transition-all duration-200 hover:border-teal-500 hover:bg-teal-50/40 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-100/70"
            >
              {isUploading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 transition-colors group-hover:bg-white">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <span className="px-1 text-center text-xs font-medium">
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
