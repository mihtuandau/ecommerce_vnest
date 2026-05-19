"use client";

import React from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { CheckoutCard } from "./CheckoutCard";

interface SavedAddressesProps {
  addresses: any[];
  selectedAddressId: string | number | null;
  setSelectedAddressId: (id: string | number | null) => void;
  applySavedAddress: (addr: any) => void;
  onManageClick: () => void;
}

export function SavedAddresses({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  applySavedAddress,
  onManageClick,
}: SavedAddressesProps) {
  return (
    <CheckoutCard
      step="1"
      title="Địa chỉ đã lưu"
      action={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-sm font-semibold text-brand-bronze hover:underline p-0 h-auto"
          onClick={onManageClick}
        >
          Quản lý
        </Button>
      }
    >
      <div className="space-y-[10px]">
        {addresses.map((addr: any) => (
          <div
            key={addr.id}
            onClick={() => applySavedAddress(addr)}
            className={cn(
              "p-4 rounded-[12px] border transition-all cursor-pointer flex items-start gap-3",
              selectedAddressId === addr.id
                ? "border-primary bg-brand-ivory ring-1 ring-primary/20"
                : "border-brand-sand hover:border-brand-bronze/30 hover:bg-brand-ivory"
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all mt-1",
                selectedAddressId === addr.id
                  ? "border-primary bg-primary"
                  : "border-brand-sand bg-white"
              )}
            >
              {selectedAddressId === addr.id && (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-in zoom-in-50 duration-200" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-[14.5px] font-semibold text-primary mb-1 flex items-center gap-2">
                {addr.fullName}
                {addr.isDefault && (
                  <span className="text-[10px] bg-brand-bronze/10 text-brand-bronze px-2 py-[2px] rounded-full font-bold uppercase tracking-tighter">
                    Mặc định
                  </span>
                )}
              </div>
              <p className="text-[13px] text-brand-taupe line-clamp-2">
                {addr.street}, {addr.ward}, {addr.district || addr.city}, {addr.province || addr.state}
              </p>
              <p className="text-[13px] text-brand-taupe mt-1.5 font-medium">
                📞 {addr.phone}
              </p>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={onManageClick}
          className="flex items-center justify-center gap-2 text-sm border-[1.5px] border-dashed rounded-[10px] py-[11px] px-4 w-full transition-all font-semibold mt-2 h-auto hover:bg-brand-cream/55 bg-transparent border-brand-sand text-brand-bronze hover:bg-brand-ivory hover:border-brand-bronze hover:text-brand-bronze"
        >
          <span className="text-[18px]">+</span> Nhập địa chỉ mới
        </Button>
      </div>
    </CheckoutCard>
  );
}
