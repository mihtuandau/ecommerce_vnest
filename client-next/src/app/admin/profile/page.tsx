"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { useUpdateUser } from "@/features/users/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { User, Mail, Phone, Camera, Save, ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { useState, useRef, useEffect } from "react";
import { productsApi } from "@/features/products/api";
import { usersApi } from "@/features/users/api";
import { cn } from "@/utils/cn";
import { useToast } from "@/hooks/useToast";
import Image from "next/image";
import { Role } from "@/types/enums";

const profileSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  password: z
    .string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .optional()
    .or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const { success, error } = useToast();
  const updateUser = useUpdateUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-sync profile on mount
  useEffect(() => {
    const syncProfile = async () => {
      try {
        const latestUser = await usersApi.getProfile();
        if (latestUser && latestUser.id) {
          setUser(sanitizeUser(latestUser) as any);
        }
      } catch (err) {
        console.error("Auto-sync failed", err);
      }
    };
    syncProfile();
  }, [setUser]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      console.log("Syncing form with user data:", user);
      form.reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
        password: "",
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (!user?.id) return;

    // Only include password if it's not empty
    const updateData: any = { ...data };
    if (!data.password) delete updateData.password;

    updateUser.mutate(
      {
        id: String(user.id),
        data: updateData,
      },
      {
        onSuccess: (response: any) => {
          console.log("Update response:", response);
          // Robust extraction
          const updatedUser = response.user || (response.id ? response : null);

          if (updatedUser) {
            useAuthStore.getState().setUser(sanitizeUser(updatedUser) as any);
          } else {
            console.error("Failed to extract user from response", response);
          }
        },
      }
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const url = await productsApi.uploadImage(file);
        form.setValue("avatar", url);
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Hồ sơ cá nhân
        </h1>
        <p className="text-slate-500 font-medium">
          Quản lý thông tin tài khoản và cài đặt bảo mật của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
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
                  onChange={handleFileChange}
                />
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {user.name || "Người dùng"}
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                      user.role === Role.ADMIN
                        ? "bg-primary/10 text-primary"
                        : "bg-emerald-500/10 text-emerald-500"
                    )}
                  >
                    {user.role}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Tài khoản từ
              </span>
              <span className="text-xs font-bold text-slate-600">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("vi-VN")
                  : "N/A"}
              </span>
            </div>
          </Card>

          <Card className="border-none shadow-xl shadow-slate-200/50 bg-primary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <ShieldCheck size={80} strokeWidth={1} />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Bảo mật</CardTitle>
              <CardDescription className="text-white/70 text-xs font-medium">
                Tài khoản của bạn đang được bảo vệ.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] leading-relaxed text-white/80 font-medium">
                Chúng tôi khuyến nghị bạn nên đổi mật khẩu định kỳ 3 tháng một lần để
                đảm bảo an toàn tối đa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2">
          <Card className="border-none shadow-2xl shadow-slate-200/40 bg-white rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="text-xl font-bold text-slate-900">
                Chỉnh sửa thông tin
              </CardTitle>
              <CardDescription className="font-medium">
                Cập nhật thông tin chi tiết và cài đặt mật khẩu mới.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Họ và tên
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                placeholder="Nguyễn Văn A"
                                className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Địa chỉ Email
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                disabled
                                className="pl-10 h-11 border-slate-200 bg-slate-50 text-slate-500 rounded-xl font-medium cursor-not-allowed"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Số điện thoại
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="09xxxxxxx"
                                className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Mật khẩu mới (Nếu cần đổi)
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="password"
                              placeholder="••••••••"
                              className="h-11 border-slate-200 focus:border-primary focus:ring-primary/5 rounded-xl font-medium"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 px-6 rounded-xl border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                      onClick={() => form.reset()}
                    >
                      Hủy thay đổi
                    </Button>
                    <Button
                      type="submit"
                      className="h-11 px-8 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-2"
                      disabled={updateUser.isPending}
                    >
                      {updateUser.isPending ? (
                        <Spinner size="sm" variant="white" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      Lưu thay đổi
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
