"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { sanitizeUser } from "@/utils/sanitizeUser";
import { useUpdateUser } from "@/features/users/hooks";
import { usersApi } from "@/features/users/api";
import { productsApi } from "@/features/products/api";

export const profileSchema = z.object({
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

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function useAdminProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const updateUser = useUpdateUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (user) {
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

    const updateData: any = { ...data };
    if (!data.password) delete updateData.password;

    updateUser.mutate(
      {
        id: String(user.id),
        data: updateData,
      },
      {
        onSuccess: (response: any) => {
          const updatedUser = response.user || (response.id ? response : null);
          if (updatedUser) {
            useAuthStore.getState().setUser(sanitizeUser(updatedUser) as any);
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

  return {
    user,
    form,
    onSubmit,
    isUploading,
    fileInputRef,
    handleFileChange,
    isPending: updateUser.isPending,
  };
}
