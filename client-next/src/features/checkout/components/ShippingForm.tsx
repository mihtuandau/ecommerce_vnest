"use client";

import React from "react";
import { MapPin, User, Truck, Mail, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";
import Link from "next/link";

interface ShippingFormProps {
  form: any;
  setForm: (form: any) => void;
  provinces: any[];
  districts: any[];
  wards: any[];
  handleProvinceChange: (id: string) => void;
  handleDistrictChange: (id: string) => void;
  handleWardChange: (code: string) => void;
  isLoadingDistricts?: boolean;
  isLoadingWards?: boolean;
  user?: any;
}

export function ShippingForm({
  form,
  setForm,
  provinces,
  districts,
  wards,
  handleProvinceChange,
  handleDistrictChange,
  handleWardChange,
  isLoadingDistricts,
  isLoadingWards,
  user
}: ShippingFormProps) {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
            <MapPin className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Thông tin nhận hàng</h2>
        </div>
        
        {user && (
          <Link 
            href="/account?tab=address" 
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full transition-all hover:bg-blue-100"
          >
            <Settings size={12} />
            Thay đổi địa chỉ
          </Link>
        )}
      </div>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <User className="h-3.5 w-3.5" /> Họ và tên người nhận
            </label>
            <Input 
              required 
              placeholder="Nguyễn Văn A" 
              value={form.fullName}
              onChange={(e) => setForm({...form, fullName: e.target.value})}
              autoComplete="off"
              className="rounded-xl h-11 border-slate-200 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <Truck className="h-3.5 w-3.5" /> Số điện thoại
            </label>
            <Input 
              required 
              placeholder="09xx xxx xxx" 
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              autoComplete="off"
              className="rounded-xl h-11 border-slate-200 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-slate-500 flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" /> Email nhận thông báo
            </label>
            <Input 
              required 
              type="email"
              placeholder="example@gmail.com" 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              autoComplete="off"
              className="rounded-xl h-11 border-slate-200 focus:ring-primary/10 transition-all text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Tỉnh / Thành phố</label>
            <Select value={form.provinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger className="rounded-xl h-11 border-slate-200 text-sm">
                <SelectValue placeholder="Chọn Tỉnh/Thành" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 max-h-[300px]">
                {provinces.map((p) => (
                  <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()} className="text-sm py-2">
                    {p.ProvinceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Quận / Huyện</label>
            <Select 
              value={form.districtId} 
              onValueChange={handleDistrictChange}
              disabled={!form.provinceId || isLoadingDistricts}
            >
              <SelectTrigger className="rounded-xl h-11 border-slate-200 text-sm">
                <SelectValue placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn Quận/Huyện"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 max-h-[300px]">
                {districts.map((d) => (
                  <SelectItem key={d.DistrictID} value={d.DistrictID.toString()} className="text-sm py-2">
                    {d.DistrictName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-500">Phường / Xã</label>
            <Select 
              value={form.wardCode} 
              onValueChange={handleWardChange}
              disabled={!form.districtId || isLoadingWards}
            >
              <SelectTrigger className="rounded-xl h-11 border-slate-200 text-sm">
                <SelectValue placeholder={isLoadingWards ? "Đang tải..." : "Chọn Phường/Xã"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 max-h-[300px]">
                {wards.map((w) => (
                  <SelectItem key={w.WardCode} value={w.WardCode} className="text-sm py-2">
                    {w.WardName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">Địa chỉ cụ thể</label>
          <Input 
            required 
            placeholder="Số nhà, tên đường..." 
            value={form.street}
            onChange={(e) => setForm({...form, street: e.target.value})}
            autoComplete="off"
            className="rounded-xl h-11 border-slate-200 focus:ring-primary/10 transition-all text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
