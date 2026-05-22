"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { productsApi } from "@/features/products/api/products.api";
import { usersApi } from "@/features/users/api";
import { useUpdateUser } from "@/features/users/hooks/mutations";
import { profileSchema, type ProfileFormValues } from "@/features/users/schemas";
import { sanitizeUser } from "@/utils/sanitizeUser";

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
        if (latestUser?.id) {
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

    const updateData: Partial<ProfileFormValues> = { ...data };
    if (!data.password) delete updateData.password;

    updateUser.mutate(
      {
        id: String(user.id),
        data: updateData as any,
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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await productsApi.uploadImage(file);
      form.setValue("avatar", url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
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
