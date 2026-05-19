"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmCancelModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmCancelModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-0 border-[#DDD6C8] shadow-2xl overflow-hidden font-sans-brand">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-[#FCEAEA] flex items-center justify-center text-[#C44040] border border-[#F0C0C0]">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-[#3D2B1A] font-serif-brand">
                Xác nhận hủy đơn
              </DialogTitle>
              <p className="text-[14px] text-[#8A7966] font-medium leading-relaxed px-4">
                Bạn chắc chắn muốn hủy đơn hàng này? Hành động này sẽ không thể hoàn tác
                sau khi xác nhận.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full h-12 bg-[#C44040] text-white rounded-xl font-bold text-[13px] transition-all hover:bg-[#A33535] disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận hủy đơn hàng"}
            </button>
            <button
              onClick={onClose}
              className="w-full h-12 bg-white border border-[#DDD6C8] text-[#3D2B1A] rounded-xl font-bold text-[13px] transition-all hover:bg-[#FAF8F4]"
            >
              Quay lại
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
