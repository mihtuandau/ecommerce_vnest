"use client";

import { Address } from "@/types/models";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

interface CustomerAddressesProps {
  addresses: Address[];
}

export function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
        <p className="text-sm font-medium text-slate-400">
          Khách hàng chưa cập nhật địa chỉ.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          className={cn(
            "group flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-200 md:flex-row md:items-center",
            address.isDefault
              ? "border-teal-600 bg-teal-50/20"
              : "border-slate-100 hover:border-slate-200"
          )}
        >
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                address.isDefault
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-100 bg-slate-50 text-slate-400"
              )}
            >
              <MapPin className="h-5 w-5" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-slate-900">
                  {address.fullName}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-medium text-slate-600">
                  {address.phone}
                </span>
                {address.isDefault && (
                  <Badge className="h-5 rounded-lg border-none bg-teal-600 px-1.5 text-xs font-medium text-white shadow-sm">
                    Mặc định
                  </Badge>
                )}
              </div>
              <p className="truncate text-sm leading-relaxed text-slate-500">
                {address.street}, {address.ward || ""},{" "}
                {(address as Address & { state?: string }).state || ""},{" "}
                {(address as Address & { city?: string }).city || ""}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Chỉnh sửa
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
