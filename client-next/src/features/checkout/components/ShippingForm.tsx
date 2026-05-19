"use client";

import React from "react";
import { MapPin, User, Truck, Mail } from "lucide-react";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <div className="bg-white rounded-2xl border border-brand-sand shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-brand-ivory flex items-center gap-4 bg-white/50 backdrop-blur-sm">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <MapPin size={16} />
        </div>
        <h2 className="text-[18px] font-bold text-primary font-serif tracking-widest">
          1. Thông tin giao hàng
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-primary ml-1 flex items-center gap-2">
              <User size={14} className="text-brand-bronze" /> Họ và tên người nhận
            </label>
            <Input
              required
              placeholder="Nhập họ và tên..."
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary placeholder:text-brand-taupe/40"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-primary ml-1 flex items-center gap-2">
              <Truck size={14} className="text-brand-bronze" /> Số điện thoại
            </label>
            <Input
              required
              placeholder="09xx xxx xxx"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary placeholder:text-brand-taupe/40"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[13px] font-medium text-primary ml-1 flex items-center gap-2">
              <Mail size={14} className="text-brand-bronze" /> Email nhận thông báo
            </label>
            <Input
              required
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary placeholder:text-brand-taupe/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-primary ml-1">
              Tỉnh / Thành phố
            </label>
            <Select value={form.provinceId} onValueChange={handleProvinceChange}>
              <SelectTrigger className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary">
                <SelectValue placeholder="Chọn Tỉnh/Thành" />
              </SelectTrigger>
              <SelectContent className="rounded-[12px]">
                {provinces.map((p) => (
                  <SelectItem
                    key={p.ProvinceID}
                    value={p.ProvinceID.toString()}
                    className="text-sm"
                  >
                    {p.ProvinceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-primary ml-1">
              Quận / Huyện
            </label>
            <Select
              value={form.districtId}
              onValueChange={handleDistrictChange}
              disabled={!form.provinceId || isLoadingDistricts}
            >
              <SelectTrigger className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary">
                <SelectValue
                  placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn Quận/Huyện"}
                />
              </SelectTrigger>
              <SelectContent className="rounded-[12px]">
                {districts.map((d) => (
                  <SelectItem
                    key={d.DistrictID}
                    value={d.DistrictID.toString()}
                    className="text-sm"
                  >
                    {d.DistrictName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-primary ml-1">
              Phường / Xã
            </label>
            <Select
              value={form.wardCode}
              onValueChange={handleWardChange}
              disabled={!form.districtId || isLoadingWards}
            >
              <SelectTrigger className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary">
                <SelectValue
                  placeholder={isLoadingWards ? "Đang tải..." : "Chọn Phường/Xã"}
                />
              </SelectTrigger>
              <SelectContent className="rounded-[12px]">
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
          <label className="text-[13px] font-medium text-primary ml-1 flex items-center gap-2">
            <MapPin size={14} className="text-brand-bronze" /> Địa chỉ cụ thể
          </label>
          <Input
            required
            placeholder="Số nhà, tên đường..."
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="rounded-[12px] h-12 border-brand-sand bg-white focus-visible:ring-1 focus-visible:ring-brand-bronze/30 focus-visible:border-brand-bronze transition-all text-sm font-medium text-primary placeholder:text-brand-taupe/40"
          />
        </div>
      </div>
    </div>
  );
});
