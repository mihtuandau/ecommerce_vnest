"use client";

import React from "react";
import { MapPin, User, Truck, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/Select";

type Province = {
  ProvinceID: number;
  ProvinceName: string;
};

type District = {
  DistrictID: number;
  DistrictName: string;
};

type Ward = {
  WardCode: string;
  WardName: string;
};

interface ShippingFormProps {
  form: {
    fullName: string;
    phone: string;
    email: string;
    provinceId: string;
    districtId: string;
    wardCode: string;
    street: string;
  };
  setForm: (form: any) => void;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  handleProvinceChange: (id: string) => void;
  handleDistrictChange: (id: string) => void;
  handleWardChange: (code: string) => void;
  isLoadingDistricts?: boolean;
  isLoadingWards?: boolean;
  user?: any;
}

export const ShippingForm = React.memo(function ShippingForm({
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
}: ShippingFormProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">Thông tin giao hàng</h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={12} className="text-primary" /> Họ và tên người nhận
            </label>
            <Input 
              required 
              placeholder="Nhập họ và tên..." 
              value={form.fullName}
              onChange={(e) => setForm({...form, fullName: e.target.value})}
              className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Truck size={12} className="text-primary" /> Số điện thoại
            </label>
            <Input 
              required 
              placeholder="09xx xxx xxx" 
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} className="text-primary" /> Email nhận thông báo
            </label>
            <Input 
              required 
              type="email"
              placeholder="example@gmail.com" 
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tỉnh / Thành phố</label>
            <Select value={form.provinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium">
                <SelectValue placeholder="Chọn Tỉnh/Thành" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {provinces.map((p) => (
                  <SelectItem key={p.ProvinceID} value={p.ProvinceID.toString()} className="text-sm">
                    {p.ProvinceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quận / Huyện</label>
            <Select 
              value={form.districtId} 
              onValueChange={handleDistrictChange}
              disabled={!form.provinceId || isLoadingDistricts}
            >
              <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium">
                <SelectValue placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn Quận/Huyện"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {districts.map((d) => (
                  <SelectItem key={d.DistrictID} value={d.DistrictID.toString()} className="text-sm">
                    {d.DistrictName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phường / Xã</label>
            <Select 
              value={form.wardCode} 
              onValueChange={handleWardChange}
              disabled={!form.districtId || isLoadingWards}
            >
              <SelectTrigger className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium">
                <SelectValue placeholder={isLoadingWards ? "Đang tải..." : "Chọn Phường/Xã"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {wards.map((w) => (
                  <SelectItem key={w.WardCode} value={w.WardCode} className="text-sm">
                    {w.WardName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <MapPin size={12} className="text-primary" /> Địa chỉ cụ thể
          </label>
          <Input 
            required 
            placeholder="Số nhà, tên đường..." 
            value={form.street}
            onChange={(e) => setForm({...form, street: e.target.value})}
            className="rounded-xl h-11 border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm font-medium"
          />
        </div>
      </div>
    </div>
  );
});
