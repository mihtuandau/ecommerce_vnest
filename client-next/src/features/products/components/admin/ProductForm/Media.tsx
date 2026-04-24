"use client";

import React from "react";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface MediaProps {
  images: string[];
  isUploading: boolean;
  onImageAdd: () => void;
  onImageRemove: (index: number) => void;
}

export function Media({ images, isUploading, onImageAdd, onImageRemove }: MediaProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
       <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
               <ImagePlus className="h-5 w-5 text-primary" />
               Hình ảnh sản phẩm
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Ảnh đầu tiên sẽ được chọn làm ảnh đại diện cho sản phẩm.</p>
          </div>
          <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-md uppercase">
            Đã tải: {images.length}/10
          </span>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {images.map((url, index) => (
            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all group shadow-sm bg-slate-50">
              <img src={url} alt="Product" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
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
                <div className="absolute top-2 left-2 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm">
                  Ảnh bìa
                </div>
              )}
            </div>
          ))}
          {images.length < 10 && (
            <button
              type="button"
              onClick={onImageAdd}
              disabled={isUploading}
              className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-slate-50 flex flex-col items-center justify-center gap-3 transition-all text-slate-400 hover:text-primary group relative overflow-hidden"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center transition-colors">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tải ảnh lên</span>
                </>
              )}
            </button>
          )}
       </div>
    </div>
  );
}
