"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User as UserIcon, Camera, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useUpdateProfile } from "@/features/users/hooks";
import { useToast } from "@/hooks/useToast";
import { productsApi } from "@/features/products/api";
import type { User } from "@/types/models";
import { getImageUrl } from "@/utils/image";
import { cn } from "@/utils/cn";

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const { success, error } = useToast();
  const updateProfile = useUpdateProfile();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    gender: user.gender || "",
    birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
      });
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await productsApi.uploadImage(file);
      updateProfile.mutate(
        { avatar: url },
        {
          onSuccess: () => success("Đã cập nhật ảnh đại diện"),
        }
      );
    } catch (err) {
      error("Không thể tải ảnh đại diện lên");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(
      {
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        birthDate: form.birthDate,
      },
      {
        onSuccess: () => success("Đã cập nhật hồ sơ"),
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(61,43,26,0.03)]">
        <div className="px-6 py-5 border-b border-brand-sand/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-brand-espresso flex items-center gap-2.5">
              <UserIcon size={18} className="text-brand-bronze" /> Hồ sơ cá nhân
            </h2>
            <p className="text-[13px] text-brand-taupe mt-0.5">
              Cập nhật ảnh đại diện và thông tin cơ bản của bạn
            </p>
          </div>
        </div>

        <div className="p-6 lg:p-8 space-y-10">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-brand-sand/40">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-brand-ivory shrink-0">
              {user.avatar ? (
                <Image
                  src={getImageUrl(user.avatar)}
                  alt={user.name || ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-brand-sand/20 flex items-center justify-center text-brand-espresso text-4xl font-bold font-serif">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left space-y-3">
              <h4 className="text-sm font-bold text-brand-espresso">Ảnh đại diện</h4>
              <p className="text-[12px] text-brand-taupe leading-relaxed">
                JPG, PNG tối đa 5MB. Kích thước đề nghị 400×400px.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-brand-sand rounded-lg text-[13px] font-medium text-brand-espresso hover:bg-brand-cream cursor-pointer transition-all">
                <Camera size={14} /> Tải ảnh lên
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="profile-name" className="text-sm font-medium text-brand-espresso">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <Input
                id="profile-name"
                required
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="h-11 rounded-xl border-brand-sand focus:border-brand-espresso transition-all bg-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-display-name" className="text-sm font-medium text-brand-espresso">
                Tên hiển thị
              </label>
              <Input
                id="profile-display-name"
                value={form.name}
                readOnly
                className="h-11 rounded-xl border-brand-sand focus:border-brand-espresso transition-all bg-brand-ivory/20 text-brand-taupe cursor-default"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="profile-birth-date" className="text-sm font-medium text-brand-espresso">
                Ngày sinh
              </label>
              <Input
                id="profile-birth-date"
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm(prev => ({ ...prev, birthDate: e.target.value }))}
                className="h-11 rounded-xl border-brand-sand focus:border-brand-espresso transition-all bg-white"
              />
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-brand-espresso block">
                Giới tính
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Nữ", "Nam", "Khác"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, gender: g }))}
                    className={cn(
                      "h-11 rounded-xl border text-[13px] font-medium transition-all",
                      form.gender === g
                        ? "border-brand-espresso bg-brand-espresso text-white"
                        : "border-brand-sand text-brand-taupe hover:border-brand-taupe"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-brand-ivory/20 border-t border-brand-sand/50 flex justify-end gap-3">
          <Button
            variant="ghost"
            className="rounded-full h-10 px-6 text-[13px] font-medium text-brand-taupe"
          >
            Huỷ thay đổi
          </Button>
          <Button
            onClick={handleUpdateProfile}
            className="rounded-full h-10 px-8 text-[13px] font-bold bg-brand-espresso text-white hover:bg-brand-espresso/90 shadow-lg shadow-brand-espresso/10 transition-all"
          >
            {updateProfile.isPending ? (
              <Spinner size="sm" variant="white" />
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </div>

      
      <div className="bg-white border border-brand-sand rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(61,43,26,0.03)]">
        <div className="px-6 py-5 border-b border-brand-sand/50">
          <h2 className="text-base font-semibold text-brand-espresso flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-brand-bronze" /> Thông tin liên hệ
          </h2>
        </div>
        <div className="p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="profile-email" className="text-sm font-medium text-brand-espresso">
              Email
            </label>
            <Input
              id="profile-email"
              value={user.email}
              disabled
              className="h-11 rounded-xl border-brand-sand bg-brand-ivory/20 text-brand-taupe"
            />
            <p className="text-[11px] text-emerald-600 font-medium ml-1">
              ✓ Email đã xác minh
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="profile-phone" className="text-sm font-medium text-brand-espresso">
              Số điện thoại
            </label>
            <div className="flex gap-2">
              <Input
                id="profile-phone"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                className="h-11 rounded-xl border-brand-sand focus:border-brand-espresso bg-white flex-1"
              />
              <Button
                variant="outline"
                className="h-11 rounded-xl border-brand-sand text-[12px] font-bold text-brand-taupe hover:text-brand-espresso whitespace-nowrap"
              >
                Xác minh
              </Button>
            </div>
            <p className="text-[11px] text-amber-600 font-medium ml-1">
              ⚠ Chưa xác minh SĐT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
