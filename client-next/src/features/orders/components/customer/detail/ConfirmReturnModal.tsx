"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

interface ConfirmReturnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmReturnModal({ isOpen, onClose, onConfirm, isLoading }: ConfirmReturnModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] rounded-2xl p-6 border-slate-100 shadow-xl">
        <DialogHeader className="space-y-3 pt-2">
          <DialogTitle className="text-[16px] font-bold text-slate-900 text-center">Xác nhận gửi hàng</DialogTitle>
          <p className="text-[13px] text-slate-500 font-medium text-center leading-relaxed">
            Bạn đã chắc chắn bàn giao gói hàng cho bưu cục? Thao tác này sẽ cập nhật tiến trình cho shop theo dõi.
          </p>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-3 mt-6 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-10 border-slate-200 text-slate-600 font-semibold text-[13px] hover:bg-slate-50"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-xl h-10 bg-[#1565C1] hover:bg-[#0d47a1] text-white font-semibold text-[13px] shadow-sm"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
