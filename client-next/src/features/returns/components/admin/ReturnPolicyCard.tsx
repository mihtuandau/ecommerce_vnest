import React from "react";
import { AlertCircle } from "lucide-react";

export function ReturnPolicyCard() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
      <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
        <AlertCircle size={16} />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-slate-900">
          Chính sách đổi trả hàng
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          Khi phê duyệt yêu cầu trả hàng, hãy đảm bảo khách hàng đã cung cấp đầy đủ
          hình ảnh bằng chứng về tình trạng sản phẩm. Hệ thống sẽ cập nhật trạng thái
          đơn hàng tương ứng khi bạn thay đổi trạng thái yêu cầu.
        </p>
      </div>
    </div>
  );
}
