"use client";

import React from "react";
import Image from "next/image";
import { MessageSquare, Image as ImageIcon } from "lucide-react";

interface ReturnRequestCardProps {
  request: any;
}

export function ReturnRequestCard({ request }: ReturnRequestCardProps) {
  return (
    <div className="space-y-6">
      {/* Thông tin lý do */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
        <div className="flex items-center gap-2.5 text-slate-900">
          <MessageSquare size={18} className="text-slate-700" />
          <h3 className="text-base font-semibold tracking-tight">
            Thông tin yêu cầu
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/50">
            <span className="text-xs font-semibold text-slate-400 block mb-1.5">
              Lý do chính
            </span>
            <p className="text-sm font-semibold text-slate-900">
              {request.reason}
            </p>
          </div>

          <div className="space-y-1.5 px-0.5">
            <span className="text-xs font-semibold text-slate-400 block mb-1.5">
              Mô tả chi tiết
            </span>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {request.details || "Không có mô tả thêm từ khách hàng."}
            </p>
          </div>
        </div>
      </div>

      {/* Hình ảnh bằng chứng */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-5">
        <div className="flex items-center gap-2.5 text-slate-900">
          <ImageIcon size={18} className="text-slate-700" />
          <h3 className="text-base font-semibold tracking-tight">
            Hình ảnh bằng chứng
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {request.images?.length > 0 ? (
            request.images.map((url: string, i: number) => (
              <div
                key={i}
                className="aspect-square rounded-2xl overflow-hidden border border-slate-200 group cursor-zoom-in shadow-sm relative"
              >
                <Image
                  src={url}
                  alt={`Evidence ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  onClick={() => window.open(url, "_blank")}
                  sizes="200px"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs font-medium text-slate-400">
                Không có hình ảnh đính kèm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
