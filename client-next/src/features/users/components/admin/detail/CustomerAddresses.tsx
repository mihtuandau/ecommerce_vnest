"use client";

import React from "react";
import { Address } from "@/types/models";
import { MapPin, Phone, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

interface CustomerAddressesProps {
  addresses: Address[];
}

export function CustomerAddresses({ addresses }: CustomerAddressesProps) {
  if (!addresses || addresses.length === 0) {
    return (
      <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-xl">
        <p className="text-slate-400 font-bold text-sm">Khách hàng chưa cập nhật địa chỉ.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div 
          key={address.id} 
          className={cn(
            "group bg-white p-5 rounded-xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4",
            address.isDefault ? "border-slate-900 bg-slate-50/30" : "border-slate-100 hover:border-slate-200"
          )}
        >
          <div className="flex-1 min-w-0 flex items-start gap-4">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border",
              address.isDefault ? "bg-slate-900 border-slate-900 text-white" : "bg-slate-50 border-slate-100 text-slate-400"
            )}>
              <MapPin className="h-5 w-5" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-900">{address.fullName}</span>
                <span className="text-slate-300">|</span>
                <span className="text-sm font-bold text-slate-600">{address.phone}</span>
                {address.isDefault && (
                  <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider h-5 px-1.5 rounded-md">
                    Mặc định
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed truncate">
                {address.street}, {address.ward || ""}, {(address as Address & { state?: string }).state || ""}, {(address as Address & { city?: string }).city || ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
             <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
              Chỉnh sửa
             </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
