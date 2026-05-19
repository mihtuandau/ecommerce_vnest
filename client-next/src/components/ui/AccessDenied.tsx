"use client";

import { ShieldOff } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface AccessDeniedProps {
  permission?: string;
  message?: string;
}

export function AccessDenied({ permission, message }: AccessDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4 p-8">
      <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <ShieldOff className="h-8 w-8 text-red-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-brand-espresso font-serif-brand">
          Không có quyền truy cập
        </h2>
        <p className="text-sm text-brand-taupe mt-1.5 max-w-sm font-medium">
          {message ??
            "Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên để được cấp quyền."}
        </p>
        {permission && (
          <p className="text-[11px] text-brand-taupe mt-2.5 font-mono bg-brand-cream/70 px-3 py-1.5 rounded-xl border border-brand-sand inline-block font-bold">
            Cần quyền: <span className="text-brand-bronze font-bold">{permission}</span>
          </p>
        )}
      </div>
      <Link
        href={ROUTES.ADMIN}
        className="text-sm font-semibold text-primary hover:underline underline-offset-4"
      >
        ← Về Dashboard
      </Link>
    </div>
  );
}
