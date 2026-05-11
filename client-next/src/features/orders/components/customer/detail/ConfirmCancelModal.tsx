"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmCancelModal({ isOpen, onClose, onConfirm, isLoading }: ConfirmCancelModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[360px] rounded-[2.5rem] p-8 border-slate-100 shadow-2xl">
        <DialogHeader className="space-y-4 pt-2 flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-2 text-center">
            <DialogTitle className="text-xl font-bold text-slate-900">Hủy đơn hàng?</DialogTitle>
            <p className="text-sm text-slate-500 font-medium leading-relaxed px-2">
              Bạn chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác sau khi thực hiện.
            </p>
          </div>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-3 mt-10 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all active:scale-95"
          >
            Giữ lại đơn
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-2xl h-12 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all active:scale-95"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
