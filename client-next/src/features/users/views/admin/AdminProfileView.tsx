"use client";

import { Spinner } from "@/components/ui/Spinner";
import { adminUI } from "@/constants/admin-ui";
import { ProfileForm } from "@/features/users/components/admin/profile/ProfileForm";
import { ProfileSidebar } from "@/features/users/components/admin/profile/ProfileSidebar";
import { useAdminProfile } from "@/features/users/hooks";

export function AdminProfileView() {
  const {
    user,
    form,
    onSubmit,
    isUploading,
    fileInputRef,
    handleFileChange,
    isPending,
  } = useAdminProfile();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className={adminUI.typography.heading}>Hồ sơ cá nhân</h1>
        <p className={adminUI.typography.description}>
          Quản lý thông tin tài khoản và cài đặt bảo mật của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileSidebar
          user={user}
          form={form}
          isUploading={isUploading}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
        />
        <ProfileForm form={form} onSubmit={onSubmit} isPending={isPending} />
      </div>
    </div>
  );
}
