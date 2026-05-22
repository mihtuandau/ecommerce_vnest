"use client";

import React from "react";
import { User, Camera, ShieldCheck } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/utils/cn";
import { Role } from "@/types/enums";
import { ROLE_CONFIG } from "@/features/permissions/constants";
import { UseFormReturn } from "react-hook-form";

interface ProfileSidebarProps {
  user: any;
  form: UseFormReturn<any>;
  isUploading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileSidebar({
  user,
  form,
  isUploading,
  fileInputRef,
  onFileChange,
}: ProfileSidebarProps) {
  return (
    <div className="md:col-span-1 space-y-6">
      <Card className="border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] overflow-hidden bg-white rounded-2xl">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="relative inline-block group">
            <div className="h-32 w-32 rounded-[2.5rem] bg-primary/5 flex items-center justify-center border-2 border-primary/10 overflow-hidden shadow-2xl shadow-primary/5 mx-auto transition-all duration-500 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/10 relative">
              {form.watch("avatar") ? (
                <Image
                  src={form.watch("avatar")!}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-primary/40 bg-gradient-to-br from-primary/5 to-primary/10">
                  <User size={48} strokeWidth={1.5} />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all group-hover:scale-110 duration-300 border-4 border-white"
              disabled={isUploading}
            >
              {isUploading ? (
                <Spinner size="sm" variant="white" />
              ) : (
                <Camera size={18} />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={onFileChange}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-900">
              {user.name || "Người dùng"}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider",
                  user.role === Role.ADMIN
                    ? "bg-primary/10 text-primary"
                    : "bg-emerald-500/10 text-emerald-500"
                )}
              >
                {ROLE_CONFIG[user.role as Role]?.label ?? user.role}
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-xs font-semibold text-slate-400 tracking-tight">
                Active
              </span>
            </div>
          </div>
        </CardContent>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400 tracking-widest">
            Tài khoản từ
          </span>
          <span className="text-xs font-semibold text-slate-600">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
        </div>
      </Card>

      <Card className="border border-primary shadow-[0_4px_20px_rgba(15,23,42,0.03)] bg-primary text-white overflow-hidden relative group rounded-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
          <ShieldCheck size={80} strokeWidth={1} />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Bảo mật</CardTitle>
          <CardDescription className="text-white/70 text-xs font-medium">
            Tài khoản của bạn đang được bảo vệ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] leading-relaxed text-white/80 font-medium">
            Chúng tôi khuyến nghị bạn nên đổi mật khẩu định kỳ 3 tháng một lần để đảm
            bảo an toàn tối đa.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
